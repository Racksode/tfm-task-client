"use server";

import {
  AiUsageStatus,
  AiUsageType,
  Prisma,
  ReportStatus,
  TimeEntryType,
} from "@prisma/client";
import { redirect } from "next/navigation";

import {
  type SummaryTask,
  generateProfessionalSummary,
} from "@/lib/ai";
import { requireStaff } from "@/lib/auth-guards";
import { setFlash } from "@/lib/flash";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export type ReportFormValues = {
  clientId: string;
  projectId: string;
  periodStart: string;
  periodEnd: string;
  functionalSummary: string;
  visibleToClient: string;
};

export type ReportFormState = {
  error?: string;
  values?: ReportFormValues;
  nonce?: number;
};

const getString = (formData: FormData, field: string) => {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
};

const extractValues = (formData: FormData): ReportFormValues => ({
  clientId: getString(formData, "clientId"),
  projectId: getString(formData, "projectId"),
  periodStart: getString(formData, "periodStart"),
  periodEnd: getString(formData, "periodEnd"),
  functionalSummary: getString(formData, "functionalSummary"),
  visibleToClient: getString(formData, "visibleToClient"),
});

const invalid = (values: ReportFormValues, error: string): ReportFormState => ({
  error,
  values,
  nonce: Date.now(),
});

const parseDateOnly = (value: string): Date | null => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

type ValidatedInput = {
  clientId: string;
  projectId: string | null;
  periodStart: Date;
  periodEnd: Date;
  functionalSummary: string | null;
  visibleToClient: boolean;
};

const validate = async (
  values: ReportFormValues,
): Promise<{ ok: true; data: ValidatedInput } | { ok: false; error: string }> => {
  if (!values.clientId) {
    return { ok: false, error: "El cliente es obligatorio." };
  }
  const client = await prisma.client.findUnique({
    where: { id: values.clientId },
    select: { id: true },
  });
  if (!client) {
    return { ok: false, error: "El cliente seleccionado no existe." };
  }

  // El proyecto es opcional, pero si se indica debe pertenecer al cliente.
  let projectId: string | null = null;
  if (values.projectId) {
    const project = await prisma.project.findUnique({
      where: { id: values.projectId },
      select: { id: true, clientId: true },
    });
    if (!project || project.clientId !== client.id) {
      return {
        ok: false,
        error: "El proyecto seleccionado no pertenece al cliente.",
      };
    }
    projectId = project.id;
  }

  if (!values.periodStart || !values.periodEnd) {
    return { ok: false, error: "El periodo (inicio y fin) es obligatorio." };
  }
  const periodStart = parseDateOnly(values.periodStart);
  const periodEnd = parseDateOnly(values.periodEnd);
  if (!periodStart || !periodEnd) {
    return { ok: false, error: "Las fechas del periodo no son válidas." };
  }
  if (periodEnd < periodStart) {
    return {
      ok: false,
      error: "La fecha de fin no puede ser anterior a la de inicio.",
    };
  }

  return {
    ok: true,
    data: {
      clientId: client.id,
      projectId,
      periodStart,
      periodEnd,
      functionalSummary: values.functionalSummary || null,
      visibleToClient: values.visibleToClient === "true",
    },
  };
};

/** Ámbito del periodo (mismo criterio en agregación, generación y detección de
 * cambios): registros del cliente/proyecto cuyo `workDate` cae en el periodo,
 * excluyendo el cronómetro en curso. */
const periodScopeWhere = (data: {
  clientId: string;
  projectId: string | null;
  periodStart: Date;
  periodEnd: Date;
}): Prisma.TimeEntryWhereInput => ({
  workDate: { gte: data.periodStart, lte: data.periodEnd },
  NOT: { type: TimeEntryType.START_STOP, endedAt: null },
  task: data.projectId
    ? { projectId: data.projectId }
    : { project: { clientId: data.clientId } },
});

/**
 * Suma horas y coste de los registros de tiempo del ámbito del periodo. El
 * resultado (con `snapshotAt`, el momento del cálculo) se congela en el reporte;
 * no se recalcula solo al añadir o editar tiempos.
 */
const aggregatePeriod = async (data: ValidatedInput) => {
  const aggregate = await prisma.timeEntry.aggregate({
    where: periodScopeWhere(data),
    _sum: { durationMinutes: true, estimatedCost: true },
  });

  const minutes = aggregate._sum.durationMinutes ?? 0;
  return {
    totalHours: new Prisma.Decimal(Math.round((minutes / 60) * 100) / 100),
    estimatedCost: aggregate._sum.estimatedCost ?? new Prisma.Decimal(0),
    snapshotAt: new Date(),
  };
};

