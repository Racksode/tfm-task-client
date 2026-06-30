import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ClickableRow } from "@/components/data/clickable-row";
import {
  actionButtonClass,
  iconActionClass,
} from "@/components/data/icon-action";
import { AlertBanner } from "@/components/feedback/alert-banner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import { DeleteRateDialog } from "./delete-rate-dialog";
import {
  RATE_SCOPE_BADGE,
  RATE_SCOPE_LABELS,
  RATE_STATUS_BADGE,
  RATE_STATUS_LABELS,
  formatHourlyRate,
} from "./status";

export default async function RatesPage() {
  const session = await requireStaff();
  const role = session.user.role;

  // Las tarifas son configuración de negocio: solo ADMIN+.
  if (!can(role, "view", "rates")) {
    redirect("/dashboard");
  }

  const canUpdate = can(role, "update", "rates");
  const canDelete = can(role, "delete", "rates");
  const flash = await readFlash();

  const rates = await prisma.rate.findMany({
    orderBy: [{ status: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      hourlyAmount: true,
      currency: true,
      scope: true,
      status: true,
      isDefault: true,
      client: { select: { name: true } },
      project: { select: { name: true } },
    },
  });

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          title="Tarifas"
          actions={
            can(role, "create", "rates") ? (
              <Link href="/rates/new" className={actionButtonClass("create")}>
                <Plus className="size-4" />
                Nueva tarifa
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
            clearFlashOnShow
          />
        ) : null}

        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Nombre</TableHead>
                <TableHead>Ámbito</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Importe</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No hay tarifas. Crea la primera para empezar.
                  </TableCell>
                </TableRow>
              ) : (
                rates.map((rate) => {
                  const rowHref = canUpdate
                    ? `/rates/${rate.id}/edit`
                    : `/rates/${rate.id}`;
                  const target = rate.client?.name ?? rate.project?.name ?? "—";

                  return (
                    <ClickableRow
                      key={rate.id}
                      href={rowHref}
                      actions={
                        <>
                          <Link
                            href={`/rates/${rate.id}`}
                            className={iconActionClass("view")}
                            aria-label="Ver"
                            title="Ver detalles"
                          >
                            <Eye className="size-4" />
                          </Link>

                          {canUpdate ? (
                            <Link
                              href={`/rates/${rate.id}/edit`}
                              className={iconActionClass("edit")}
                              aria-label="Editar"
                              title="Editar"
                            >
                              <Pencil className="size-4" />
                            </Link>
                          ) : null}

                          {canDelete ? (
                            <DeleteRateDialog rateId={rate.id} label={rate.name}>
                              <button
                                type="button"
                                className={iconActionClass("delete")}
                                aria-label="Eliminar"
                                title="Eliminar"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </DeleteRateDialog>
                          ) : null}
                        </>
                      }
                    >
                      <TableCell className="font-medium">
                        <span className="flex items-center gap-2">
                          {rate.name}
                          {rate.isDefault ? (
                            <Badge className="border-transparent bg-amber-500 text-white">
                              Predeterminada
                            </Badge>
                          ) : null}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={RATE_SCOPE_BADGE[rate.scope]}>
                          {RATE_SCOPE_LABELS[rate.scope]}
                        </Badge>
                      </TableCell>
                      <TableCell>{target}</TableCell>
                      <TableCell>
                        {formatHourlyRate(Number(rate.hourlyAmount), rate.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge className={RATE_STATUS_BADGE[rate.status]}>
                          {RATE_STATUS_LABELS[rate.status]}
                        </Badge>
                      </TableCell>
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
