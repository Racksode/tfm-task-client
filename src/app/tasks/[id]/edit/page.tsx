import { ArrowLeft, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { actionButtonClass } from "@/components/data/icon-action";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { requireStaff } from "@/lib/auth-guards";
import { appConfig } from "@/lib/config";
import { can, STAFF_ROLES } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import { updateTask } from "../../actions";
import { DeleteTaskDialog } from "../../delete-task-dialog";
import { TaskForm } from "../../task-form";

type EditTaskPageProps = {
  params: Promise<{ id: string }>;
};

const toDateInput = (date: Date | null) =>
  date ? date.toISOString().slice(0, 10) : null;

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const session = await requireStaff();
  const role = session.user.role;
  const { id } = await params;

  if (!can(role, "update", "tasks")) {
    redirect(`/tasks/${id}`);
  }

  const [task, projects, responsibles] = await Promise.all([
    prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        projectId: true,
        responsibleId: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        visibleToClient: true,
        functionalStart: true,
        functionalEnd: true,
      },
    }),
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

  if (!task) {
    notFound();
  }

  const projectOptions = projects.map((project) => ({
    id: project.id,
    label: `${project.name} — ${project.client.name}`,
  }));

  const defaultValues = {
    ...task,
    functionalStart: toDateInput(task.functionalStart),
    functionalEnd: toDateInput(task.functionalEnd),
  };

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          title={`Tarea: ${task.title}`}
          actions={
            <>
              <Link href="/tasks" className={actionButtonClass("back")}>
                <ArrowLeft className="size-4" />
                Volver al listado
              </Link>
              <Link
                href={`/tasks/${task.id}`}
                className={actionButtonClass("view")}
              >
                <Eye className="size-4" />
                Ver detalles
              </Link>
              {can(role, "delete", "tasks") ? (
                <DeleteTaskDialog taskId={task.id} taskTitle={task.title}>
                  <button type="button" className={actionButtonClass("delete")}>
                    <Trash2 className="size-4" />
                    Eliminar
                  </button>
                </DeleteTaskDialog>
              ) : null}
            </>
          }
        />

        <TaskForm
          action={updateTask}
          projects={projectOptions}
          responsibles={responsibles}
          defaultValues={defaultValues}
          submitLabel="Actualizar datos"
          dismissMs={appConfig.alertAutoDismissMs}
        />
      </div>
    </AppShell>
  );
}
