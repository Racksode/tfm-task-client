import { UserRole, UserStatus } from "@prisma/client";
import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdmin } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

import { setUserStatus } from "./actions";

type UsersPageProps = {
  searchParams?: Promise<{ error?: string; success?: string }>;
};

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

export default async function UsersPage({ searchParams }: UsersPageProps) {
  await requireAdmin();

  const params = await searchParams;

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
      <div className="grid gap-6 p-8">
        <PageHeader
          eyebrow="Usuarios"
          title="Gestión de usuarios"
          description="Administra los usuarios internos y de cliente del MVP."
          actions={
            <Button asChild>
              <Link href="/users/new">Nuevo usuario</Link>
            </Button>
          }
        />

        {params?.error ? (
          <Alert variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}
        {params?.success ? (
          <Alert>
            <AlertDescription>{params.success}</AlertDescription>
          </Alert>
        ) : null}

        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
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
                users.map((user) => (
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
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/users/${user.id}/edit`}>Editar</Link>
                        </Button>
                        <form action={setUserStatus}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input
                            type="hidden"
                            name="status"
                            value={
                              user.status === UserStatus.ACTIVE
                                ? UserStatus.INACTIVE
                                : UserStatus.ACTIVE
                            }
                          />
                          <Button type="submit" variant="ghost" size="sm">
                            {user.status === UserStatus.ACTIVE ? "Desactivar" : "Activar"}
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppShell>
  );
}
