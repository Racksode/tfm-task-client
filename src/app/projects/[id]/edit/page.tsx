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

import { updateProject } from "../../actions";
import { DeleteProjectDialog } from "../../delete-project-dialog";
import { ProjectForm } from "../../project-form";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

const toDateInput = (date: Date | null) =>
  date ? date.toISOString().slice(0, 10) : null;

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await requireStaff();
  const role = session.user.role;
  const { id } = await params;

  if (!can(role, "update", "projects")) {
    redirect(`/projects/${id}`);
  }

  const [project, clients] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        clientId: true,
        name: true,
        description: true,
        status: true,
        visibleToClient: true,
        startDate: true,
        expectedEndDate: true,
        baseRate: true,
      },
    }),
    prisma.client.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!project) {
    notFound();
  }

  const defaultValues = {
    ...project,
    startDate: toDateInput(project.startDate),
    expectedEndDate: toDateInput(project.expectedEndDate),
    baseRate: project.baseRate ? project.baseRate.toString() : null,
  };

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          title={`Proyecto: ${project.name}`}
          actions={
            <>
              <Link href="/projects" className={actionButtonClass("back")}>
                <ArrowLeft className="size-4" />
                Volver al listado
              </Link>
              <Link
                href={`/projects/${project.id}`}
                className={actionButtonClass("view")}
              >
                <Eye className="size-4" />
                Ver detalles
              </Link>
              {can(role, "delete", "projects") ? (
                <DeleteProjectDialog
                  projectId={project.id}
                  projectName={project.name}
                >
                  <button type="button" className={actionButtonClass("delete")}>
                    <Trash2 className="size-4" />
                    Eliminar
                  </button>
                </DeleteProjectDialog>
              ) : null}
            </>
          }
        />

        <ProjectForm
          action={updateProject}
          clients={clients}
          defaultValues={defaultValues}
          submitLabel="Actualizar datos"
          dismissMs={appConfig.alertAutoDismissMs}
        />
      </div>
    </AppShell>
  );
}
