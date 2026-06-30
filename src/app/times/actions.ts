"use server";

import { Prisma, RateScope, RateStatus, TimeEntryType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireStaff } from "@/lib/auth-guards";
import { setFlash } from "@/lib/flash";
import { can, isAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import {
  estimatedCostFromMinutes,
  isRateInScope,
  resolveDefaultRateId,
} from "./rate-cost";
import { formatDuration } from "./status";

/** Snapshot de tarifa que se congela en el registro de tiempo. */
type RateSnapshot = {
  rateId: string | null;
  appliedHourlyRate: Prisma.Decimal | null;
  estimatedCost: Prisma.Decimal | null;
};

const EMPTY_SNAPSHOT: RateSnapshot = {
  rateId: null,
  appliedHourlyRate: null,
  estimatedCost: null,
};

/** Congela el importe y el coste a partir de la tarifa elegida (o vacío). */
const snapshotFromRate = (
  rate: { id: string; hourlyAmount: Prisma.Decimal },
  durationMinutes: number,
): RateSnapshot => ({
  rateId: rate.id,
  appliedHourlyRate: rate.hourlyAmount,
  estimatedCost: new Prisma.Decimal(
    estimatedCostFromMinutes(durationMinutes, Number(rate.hourlyAmount)),
  ),
});

type SnapshotResult =
  | { ok: true; snapshot: RateSnapshot }
  | { ok: false; error: string };

/**
 * Snapshot para la tarifa elegida a mano en el formulario. Valida que exista y
 * que su ámbito corresponda al cliente/proyecto de la tarea (una `CLIENT`/
 * `PROJECT` de otro cliente se rechaza). Al editar se preserva la tarifa ya
 * aplicada (`preserveRateId`) aunque haya quedado fuera de ámbito. Sin tarifa →
 * snapshot vacío.
 */
const resolveSelectedSnapshot = async (
  rateId: string,
  durationMinutes: number,
  context: { projectId: string; clientId: string },
  preserveRateId: string | null,
): Promise<SnapshotResult> => {
  if (!rateId) {
    return { ok: true, snapshot: EMPTY_SNAPSHOT };
  }
  const rate = await prisma.rate.findUnique({
    where: { id: rateId },
    select: {
      id: true,
      hourlyAmount: true,
      scope: true,
      clientId: true,
      projectId: true,
    },
  });
  if (!rate) {
    return { ok: false, error: "La tarifa seleccionada no existe." };
  }
  const preserved = preserveRateId !== null && rate.id === preserveRateId;
  if (!preserved && !isRateInScope(rate, context.projectId, context.clientId)) {
    return {
      ok: false,
      error: "La tarifa seleccionada no es válida para el cliente o proyecto de la tarea.",
    };
  }
  return { ok: true, snapshot: snapshotFromRate(rate, durationMinutes) };
};

/**
 * Snapshot por defecto (cronómetro): tarifa sugerida por jerarquía
 * proyecto→cliente→sistema para la tarea, dentro de la transacción.
 */
const resolveDefaultSnapshot = async (
  tx: Prisma.TransactionClient,
  taskId: string,
  durationMinutes: number,
): Promise<RateSnapshot> => {
  const task = await tx.task.findUnique({
    where: { id: taskId },
    select: { project: { select: { id: true, clientId: true } } },
  });
  if (!task) {
    return EMPTY_SNAPSHOT;
  }
  const rates = await tx.rate.findMany({
    where: { status: RateStatus.ACTIVE },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      hourlyAmount: true,
      currency: true,
      scope: true,
      status: true,
      isDefault: true,
      clientId: true,
      projectId: true,
    },
  });
  const rateId = resolveDefaultRateId(
    rates.map((rate) => ({ ...rate, hourlyAmount: Number(rate.hourlyAmount) })),
    task.project.id,
    task.project.clientId,
  );
  const chosen = rateId ? rates.find((rate) => rate.id === rateId) : undefined;
  return chosen ? snapshotFromRate(chosen, durationMinutes) : EMPTY_SNAPSHOT;
};

export type TimeFormValues = {
  taskId: string;
  workDate: string;
  /** "duration" = se introduce la duración; "interval" = se introduce inicio/fin. */
  mode: string;
  durationHours: string;
  durationMinutes: string;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  description: string;
  rateId: string;
};