export const createReport = async (
  _prev: ReportFormState,
  formData: FormData,
): Promise<ReportFormState> => {
  const session = await requireStaff();
  const values = extractValues(formData);

  if (!can(session.user.role, "create", "reports")) {
    return invalid(values, "No tienes permisos para crear reportes.");
  }

  const validation = await validate(values);
  if (!validation.ok) {
    return invalid(values, validation.error);
  }
  const { data } = validation;
  const totals = await aggregatePeriod(data);

  await prisma.report.create({ data: { ...data, ...totals } });

  await setFlash("success", "Reporte creado correctamente.");
  redirect("/reports");
};

export const updateReport = async (
  _prev: ReportFormState,
  formData: FormData,
): Promise<ReportFormState> => {
  const session = await requireStaff();
  const values = extractValues(formData);
  const reportId = getString(formData, "reportId");

  if (!can(session.user.role, "update", "reports")) {
    return invalid(values, "No tienes permisos para editar reportes.");
  }

  if (!reportId) {
    return invalid(values, "No se ha indicado el reporte a editar.");
  }

  const current = await prisma.report.findUnique({
    where: { id: reportId },
    select: { id: true },
  });
  if (!current) {
    return invalid(values, "El reporte indicado no existe.");
  }

  const validation = await validate(values);
  if (!validation.ok) {
    return invalid(values, validation.error);
  }
  const { data } = validation;
  // El periodo o el ámbito pueden haber cambiado: se recalculan los totales.
  const totals = await aggregatePeriod(data);

  await prisma.report.update({
    where: { id: reportId },
    data: { ...data, ...totals },
  });

  await setFlash("success", "Reporte actualizado correctamente.");
  redirect("/reports");
};

/** Recalcula horas y coste de un reporte ya existente (periodo sin cambios). */
export const recalcReport = async (formData: FormData) => {
  const session = await requireStaff();
  const reportId = getString(formData, "reportId");

  if (!can(session.user.role, "update", "reports")) {
    await setFlash("error", "No tienes permisos para editar reportes.");
    redirect("/reports");
  }

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: {
      id: true,
      clientId: true,
      projectId: true,
      periodStart: true,
      periodEnd: true,
    },
  });
  if (!report) {
    await setFlash("error", "El reporte indicado no existe.");
    redirect("/reports");
  }

  const totals = await aggregatePeriod({
    clientId: report.clientId,
    projectId: report.projectId,
    periodStart: report.periodStart,
    periodEnd: report.periodEnd,
    functionalSummary: null,
    visibleToClient: false,
  });

  await prisma.report.update({ where: { id: report.id }, data: totals });
  await setFlash("success", "Totales del reporte recalculados.");
  redirect(`/reports/${report.id}`);
};

/** Marca un reporte como revisado o lo reabre a borrador. */
export const setReportReviewed = async (formData: FormData) => {
  const session = await requireStaff();
  const reportId = getString(formData, "reportId");
  const reviewed = getString(formData, "reviewed") === "true";

  if (!can(session.user.role, "update", "reports")) {
    await setFlash("error", "No tienes permisos para editar reportes.");
    redirect("/reports");
  }

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { id: true },
  });
  if (!report) {
    await setFlash("error", "El reporte indicado no existe.");
    redirect("/reports");
  }

  await prisma.report.update({
    where: { id: report.id },
    data: reviewed
      ? {
          status: ReportStatus.REVIEWED,
          reviewedAt: new Date(),
          reviewerId: session.user.id,
        }
      : { status: ReportStatus.DRAFT, reviewedAt: null, reviewerId: null },
  });

  await setFlash(
    "success",
    reviewed ? "Reporte marcado como revisado." : "Reporte reabierto como borrador.",
  );
  redirect(`/reports/${report.id}`);
};

/**
 * Genera (o regenera) el resumen para el cliente con IA a partir de las tareas y
 * notas del periodo. Congela `aiSummary`, marca `GENERATED` y registra el uso de
 * IA (`AiUsage`), también si falla (estado `ERROR`).
 */
