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

import { createTimeEntry } from "../actions";
import { TimeForm } from "../time-form";

type NewTimePageProps = {
  searchParams: Promise<{ taskId?: string }>;
};

export default async function NewTimePage({ searchParams }: NewTimePageProps) {
  const session = await requireStaff();

  if (!can(session.user.role, "create", "times")) {
    redirect("/times");
  }

  const { taskId } = await searchParams;

  const [projects, tasks] = await Promise.all([
    prisma.project.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, client: { select: { name: true } } },
    }),
    prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, projectId: true },
    }),
  ]);

  const projectOptions = projects.map((project) => ({
    id: project.id,
    label: `${project.name} — ${project.client.name}`,
  }));

  const taskOptions = tasks.map((task) => ({
    id: task.id,
    projectId: task.projectId,
    label: task.title,
  }));

  return (
    <AppShell>
      <div className="grid gap-6 p-8">
        <PageHeader
          title="Registrar tiempo"
          actions={
            <Link href="/times" className={actionButtonClass("back")}>
              <ArrowLeft className="size-4" />
              Volver al listado
            </Link>
          }
        />

        <TimeForm
          action={createTimeEntry}
          projects={projectOptions}
          tasks={taskOptions}
          defaultValues={taskId ? { taskId } : undefined}
          submitLabel="Grabar tiempo"
          dismissMs={appConfig.alertAutoDismissMs}
        />
      </div>
    </AppShell>
  );
}
