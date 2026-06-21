import { ClientStatus } from "@prisma/client";
import { Eye, Pencil, Plus, Power, PowerOff, Trash2 } from "lucide-react";
import Link from "next/link";

import { AlertBanner } from "@/components/feedback/alert-banner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ClickableRow } from "@/components/data/clickable-row";
import { actionButtonClass, iconActionClass } from "@/components/data/icon-action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireStaff } from "@/lib/auth-guards";
import { appConfig } from "@/lib/config";
import { readFlash } from "@/lib/flash";
import { clearFlash } from "@/lib/flash-actions";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import { setClientStatus } from "./actions";
import { DeleteClientDialog } from "./delete-client-dialog";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", { dateStyle: "short" }).format(date);

const currency = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

const StatusBadge = ({ status }: { status: ClientStatus }) =>
  status === ClientStatus.ACTIVE ? (
    <Badge className="border-transparent bg-green-600 text-white">Activo</Badge>
  ) : (
    <Badge variant="outline">Inactivo</Badge>
  );

export default async function ClientsPage() {
  const session = await requireStaff();
  const role = session.user.role;
  const canUpdate = can(role, "update", "clients");
  const canDelete = can(role, "delete", "clients");

  const flash = await readFlash();

  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      company: true,
      status: true,
      baseRate: true,
      createdAt: true,
    },
  });

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          title="Clientes"
          actions={
            can(role, "create", "clients") ? (
              <Link href="/clients/new" className={actionButtonClass("create")}>
                <Plus className="size-4" />
                Nuevo cliente
              </Link>
            ) : null
          }
        />

        {flash ? (
          <AlertBanner
            key={flash.id}
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
                <TableHead>Empresa</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Tarifa</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No hay clientes registrados. Crea el primero para empezar.
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => {
                  const active = client.status === ClientStatus.ACTIVE;
                  const rowHref = canUpdate
                    ? `/clients/${client.id}/edit`
                    : `/clients/${client.id}`;

                  return (
                    <ClickableRow
                      key={client.id}
                      href={rowHref}
                      actions={
                        <>
                          <Link
                            href={`/clients/${client.id}`}
                            className={iconActionClass("view")}
                            aria-label="Ver"
                            title="Ver detalles"
                          >
                            <Eye className="size-4" />
                          </Link>

                          {canUpdate ? (
                            <Link
                              href={`/clients/${client.id}/edit`}
                              className={iconActionClass("edit")}
                              aria-label="Editar"
                              title="Editar"
                            >
                              <Pencil className="size-4" />
                            </Link>
                          ) : null}

                          {canUpdate ? (
                            <form action={setClientStatus}>
                              <input type="hidden" name="clientId" value={client.id} />
                              <input
                                type="hidden"
                                name="status"
                                value={active ? ClientStatus.INACTIVE : ClientStatus.ACTIVE}
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

                          {canDelete ? (
                            <DeleteClientDialog clientId={client.id} clientName={client.name}>
                              <button
                                type="button"
                                className={iconActionClass("delete")}
                                aria-label="Eliminar"
                                title="Eliminar"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </DeleteClientDialog>
                          ) : null}
                        </>
                      }
                    >
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email ?? "—"}</TableCell>
                      <TableCell>{client.company ?? "—"}</TableCell>
                      <TableCell>
                        <StatusBadge status={client.status} />
                      </TableCell>
                      <TableCell>
                        {client.baseRate ? currency.format(Number(client.baseRate)) : "—"}
                      </TableCell>
                      <TableCell>{formatDate(client.createdAt)}</TableCell>
                    </ClickableRow>
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
