import { UserRole, UserStatus } from "@prisma/client";
import { Eye, Pencil, Power, PowerOff, Trash2 } from "lucide-react";
import Link from "next/link";

import { AlertBanner } from "@/components/feedback/alert-banner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { iconActionClass } from "@/components/data/icon-action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdmin } from "@/lib/auth-guards";
import { appConfig } from "@/lib/config";
import { readFlash } from "@/lib/flash";
import { clearFlash } from "@/lib/flash-actions";
import { canManageUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import { setUserStatus } from "./actions";
import { DeleteUserDialog } from "./delete-user-dialog";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", { dateStyle: "short" }).format(date);

const RoleBadge = ({ role }: { role: UserRole }) =>
  role === UserRole.INTERNAL ? (
    <Badge>INTERNAL</Badge>
  ) : (
    <Badge variant="secondary">CLIENT</Badge>
  );

const StatusBadge = ({ status }: { status: UserStatus }) =>
  status === UserStatus.ACTIVE ? (
    <Badge className="border-transparent bg-green-600 text-white">Activo</Badge>
  ) : (
    <Badge variant="outline">Inactivo</Badge>
  );

export default async function UsersPage() {
  const session = await requireAdmin();
  const actorRole = session.user.role;
  const actorId = session.user.id;

  const flash = await readFlash();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      client: { select: { name: true } },
    },
  });

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          eyebrow="Usuarios"
          title="Gestión de usuarios"
          actions={
            <Button asChild>
              <Link href="/users/new">Nuevo usuario</Link>
            </Button>
          }
        />

        {flash ? (
          <AlertBanner
            key={flash.message}
            type={flash.type}
            message={flash.message}
            dismissMs={appConfig.alertAutoDismissMs}
            onShow={clearFlash}
          />
        ) : null}

        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No hay usuarios registrados. Crea el primero para empezar.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const manageable = canManageUser(actorRole, user.role);
                  const isSelf = user.id === actorId;
                  const active = user.status === UserStatus.ACTIVE;

                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={user.status} />
                      </TableCell>
                      <TableCell>{user.client?.name ?? "Sin cliente"}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/users/${user.id}`}
                            className={iconActionClass("view")}
                            aria-label="Ver"
                            title="Ver detalles"
                          >
                            <Eye className="size-4" />
                          </Link>

                          {manageable ? (
                            <Link
                              href={`/users/${user.id}/edit`}
                              className={iconActionClass("edit")}
                              aria-label="Editar"
                              title="Editar"
                            >
                              <Pencil className="size-4" />
                            </Link>
                          ) : null}

                          {manageable && !isSelf ? (
                            <form action={setUserStatus}>
                              <input type="hidden" name="userId" value={user.id} />
                              <input
                                type="hidden"
                                name="status"
                                value={active ? UserStatus.INACTIVE : UserStatus.ACTIVE}
                              />
                              <button
                                type="submit"
                                className={iconActionClass(active ? "deactivate" : "activate")}
                                aria-label={active ? "Desactivar" : "Activar"}
                                title={active ? "Desactivar" : "Activar"}
                              >
                                {active ? (
                                  <PowerOff className="size-4" />
                                ) : (
                                  <Power className="size-4" />
                                )}
                              </button>
                            </form>
                          ) : null}

                          {manageable && !isSelf ? (
                            <DeleteUserDialog userId={user.id} userName={user.name}>
                              <button
                                type="button"
                                className={iconActionClass("delete")}
                                aria-label="Eliminar"
                                title="Eliminar"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </DeleteUserDialog>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppShell>
  );
}
