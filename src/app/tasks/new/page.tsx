import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { actionButtonClass } from "@/components/data/icon-action";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { requireStaff } from "@/lib/auth-guards";
import { appConfig } from "@/lib/config";
import { can, STAFF_ROLES } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import { createTask } from "../actions";
import { TaskForm } from "../task-form";

export default async function NewTaskPage() {
  const session = await requireStaff();

  if (!can(session.user.role, "create", "tasks")) {
    redirect("/tasks");
  }

  const [projects, responsibles] = await Promise.all([
    prisma.project.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, client: { select: { name: true } } },
    }),
    prisma.user.findMany({
      where: { role: { in: STAFF_ROLES } },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const projectOptions = projects.map((project) => ({
    id: project.id,
    label: `${project.name} — ${project.client.name}`,
  }));

  return (
    <AppShell>
      <div className="grid gap-6 p-8">
        <PageHeader
          title="Nueva tarea"
          actions={
            <Link href="/tasks" className={actionButtonClass("back")}>
              <ArrowLeft className="size-4" />
              Volver al listado
            </Link>
          }
        />

        <TaskForm
          action={createTask}
          projects={projectOptions}
          responsibles={responsibles}
          submitLabel="Grabar datos"
          dismissMs={appConfig.alertAutoDismissMs}
        />
      </div>
    </AppShell>
  );
}
