import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { ClickableRow } from "@/components/data/clickable-row";
import { actionButtonClass, iconActionClass } from "@/components/data/icon-action";
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

import { DeleteReportDialog } from "./delete-report-dialog";
import {
  REPORT_STATUS_BADGE,
  REPORT_STATUS_LABELS,
  formatCurrency,
  formatHours,
} from "./status";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", { dateStyle: "short" }).format(date);

export default async function ReportsPage() {
  const session = await requireStaff();
  const role = session.user.role;
  const canUpdate = can(role, "update", "reports");
  const canDelete = can(role, "delete", "reports");

  const flash = await readFlash();

  const reports = await prisma.report.findMany({
    orderBy: [{ periodEnd: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      periodStart: true,
      periodEnd: true,
      totalHours: true,
      estimatedCost: true,
      status: true,
      client: { select: { name: true } },
      project: { select: { name: true } },
    },
  });

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          title="Reportes"
          actions={
            can(role, "create", "reports") ? (
              <Link href="/reports/new" className={actionButtonClass("create")}>
                <Plus className="size-4" />
                Nuevo reporte
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
                <TableHead>Cliente</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Periodo</TableHead>
                <TableHead className="text-right">Horas</TableHead>
                <TableHead className="text-right">Coste</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    No hay reportes. Crea el primero para empezar.
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => {
                  const rowHref = canUpdate
                    ? `/reports/${report.id}/edit`
                    : `/reports/${report.id}`;

                  return (
                    <ClickableRow
                      key={report.id}
                      href={rowHref}
                      actions={
                        <>
                          <Link
                            href={`/reports/${report.id}`}
                            className={iconActionClass("view")}
                            aria-label="Ver"
                            title="Ver detalles"
                          >
                            <Eye className="size-4" />
                          </Link>

                          {canUpdate ? (
                            <Link
                              href={`/reports/${report.id}/edit`}
                              className={iconActionClass("edit")}
                              aria-label="Editar"
                              title="Editar"
                            >
                              <Pencil className="size-4" />
                            </Link>
                          ) : null}

                          {canDelete ? (
                            <DeleteReportDialog
                              reportId={report.id}
                              label={`${report.client.name} · ${formatDate(report.periodEnd)}`}
                            >
                              <button
                                type="button"
                                className={iconActionClass("delete")}
                                aria-label="Eliminar"
                                title="Eliminar"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </DeleteReportDialog>
                          ) : null}
                        </>
                      }
                    >
                      <TableCell className="font-medium">
                        {report.client.name}
                      </TableCell>
                      <TableCell>{report.project?.name ?? "Todos"}</TableCell>
                      <TableCell>
                        {formatDate(report.periodStart)} – {formatDate(report.periodEnd)}
                      </TableCell>
                      <TableCell className="text-right">
                        {report.totalHours ? formatHours(Number(report.totalHours)) : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {report.estimatedCost
                          ? formatCurrency(Number(report.estimatedCost))
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge className={REPORT_STATUS_BADGE[report.status]}>
                          {REPORT_STATUS_LABELS[report.status]}
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