export type TimeFormState = {
  error?: string;
  values?: TimeFormValues;
  nonce?: number;
};

const getString = (formData: FormData, field: string) => {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
};

const extractValues = (formData: FormData): TimeFormValues => ({
  taskId: getString(formData, "taskId"),
  workDate: getString(formData, "workDate"),
  mode: getString(formData, "mode") || "duration",
  durationHours: getString(formData, "durationHours"),
  durationMinutes: getString(formData, "durationMinutes"),
  startHour: getString(formData, "startHour"),
  startMinute: getString(formData, "startMinute"),
  endHour: getString(formData, "endHour"),
  endMinute: getString(formData, "endMinute"),
  description: getString(formData, "description"),
  rateId: getString(formData, "rateId"),
});

const invalid = (values: TimeFormValues, error: string): TimeFormState => ({
  error,
  values,
  nonce: Date.now(),
});

/** Combina una fecha «YYYY-MM-DD» con hora y minuto en un Date local. */
const combineDateParts = (
  dateStr: string,
  hour: number,
  minute: number,
): Date | null => {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  date.setHours(hour, minute, 0, 0);
  return date;
};

/** Valida que hora (0-23) y minuto (0-59) sean enteros dentro de rango. */
const isValidHourMinute = (hour: number, minute: number) =>
  Number.isInteger(hour) &&
  Number.isInteger(minute) &&
  hour >= 0 &&
  hour <= 23 &&
  minute >= 0 &&
  minute <= 59;

const parseDateOnly = (value: string): Date | null => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

type ValidatedInput = {
  taskId: string;
  workDate: Date;
  startedAt: Date | null;
  endedAt: Date | null;
  durationMinutes: number;
  description: string | null;
};

type TaskContext = { projectId: string; clientId: string };

const validate = async (
  values: TimeFormValues,
): Promise<
  | { ok: true; data: ValidatedInput; context: TaskContext }
  | { ok: false; error: string }
> => {
  if (!values.taskId) {
    return { ok: false, error: "La tarea es obligatoria." };
  }
  const task = await prisma.task.findUnique({
    where: { id: values.taskId },
    select: { id: true, project: { select: { id: true, clientId: true } } },
  });
  if (!task) {
    return { ok: false, error: "La tarea seleccionada no existe." };
  }

  if (!values.workDate) {
    return { ok: false, error: "La fecha es obligatoria." };
  }
  const workDate = parseDateOnly(values.workDate);
  if (!workDate) {
    return { ok: false, error: "La fecha no es válida." };
  }

  let startedAt: Date | null = null;
  let endedAt: Date | null = null;
  let durationMinutes: number;

  if (values.mode === "interval") {
    // Solo la hora es obligatoria; el minuto vacío se interpreta como 0 (ej. «9» = 09:00).
    if (!values.startHour || !values.endHour) {
      return {
        ok: false,
        error: "Indica la hora de inicio y de fin.",
      };
    }
    const startHour = Number(values.startHour);
    const startMinute = Number(values.startMinute || "0");
    const endHour = Number(values.endHour);
    const endMinute = Number(values.endMinute || "0");
    if (
      !isValidHourMinute(startHour, startMinute) ||
      !isValidHourMinute(endHour, endMinute)
    ) {
      return {
        ok: false,
        error: "Las horas no son válidas (horas 0-23, minutos 0-59).",
      };
    }
    startedAt = combineDateParts(values.workDate, startHour, startMinute);
    endedAt = combineDateParts(values.workDate, endHour, endMinute);
    if (!startedAt || !endedAt) {
      return { ok: false, error: "Las horas de inicio o fin no son válidas." };
    }
    if (endedAt <= startedAt) {
      return {
        ok: false,
        error: "La hora de fin debe ser posterior a la de inicio.",
      };
    }
    durationMinutes = Math.round(
      (endedAt.getTime() - startedAt.getTime()) / 60000,
    );
  } else {
    const hours = Number(values.durationHours || "0");
    const mins = Number(values.durationMinutes || "0");
    if (
      !Number.isInteger(hours) ||
      !Number.isInteger(mins) ||
      hours < 0 ||
      mins < 0 ||
      mins > 59
    ) {
      return {
        ok: false,
        error: "La duración no es válida (minutos entre 0 y 59).",
      };
    }
    durationMinutes = hours * 60 + mins;
  }

  if (durationMinutes <= 0) {
    return { ok: false, error: "La duración debe ser mayor que cero." };
  }

  return {
    ok: true,
    data: {
      taskId: task.id,
      workDate,
      startedAt,
      endedAt,
      durationMinutes,
      description: values.description || null,
    },
    context: { projectId: task.project.id, clientId: task.project.clientId },
  };
};

