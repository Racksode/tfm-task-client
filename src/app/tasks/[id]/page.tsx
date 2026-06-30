import { TimeEntryType } from "@prisma/client";
import { ArrowLeft, Clock, Pencil, Play, Square, Trash2 } from "lucide-react";
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
import { can, isAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSectionAccent } from "@/lib/section-config";
import { cn } from "@/lib/utils";

import { startTimer, stopTimer } from "@/app/times/actions";
import { getActiveTimer } from "@/app/times/active-timer";
import { formatCurrency, formatDuration } from "@/app/times/status";

import { DeleteTaskDialog } from "../delete-task-dialog";
import {
  TASK_PRIORITY_BADGE,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_BADGE,
  TASK_STATUS_LABELS,
} from "../status";

type TaskDetailPageProps = {
  params: Promise<{ id: string }>;
};

const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", { dateStyle: "short" }).format(date);

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

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const session = await requireStaff();
  const role = session.user.role;
  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      visibleToClient: true,
      functionalStart: true,
      functionalEnd: true,
      createdAt: true,
      updatedAt: true,
      project: { select: { id: true, name: true } },
      responsible: { select: { id: true, name: true } },
      createdBy: { select: { name: true } },
      updatedBy: { select: { name: true } },
      timeEntries: {
        where: {
          // El cronómetro en curso (START_STOP sin cerrar) se ve en el indicador
          // global, no en el listado de registros de la tarea.
          NOT: { type: TimeEntryType.START_STOP, endedAt: null },
          // Un INTERNAL solo ve sus propios registros (coherente con /times y el
          // detalle de tiempo); ADMIN+ ven los de cualquier usuario.
          ...(isAdmin(role) ? {} : { userId: session.user.id }),
        },
        select: {
          id: true,
          workDate: true,
          durationMinutes: true,
          estimatedCost: true,
        },
        orderBy: { workDate: "desc" },
      },
    },
  });

  if (!task) {
    notFound();
  }

  const activeTimer = await getActiveTimer(session.user.id);
  const isRunningThisTask = activeTimer?.taskId === task.id;

  const accent = cn("border-l-4", getSectionAccent("tasks"));

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
              {can(role, "create", "times") ? (
                isRunningThisTask ? (
                  <form action={stopTimer}>
                    <button
                      type="submit"
                      className={actionButtonClass("deactivate")}
                    >
                      <Square className="size-4" />
                      Detener cronómetro
                    </button>
                  </form>
                ) : (
                  <form action={startTimer}>
                    <input type="hidden" name="taskId" value={task.id} />
                    <button
                      type="submit"
                      className={actionButtonClass("activate")}
                    >
                      <Play className="size-4" />
                      Iniciar cronómetro
                    </button>
                  </form>
                )
              ) : null}
              {can(role, "create", "times") ? (
                <Link
                  href={`/times/new?taskId=${task.id}`}
                  className={actionButtonClass("create")}
                >
                  <Clock className="size-4" />
                  Registrar tiempo
                </Link>
              ) : null}
              {can(role, "update", "tasks") ? (
                <Link
                  href={`/tasks/${task.id}/edit`}
                  className={actionButtonClass("edit")}
                >
                  <Pencil className="size-4" />
                  Editar
                </Link>
              ) : null}
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

        <div className="grid gap-4 md:grid-cols-2">
          <Card className={accent}>
            <CardHeader>
              <CardTitle>Información principal</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Título">{task.title}</Field>
              <Field label="Proyecto">
                <Link
                  href={`/projects/${task.project.id}`}
                  className="text-primary hover:underline"
                >
                  {task.project.name}
                </Link>
              </Field>
              <Field label="Estado">
                <Badge className={TASK_STATUS_BADGE[task.status]}>
                  {TASK_STATUS_LABELS[task.status]}
                </Badge>
              </Field>
              <Field label="Prioridad">
                <Badge className={TASK_PRIORITY_BADGE[task.priority]}>
                  {TASK_PRIORITY_LABELS[task.priority]}
                </Badge>
              </Field>
              <Field label="Responsable">
                {task.responsible ? (
                  <Link
                    href={`/users/${task.responsible.id}`}
                    className="text-primary hover:underline"
                  >
                    {task.responsible.name}
                  </Link>
                ) : (
                  "Sin asignar"
                )}
              </Field>
              <Field label="Visible para el cliente">
                {task.visibleToClient ? "Sí" : "No"}
              </Field>
              <Field label="Inicio">
                {task.functionalStart ? formatDate(task.functionalStart) : "—"}
              </Field>
              <Field label="Fin">
                {task.functionalEnd ? formatDate(task.functionalEnd) : "—"}
              </Field>
              <div className="sm:col-span-2">
                <Field label="Descripción">
                  {task.description ? (
                    <span className="whitespace-pre-wrap">{task.description}</span>
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
              <Field label="Creada">{formatDateTime(task.createdAt)}</Field>
              <Field label="Actualizada">{formatDateTime(task.updatedAt)}</Field>
              <Field label="Creada por">{task.createdBy?.name ?? "—"}</Field>
              <Field label="Actualizada por">{task.updatedBy?.name ?? "—"}</Field>
            </CardContent>
          </Card>

          <Card className={cn(accent, "md:col-span-2")}>
            <CardHeader>
              <CardTitle>Registros de tiempo</CardTitle>
            </CardHeader>
            <CardContent>
              {task.timeEntries.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Sin tiempos registrados.
                </p>
              ) : (
                <div className="grid gap-2 text-sm">
                  <ul className="grid gap-1">
                    {task.timeEntries.map((entry) => (
                      <li key={entry.id} className="flex justify-between gap-4">
                        <Link
                          href={`/times/${entry.id}`}
                          className="text-primary hover:underline"
                        >
                          {formatDate(entry.workDate)} —{" "}
                          {formatDuration(entry.durationMinutes)}
                        </Link>
                        <span className="text-muted-foreground">
                          {entry.estimatedCost
                            ? formatCurrency(Number(entry.estimatedCost))
                            : "—"}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between gap-4 border-t pt-2 font-medium">
                    <span>Total estimado</span>
                    <span>
                      {formatCurrency(
                        task.timeEntries.reduce(
                          (sum, entry) =>
                            sum +
                            (entry.estimatedCost ? Number(entry.estimatedCost) : 0),
                          0,
                        ),
                      )}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