export const generateReportSummary = async (formData: FormData) => {
  const session = await requireStaff();
  const reportId = getString(formData, "reportId");

  if (!can(session.user.role, "update", "reports")) {
    await setFlash("error", "No tienes permisos para generar resúmenes.");
    redirect("/reports");
  }

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: {
      id: true,
      clientId: true,
      projectId: true,
      periodStart: true,
      periodEnd: true,
      totalHours: true,
      estimatedCost: true,
      snapshotAt: true,
      client: { select: { name: true } },
      project: { select: { name: true } },
    },
  });
  if (!report) {
    await setFlash("error", "El reporte indicado no existe.");
    redirect("/reports");
  }

  // El resumen se genera sobre el snapshot congelado. Si los tiempos del periodo
  // han cambiado desde el último cálculo, se bloquea y se pide recalcular antes
  // (no re-congelamos en silencio; recalcular es una acción explícita). Se detectan
  // dos derivas: (1) los totales ya no cuadran, y (2) el contenido cambió aunque los
  // totales sigan iguales (p. ej. mover minutos/coste entre tareas), vía cualquier
  // registro del ámbito modificado tras `snapshotAt`.
  const live = await aggregatePeriod({
    clientId: report.clientId,
    projectId: report.projectId,
    periodStart: report.periodStart,
    periodEnd: report.periodEnd,
    functionalSummary: null,
    visibleToClient: false,
  });
  const frozenHours = report.totalHours ?? new Prisma.Decimal(0);
  const frozenCost = report.estimatedCost ?? new Prisma.Decimal(0);
  const totalsChanged =
    !live.totalHours.equals(frozenHours) ||
    !live.estimatedCost.equals(frozenCost);

  const contentChanged = report.snapshotAt
    ? (await prisma.timeEntry.count({
        where: {
          ...periodScopeWhere(report),
          updatedAt: { gt: report.snapshotAt },
        },
      })) > 0
    : false;

  if (totalsChanged || contentChanged) {
    await setFlash(
      "error",
      "Los tiempos del periodo han cambiado desde el último cálculo. Recalcula el reporte antes de generar el resumen.",
    );
    redirect(`/reports/${report.id}`);
  }

  // Mismos registros que la agregación: tareas con tiempo en el periodo.
  const entries = await prisma.timeEntry.findMany({
    where: periodScopeWhere(report),
    select: {
      durationMinutes: true,
      description: true,
      task: { select: { id: true, title: true } },
    },
    orderBy: { workDate: "asc" },
  });

  // Se agrupan por tarea, acumulando minutos y notas.
  const byTask = new Map<string, SummaryTask>();
  for (const entry of entries) {
    const current = byTask.get(entry.task.id) ?? {
      title: entry.task.title,
      descriptions: [],
      minutes: 0,
    };
    current.minutes += entry.durationMinutes;
    if (entry.description) {
      current.descriptions.push(entry.description);
    }
    byTask.set(entry.task.id, current);
  }

  try {
    const result = await generateProfessionalSummary({
      clientName: report.client.name,
      projectName: report.project?.name ?? null,
      periodStart: report.periodStart,
      periodEnd: report.periodEnd,
      totalHours: report.totalHours ? Number(report.totalHours) : 0,
      tasks: [...byTask.values()],
    });

    await prisma.$transaction([
      prisma.report.update({
        where: { id: report.id },
        data: {
          aiSummary: result.text,
          status: ReportStatus.GENERATED,
          generatedAt: new Date(),
          // Un reporte que ya estaba REVIEWED vuelve a GENERATED al regenerar:
          // hay que descartar la revisión previa para no mostrar un revisor obsoleto.
          reviewedAt: null,
          reviewerId: null,
        },
      }),
      prisma.aiUsage.create({
        data: {
          type: AiUsageType.REPORT_SUMMARY,
          requesterId: session.user.id,
          reportId: report.id,
          inputSummary: `${result.inputSummary} · modelo: ${result.model}`,
          outputSummary: result.text,
          status: AiUsageStatus.GENERATED,
        },
      }),
    ]);

    await setFlash(
      "success",
      result.simulated
        ? "Resumen generado (modo simulado, sin API key)."
        : "Resumen generado con IA.",
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido.";
    await prisma.aiUsage.create({
      data: {
        type: AiUsageType.REPORT_SUMMARY,
        requesterId: session.user.id,
        reportId: report.id,
        outputSummary: message.slice(0, 500),
        status: AiUsageStatus.ERROR,
      },
    });
    await setFlash("error", `No se pudo generar el resumen: ${message}`);
  }

  redirect(`/reports/${report.id}`);
};

export const deleteReport = async (formData: FormData) => {
  const session = await requireStaff();
  const reportId = getString(formData, "reportId");

  if (!can(session.user.role, "delete", "reports")) {
    await setFlash("error", "No tienes permisos para eliminar reportes.");
    redirect("/reports");
  }

  if (!reportId) {
    await setFlash("error", "No se ha indicado el reporte a eliminar.");
    redirect("/reports");
  }

  const target = await prisma.report.findUnique({
    where: { id: reportId },
    select: { _count: { select: { aiUsages: true } } },
  });

  if (!target) {
    await setFlash("error", "El reporte indicado no existe.");
    redirect("/reports");
  }

  if (target._count.aiUsages > 0) {
    await setFlash(
      "error",
      "No se puede eliminar: el reporte tiene usos de IA vinculados.",
    );
    redirect("/reports");
  }

  await prisma.report.delete({ where: { id: reportId } });
  await setFlash("success", "Reporte eliminado correctamente.");
  redirect("/reports");
};