export const createTimeEntry = async (
  _prev: TimeFormState,
  formData: FormData,
): Promise<TimeFormState> => {
  const session = await requireStaff();
  const values = extractValues(formData);

  if (!can(session.user.role, "create", "times")) {
    return invalid(values, "No tienes permisos para registrar tiempo.");
  }

  const validation = await validate(values);
  if (!validation.ok) {
    return invalid(values, validation.error);
  }
  const { data, context } = validation;

  const result = await resolveSelectedSnapshot(
    values.rateId,
    data.durationMinutes,
    context,
    null,
  );
  if (!result.ok) {
    return invalid(values, result.error);
  }

  // Cada usuario registra su propio tiempo; el autor es siempre la sesión.
  await prisma.timeEntry.create({
    data: {
      ...data,
      ...result.snapshot,
      userId: session.user.id,
      type: TimeEntryType.MANUAL,
    },
  });

  await setFlash("success", "Tiempo registrado correctamente.");
  redirect("/times");
};

export const updateTimeEntry = async (
  _prev: TimeFormState,
  formData: FormData,
): Promise<TimeFormState> => {
  const session = await requireStaff();
  const values = extractValues(formData);
  const timeEntryId = getString(formData, "timeEntryId");

  if (!can(session.user.role, "update", "times")) {
    return invalid(values, "No tienes permisos para editar registros de tiempo.");
  }

  if (!timeEntryId) {
    return invalid(values, "No se ha indicado el registro a editar.");
  }

  const current = await prisma.timeEntry.findUnique({
    where: { id: timeEntryId },
    select: { id: true, userId: true, rateId: true },
  });
  if (!current) {
    return invalid(values, "El registro indicado no existe.");
  }

  // Un INTERNAL solo puede editar sus propios registros; ADMIN+ los de cualquiera.
  if (!isAdmin(session.user.role) && current.userId !== session.user.id) {
    return invalid(values, "Solo puedes editar tus propios registros de tiempo.");
  }

  const validation = await validate(values);
  if (!validation.ok) {
    return invalid(values, validation.error);
  }
  const { data, context } = validation;

  // El coste se recalcula porque la duración o la tarifa pueden haber cambiado.
  // Se preserva la tarifa ya aplicada aunque hubiese quedado fuera de ámbito.
  const result = await resolveSelectedSnapshot(
    values.rateId,
    data.durationMinutes,
    context,
    current.rateId,
  );
  if (!result.ok) {
    return invalid(values, result.error);
  }

  // El autor (userId) y el tipo no se reasignan al editar.
  await prisma.timeEntry.update({
    where: { id: timeEntryId },
    data: { ...data, ...result.snapshot },
  });

  await setFlash("success", "Registro de tiempo actualizado correctamente.");
  redirect("/times");
};

export const deleteTimeEntry = async (formData: FormData) => {
  const session = await requireStaff();
  const timeEntryId = getString(formData, "timeEntryId");

  if (!can(session.user.role, "delete", "times")) {
    await setFlash("error", "No tienes permisos para eliminar registros de tiempo.");
    redirect("/times");
  }

  if (!timeEntryId) {
    await setFlash("error", "No se ha indicado el registro a eliminar.");
    redirect("/times");
  }

  const target = await prisma.timeEntry.findUnique({
    where: { id: timeEntryId },
    select: { id: true },
  });

  if (!target) {
    await setFlash("error", "El registro indicado no existe.");
    redirect("/times");
  }

  await prisma.timeEntry.delete({ where: { id: timeEntryId } });
  await setFlash("success", "Registro de tiempo eliminado correctamente.");
  redirect("/times");
};

/** Fecha local a medianoche (el «día de trabajo» del registro). */
const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/** Minutos transcurridos entre dos instantes (mínimo 1, para no guardar 0). */
const elapsedMinutes = (from: Date, to: Date) =>
  Math.max(1, Math.round((to.getTime() - from.getTime()) / 60000));

