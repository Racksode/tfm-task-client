import { ArrowLeft, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { actionButtonClass } from "@/components/data/icon-action";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { requireStaff } from "@/lib/auth-guards";
import { appConfig } from "@/lib/config";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import { updateReport } from "../../actions";
import { DeleteReportDialog } from "../../delete-report-dialog";
import { ReportForm } from "../../report-form";

type EditReportPageProps = {
  params: Promise<{ id: string }>;
};

const pad = (n: number) => String(n).padStart(2, "0");

const toDateInput = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export default async function EditReportPage({ params }: EditReportPageProps) {
  const session = await requireStaff();
  const role = session.user.role;
  const { id } = await params;

  if (!can(role, "update", "reports")) {
    redirect(`/reports/${id}`);
  }

  const [report, clients, projects] = await Promise.all([
    prisma.report.findUnique({
      where: { id },
      select: {
        id: true,
        clientId: true,
        projectId: true,
        periodStart: true,
        periodEnd: true,
        functionalSummary: true,
        visibleToClient: true,
        client: { select: { name: true } },
      },
    }),
    prisma.client.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.project.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, clientId: true },
    }),
  ]);

  if (!report) {
    notFound();
  }

  const clientOptions = clients.map((client) => ({
    id: client.id,
    label: client.name,
  }));
  const projectOptions = projects.map((project) => ({
    id: project.id,
    clientId: project.clientId,
    label: project.name,
  }));

  const defaultValues = {
    id: report.id,
    clientId: report.clientId,
    projectId: report.projectId,
    periodStart: toDateInput(report.periodStart),
    periodEnd: toDateInput(report.periodEnd),
    functionalSummary: report.functionalSummary,
    visibleToClient: report.visibleToClient,
  };

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
              <Link
                href={`/reports/${report.id}`}
                className={actionButtonClass("view")}
              >
                <Eye className="size-4" />
                Ver detalles
              </Link>
              {can(role, "delete", "reports") ? (
                <DeleteReportDialog
                  reportId={report.id}
                  label={report.client.name}
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

        <ReportForm
          action={updateReport}
          clients={clientOptions}
          projects={projectOptions}
          defaultValues={defaultValues}
          submitLabel="Actualizar reporte"
          dismissMs={appConfig.alertAutoDismissMs}
        />
      </div>
    </AppShell>
  );
}
