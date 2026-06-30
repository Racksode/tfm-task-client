import { ReportStatus } from "@prisma/client";
import { ArrowLeft, CheckCircle2, Pencil, RefreshCw, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { actionButtonClass } from "@/components/data/icon-action";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireStaff } from "@/lib/auth-guards";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSectionAccent } from "@/lib/section-config";
import { cn } from "@/lib/utils";

import { recalcReport, setReportReviewed } from "../actions";
import { DeleteReportDialog } from "../delete-report-dialog";
import {
  REPORT_STATUS_BADGE,
  REPORT_STATUS_LABELS,
  formatCurrency,
  formatHours,
} from "../status";

type ReportDetailPageProps = {
  params: Promise<{ id: string }>;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", { dateStyle: "short" }).format(date);

const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm">{children}</span>
    </div>
  );
}

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const session = await requireStaff();
  const role = session.user.role;
  const { id } = await params;

  const report = await prisma.report.findUnique({
    where: { id },
    select: {
      id: true,
      periodStart: true,
      periodEnd: true,
      totalHours: true,
      estimatedCost: true,
      functionalSummary: true,
      aiSummary: true,
      visibleToClient: true,
      status: true,
      reviewedAt: true,
      createdAt: true,
      updatedAt: true,
      client: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
      reviewer: { select: { id: true, name: true } },
    },
  });

  if (!report) {
    notFound();
  }

  const canUpdate = can(role, "update", "reports");
  const accent = cn("border-l-4", getSectionAccent("reports"));
  const isReviewed = report.status === ReportStatus.REVIEWED;

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          title={`Reporte: ${report.client.name}`}
          actions={
            <>
              <Link href="/reports" className={actionButtonClass("back")}>
                <ArrowLeft className="size-4" />
                Volver al listado
              </Link>
              {canUpdate ? (
                <>
                  <form action={recalcReport}>
                    <input type="hidden" name="reportId" value={report.id} />
                    <button type="submit" className={actionButtonClass("view")}>
                      <RefreshCw className="size-4" />
                      Recalcular
                    </button>
                  </form>
                  <form action={setReportReviewed}>
                    <input type="hidden" name="reportId" value={report.id} />
                    <input
                      type="hidden"
                      name="reviewed"
                      value={isReviewed ? "false" : "true"}
                    />
                    <button type="submit" className={actionButtonClass("create")}>
                      {isReviewed ? (
                        <>
                          <RotateCcw className="size-4" />
                          Reabrir
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-4" />
                          Marcar revisado
                        </>
                      )}
                    </button>
                  </form>
                  <Link
                    href={`/reports/${report.id}/edit`}
                    className={actionButtonClass("edit")}
                  >
                    <Pencil className="size-4" />
                    Editar
                  </Link>
                </>
              ) : null}
              {can(role, "delete", "reports") ? (
                <DeleteReportDialog
                  reportId={report.id}
                  label={`${report.client.name} · ${formatDate(report.periodEnd)}`}
                >
                  <button type="button" className={actionButtonClass("delete")}>
                    <Trash2 className="size-4" />
                    Eliminar
                  </button>
                </DeleteReportDialog>
              ) : null}
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Card className={accent}>
            <CardHeader>
              <CardTitle>Información del reporte</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Cliente">
                <Link
                  href={`/clients/${report.client.id}`}
                  className="text-primary hover:underline"
                >
                  {report.client.name}
                </Link>
              </Field>
              <Field label="Proyecto">
                {report.project ? (
                  <Link
                    href={`/projects/${report.project.id}`}
                    className="text-primary hover:underline"
                  >
                    {report.project.name}
                  </Link>
                ) : (
                  "Todos los del cliente"
                )}
              </Field>
              <Field label="Periodo">
                {formatDate(report.periodStart)} – {formatDate(report.periodEnd)}
              </Field>
              <Field label="Estado">
                <Badge className={REPORT_STATUS_BADGE[report.status]}>
                  {REPORT_STATUS_LABELS[report.status]}
                </Badge>
              </Field>
              <Field label="Horas">
                {report.totalHours ? formatHours(Number(report.totalHours)) : "—"}
              </Field>
              <Field label="Coste estimado">
                {report.estimatedCost
                  ? formatCurrency(Number(report.estimatedCost))
                  : "—"}
              </Field>
              <Field label="Visible para el cliente">
                {report.visibleToClient ? "Sí" : "No"}
              </Field>
              <Field label="Revisado por">
                {report.reviewer
                  ? `${report.reviewer.name}${report.reviewedAt ? ` · ${formatDate(report.reviewedAt)}` : ""}`
                  : "—"}
              </Field>
            </CardContent>
          </Card>

          <Card className={accent}>
            <CardHeader>
              <CardTitle>Resúmenes</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Field label="Resumen interno">
                {report.functionalSummary ? (
                  <span className="whitespace-pre-wrap">
                    {report.functionalSummary}
                  </span>
                ) : (
                  "—"
                )}
              </Field>
              <Field label="Resumen para el cliente (IA)">
                {report.aiSummary ? (
                  <span className="whitespace-pre-wrap">{report.aiSummary}</span>
                ) : (
                  "Aún no generado."
                )}
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Creado">{formatDateTime(report.createdAt)}</Field>
                <Field label="Actualizado">
                  {formatDateTime(report.updatedAt)}
                </Field>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