/**
 * Lock por usuario dentro de la transacción: serializa inicios/paradas
 * concurrentes (doble clic, dos pestañas) para que nunca queden dos cronómetros
 * activos a la vez. Se libera al cerrar la transacción.
 */
const lockUserTimer = (tx: Prisma.TransactionClient, userId: string) =>
  // $executeRaw, no $queryRaw: pg_advisory_xact_lock devuelve `void` y $queryRaw
  // falla al deserializar esa columna; $executeRaw solo ejecuta, sin deserializar.
  tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${userId}))`;

/** Cronómetro en curso del usuario dentro de la transacción (o null). */
const findActiveTimer = (tx: Prisma.TransactionClient, userId: string) =>
  tx.timeEntry.findFirst({
    where: { userId, type: TimeEntryType.START_STOP, endedAt: null },
    select: { id: true, taskId: true, startedAt: true },
  });

/**
 * Cierra un cronómetro activo, congela su coste con la tarifa por defecto de la
 * tarea (jerarquía proyecto→cliente→sistema) y devuelve los minutos registrados.
 */
const closeTimer = async (
  tx: Prisma.TransactionClient,
  active: { id: string; taskId: string; startedAt: Date },
  now: Date,
) => {
  const minutes = elapsedMinutes(active.startedAt, now);
  const snapshot = await resolveDefaultSnapshot(tx, active.taskId, minutes);
  await tx.timeEntry.update({
    where: { id: active.id },
    data: { endedAt: now, durationMinutes: minutes, ...snapshot },
  });
  return minutes;
};

/**
 * Inicia un cronómetro sobre una tarea. Si ya hay uno en otra tarea, lo cierra
 * antes; si ya hay uno en esta misma tarea, no hace nada (idempotente).
 */
export const startTimer = async (formData: FormData) => {
  const session = await requireStaff();

  if (!can(session.user.role, "create", "times")) {
    await setFlash("error", "No tienes permisos para registrar tiempo.");
    redirect("/tasks");
  }

  const taskId = getString(formData, "taskId");
  if (!taskId) {
    await setFlash("error", "No se ha indicado la tarea.");
    redirect("/tasks");
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true },
  });
  if (!task) {
    await setFlash("error", "La tarea seleccionada no existe.");
    redirect("/tasks");
  }

  const now = new Date();

  // Todo dentro de una transacción con lock por usuario, para que dos peticiones
  // concurrentes no dejen dos cronómetros activos.
  await prisma.$transaction(async (tx) => {
    await lockUserTimer(tx, session.user.id);

    const active = await findActiveTimer(tx, session.user.id);

    // Idempotente: si ya hay un cronómetro en ESTA tarea, no hacemos nada. Evita
    // que un doble clic cierre el recién creado y deje un registro espurio de 1 min.
    if (active?.taskId === task.id) {
      return;
    }

    // Si había uno en OTRA tarea, lo cerramos antes de iniciar el nuevo.
    if (active?.startedAt) {
      await closeTimer(
        tx,
        { id: active.id, taskId: active.taskId, startedAt: active.startedAt },
        now,
      );
    }

    await tx.timeEntry.create({
      data: {
        taskId: task.id,
        userId: session.user.id,
        type: TimeEntryType.START_STOP,
        workDate: startOfToday(),
        startedAt: now,
        endedAt: null,
        durationMinutes: 0,
      },
    });
  });

  revalidatePath("/", "layout");
  redirect(`/tasks/${task.id}`);
};

/** Detiene el cronómetro en curso del usuario y guarda la duración. */
export const stopTimer = async () => {
  const session = await requireStaff();

  const now = new Date();
  const minutes = await prisma.$transaction(async (tx) => {
    await lockUserTimer(tx, session.user.id);
    const active = await findActiveTimer(tx, session.user.id);
    if (!active?.startedAt) {
      return null;
    }
    return closeTimer(
      tx,
      { id: active.id, taskId: active.taskId, startedAt: active.startedAt },
      now,
    );
  });
  if (minutes === null) {
    await setFlash("error", "No tienes ningún cronómetro en curso.");
    redirect("/times");
  }

  await setFlash(
    "success",
    `Cronómetro detenido: ${formatDuration(minutes)} registrados.`,
  );
  revalidatePath("/", "layout");
  redirect("/times");
};
