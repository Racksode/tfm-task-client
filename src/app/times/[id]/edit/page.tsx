import { RateStatus } from "@prisma/client";
import { ArrowLeft, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { actionButtonClass } from "@/components/data/icon-action";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { requireStaff } from "@/lib/auth-guards";
import { appConfig } from "@/lib/config";
import { can, isAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import { updateTimeEntry } from "../../actions";
import { DeleteTimeDialog } from "../../delete-time-dialog";
import { type RateOption, toRateOptions } from "../../rate-cost";
import { TimeForm } from "../../time-form";

const rateSelect = {
  id: true,
  name: true,
  hourlyAmount: true,
  currency: true,
  scope: true,
  status: true,
  isDefault: true,
  clientId: true,
  projectId: true,
} as const;

type EditTimePageProps = {
  params: Promise<{ id: string }>;
};

const pad = (n: number) => String(n).padStart(2, "0");

const toDateInput = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export default async function EditTimePage({ params }: EditTimePageProps) {
  const session = await requireStaff();
  const role = session.user.role;
  const { id } = await params;

  if (!can(role, "update", "times")) {
    redirect(`/times/${id}`);
  }

  const [entry, tasks, projects, activeRates] = await Promise.all([
    prisma.timeEntry.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        taskId: true,
        workDate: true,
        startedAt: true,
        endedAt: true,
        durationMinutes: true,
        description: true,
        rateId: true,
        rate: { select: rateSelect },
        task: { select: { title: true } },
      },
    }),
    prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, projectId: true },
    }),
    prisma.project.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        clientId: true,
        client: { select: { name: true } },
      },
    }),
    prisma.rate.findMany({
      where: { status: RateStatus.ACTIVE },
      orderBy: { createdAt: "desc" },
      select: rateSelect,
    }),
  ]);

  if (!entry) {
    notFound();
  }

  // INTERNAL solo puede editar sus propios registros.
  if (!isAdmin(role) && entry.userId !== session.user.id) {
    redirect(`/times/${entry.id}`);
  }

  // La tarifa guardada puede estar inactiva (no aparece en activeRates); se añade
  // a las opciones para que el selector la conserve al editar.
  const rateOptions: RateOption[] = toRateOptions(activeRates);
  if (entry.rate && !rateOptions.some((rate) => rate.id === entry.rate!.id)) {
    rateOptions.push(...toRateOptions([entry.rate]));
  }

  const projectOptions = projects.map((project) => ({
    id: project.id,
    clientId: project.clientId,
    label: `${project.name} — ${project.client.name}`,
  }));

  const taskOptions = tasks.map((task) => ({
    id: task.id,
    projectId: task.projectId,
    label: task.title,
  }));

  const isInterval = Boolean(entry.startedAt && entry.endedAt);

  const defaultValues = {
    id: entry.id,
    taskId: entry.taskId,
    workDate: toDateInput(entry.workDate),
    mode: isInterval ? ("interval" as const) : ("duration" as const),
    durationHours: String(Math.floor(entry.durationMinutes / 60)),
    durationMinutes: String(entry.durationMinutes % 60),
    startHour: entry.startedAt ? String(entry.startedAt.getHours()) : "",
    startMinute: entry.startedAt ? String(entry.startedAt.getMinutes()) : "",
    endHour: entry.endedAt ? String(entry.endedAt.getHours()) : "",
    endMinute: entry.endedAt ? String(entry.endedAt.getMinutes()) : "",
    description: entry.description,
    rateId: entry.rateId ?? "",
  };

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
              <Link
                href={`/times/${entry.id}`}
                className={actionButtonClass("view")}
              >
                <Eye className="size-4" />
                Ver detalles
              </Link>
              {can(role, "delete", "times") ? (
                <DeleteTimeDialog
                  timeEntryId={entry.id}
                  label={entry.task.title}
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

        <TimeForm
          action={updateTimeEntry}
          projects={projectOptions}
          tasks={taskOptions}
          rates={rateOptions}
          defaultValues={defaultValues}
          submitLabel="Actualizar tiempo"
          dismissMs={appConfig.alertAutoDismissMs}
        />
      </div>
    </AppShell>
  );
}
