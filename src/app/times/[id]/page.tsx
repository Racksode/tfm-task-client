import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { actionButtonClass } from "@/components/data/icon-action";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireStaff } from "@/lib/auth-guards";
import { can, isAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSectionAccent } from "@/lib/section-config";
import { cn } from "@/lib/utils";

import { DeleteTimeDialog } from "../delete-time-dialog";
import { TIME_TYPE_BADGE, TIME_TYPE_LABELS, formatDuration } from "../status";

type TimeDetailPageProps = {
  params: Promise<{ id: string }>;
};

const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", { dateStyle: "short" }).format(date);

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", { timeStyle: "short" }).format(date);

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

export default async function TimeDetailPage({ params }: TimeDetailPageProps) {
  const session = await requireStaff();
  const role = session.user.role;
  const { id } = await params;

  const entry = await prisma.timeEntry.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      workDate: true,
      type: true,
      startedAt: true,
      endedAt: true,
      durationMinutes: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      task: {
        select: { id: true, title: true, project: { select: { name: true } } },
      },
      user: { select: { id: true, name: true } },
    },
  });

  if (!entry) {
    notFound();
  }

  // INTERNAL solo puede ver sus propios registros.
  const owned = entry.userId === session.user.id;
  if (!isAdmin(role) && !owned) {
    notFound();
  }

  const canEdit = can(role, "update", "times") && (isAdmin(role) || owned);
  const accent = cn("border-l-4", getSectionAccent("times"));

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          title={`Tiempo: ${entry.task.title}`}
          actions={
            <>
              <Link href="/times" className={actionButtonClass("back")}>
                <ArrowLeft className="size-4" />
                Volver al listado
              </Link>
              {canEdit ? (
                <Link
                  href={`/times/${entry.id}/edit`}
                  className={actionButtonClass("edit")}
                >
                  <Pencil className="size-4" />
                  Editar
                </Link>
              ) : null}
              {can(role, "delete", "times") ? (
                <DeleteTimeDialog
                  timeEntryId={entry.id}
                  label={`${entry.task.title} · ${formatDate(entry.workDate)}`}
                >
                  <button type="button" className={actionButtonClass("delete")}>
                    <Trash2 className="size-4" />
                    Eliminar
                  </button>
                </DeleteTimeDialog>
              ) : null}
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Card className={accent}>
            <CardHeader>
              <CardTitle>Información del registro</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Tarea">
                <Link
                  href={`/tasks/${entry.task.id}`}
                  className="text-primary hover:underline"
                >
                  {entry.task.title}
                </Link>
              </Field>
              <Field label="Proyecto">{entry.task.project.name}</Field>
              <Field label="Usuario">
                <Link
                  href={`/users/${entry.user.id}`}
                  className="text-primary hover:underline"
                >
                  {entry.user.name}
                </Link>
              </Field>
              <Field label="Tipo">
                <Badge className={TIME_TYPE_BADGE[entry.type]}>
                  {TIME_TYPE_LABELS[entry.type]}
                </Badge>
              </Field>
              <Field label="Fecha">{formatDate(entry.workDate)}</Field>
              <Field label="Duración">
                {formatDuration(entry.durationMinutes)}
              </Field>
              <Field label="Inicio">
                {entry.startedAt ? formatTime(entry.startedAt) : "—"}
              </Field>
              <Field label="Fin">
                {entry.endedAt ? formatTime(entry.endedAt) : "—"}
              </Field>
              <div className="sm:col-span-2">
                <Field label="Descripción">
                  {entry.description ? (
                    <span className="whitespace-pre-wrap">
                      {entry.description}
                    </span>
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
              <Field label="Creado">{formatDateTime(entry.createdAt)}</Field>
              <Field label="Actualizado">
                {formatDateTime(entry.updatedAt)}
              </Field>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
