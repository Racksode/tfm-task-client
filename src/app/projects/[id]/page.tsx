import { ProjectStatus } from "@prisma/client";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { actionButtonClass } from "@/components/data/icon-action";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireStaff } from "@/lib/auth-guards";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSectionAccent } from "@/lib/section-config";
import { cn } from "@/lib/utils";

import { DeleteProjectDialog } from "../delete-project-dialog";
import { PROJECT_STATUS_LABELS } from "../status";

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", { dateStyle: "short" }).format(date);

const STATUS_BADGE: Record<ProjectStatus, string> = {
  [ProjectStatus.ACTIVE]: "border-transparent bg-green-600 text-white",
  [ProjectStatus.PAUSED]: "border-transparent bg-amber-500 text-white",
  [ProjectStatus.COMPLETED]: "border-transparent bg-slate-600 text-white",
  [ProjectStatus.CANCELLED]: "border-transparent bg-rose-600 text-white",
};

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

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const session = await requireStaff();
  const role = session.user.role;
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      visibleToClient: true,
      startDate: true,
      expectedEndDate: true,
      createdAt: true,
      updatedAt: true,
      client: { select: { id: true, name: true } },
      createdBy: { select: { name: true } },
      updatedBy: { select: { name: true } },
      tasks: { select: { id: true, title: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!project) {
    notFound();
  }

  const accent = cn("border-l-4", getSectionAccent("projects"));

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
              {can(role, "update", "projects") ? (
                <Link
                  href={`/projects/${project.id}/edit`}
                  className={actionButtonClass("edit")}
                >
                  <Pencil className="size-4" />
                  Editar
                </Link>
              ) : null}
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

        <div className="grid gap-4 md:grid-cols-2">
          <Card className={accent}>
            <CardHeader>
              <CardTitle>Información principal</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre">{project.name}</Field>
              <Field label="Cliente">
                <Link
                  href={`/clients/${project.client.id}`}
                  className="text-primary hover:underline"
                >
                  {project.client.name}
                </Link>
              </Field>
              <Field label="Estado">
                <Badge className={STATUS_BADGE[project.status]}>
                  {PROJECT_STATUS_LABELS[project.status]}
                </Badge>
              </Field>
              <Field label="Inicio">
                {project.startDate ? formatDate(project.startDate) : "—"}
              </Field>
              <Field label="Fin previsto">
                {project.expectedEndDate ? formatDate(project.expectedEndDate) : "—"}
              </Field>
              <Field label="Visible para el cliente">
                {project.visibleToClient ? "Sí" : "No"}
              </Field>
              <div className="sm:col-span-2">
                <Field label="Descripción">
                  {project.description ? (
                    <span className="whitespace-pre-wrap">{project.description}</span>
                  ) : (
                    "—"
                  )}
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card className={accent}>
            <CardHeader>
              <CardTitle>Datos de grabación</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Creado">{formatDateTime(project.createdAt)}</Field>
              <Field label="Actualizado">{formatDateTime(project.updatedAt)}</Field>
              <Field label="Creado por">{project.createdBy?.name ?? "—"}</Field>
              <Field label="Actualizado por">{project.updatedBy?.name ?? "—"}</Field>
            </CardContent>
          </Card>

          <Card className={cn(accent, "md:col-span-2")}>
            <CardHeader>
              <CardTitle>Tareas</CardTitle>
            </CardHeader>
            <CardContent>
              {project.tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Sin tareas vinculadas.
                </p>
              ) : (
                <ul className="grid gap-1 text-sm">
                  {project.tasks.map((task) => (
                    <li key={task.id}>
                      <Link
                        href={`/tasks/${task.id}`}
                        className="text-primary hover:underline"
                      >
                        {task.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
