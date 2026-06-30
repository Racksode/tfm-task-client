import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { actionButtonClass } from "@/components/data/icon-action";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { requireStaff } from "@/lib/auth-guards";
import { appConfig } from "@/lib/config";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import { createReport } from "../actions";
import { ReportForm } from "../report-form";

export default async function NewReportPage() {
  const session = await requireStaff();

  if (!can(session.user.role, "create", "reports")) {
    redirect("/reports");
  }

  const [clients, projects] = await Promise.all([
    prisma.client.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.project.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, clientId: true },
    }),
  ]);

  const clientOptions = clients.map((client) => ({
    id: client.id,
    label: client.name,
  }));
  const projectOptions = projects.map((project) => ({
    id: project.id,
    clientId: project.clientId,
    label: project.name,
  }));

  return (
    <AppShell>
      <div className="grid gap-6 p-8">
        <PageHeader
          title="Nuevo reporte"
          actions={
            <Link href="/reports" className={actionButtonClass("back")}>
              <ArrowLeft className="size-4" />
              Volver al listado
            </Link>
          }
        />

        <ReportForm
          action={createReport}
          clients={clientOptions}
          projects={projectOptions}
          submitLabel="Crear reporte"
          dismissMs={appConfig.alertAutoDismissMs}
        />
      </div>
    </AppShell>
  );
}
