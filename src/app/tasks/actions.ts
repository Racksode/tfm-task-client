"use server";

import { TaskPriority, TaskStatus } from "@prisma/client";
import { redirect } from "next/navigation";

import { requireStaff } from "@/lib/auth-guards";
import { setFlash } from "@/lib/flash";
import { can, isStaff } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export type TaskFormValues = {
  projectId: string;
  responsibleId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  visibleToClient: boolean;
  functionalStart: string;
  functionalEnd: string;
};

export type TaskFormState = {
  error?: string;
  values?: TaskFormValues;
  nonce?: number;
};

const getString = (formData: FormData, field: string) => {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
};

const extractValues = (formData: FormData): TaskFormValues => ({
  projectId: getString(formData, "projectId"),
  responsibleId: getString(formData, "responsibleId"),
  title: getString(formData, "title"),
  description: getString(formData, "description"),
  status: getString(formData, "status"),
  priority: getString(formData, "priority"),
  visibleToClient: formData.get("visibleToClient") != null,
  functionalStart: getString(formData, "functionalStart"),
  functionalEnd: getString(formData, "functionalEnd"),
});

const invalid = (values: TaskFormValues, error: string): TaskFormState => ({
  error,
  values,
  nonce: Date.now(),
});

const parseStatus = (value: string): TaskStatus | null =>
  (Object.values(TaskStatus) as string[]).includes(value)
    ? (value as TaskStatus)
    : null;

const parsePriority = (value: string): TaskPriority | null =>
  (Object.values(TaskPriority) as string[]).includes(value)
    ? (value as TaskPriority)
    : null;

const parseDate = (value: string): Date | null => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

type ValidatedInput = {
  projectId: string;
  responsibleId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  visibleToClient: boolean;
  functionalStart: Date | null;
  functionalEnd: Date | null;
};

const validate = async (
  values: TaskFormValues,
): Promise<{ ok: true; data: ValidatedInput } | { ok: false; error: string }> => {
  if (!values.title) {
    return { ok: false, error: "El título es obligatorio." };
  }

  if (!values.projectId) {
    return { ok: false, error: "El proyecto es obligatorio." };
  }
  const project = await prisma.project.findUnique({
    where: { id: values.projectId },
    select: { id: true },
  });
  if (!project) {
    return { ok: false, error: "El proyecto seleccionado no existe." };
  }

  let responsibleId: string | null = null;
  if (values.responsibleId) {
    const responsible = await prisma.user.findUnique({
      where: { id: values.responsibleId },
      select: { id: true, role: true },
    });
    if (!responsible || !isStaff(responsible.role)) {
      return { ok: false, error: "El responsable seleccionado no es válido." };
    }
    responsibleId = responsible.id;
  }

  const status = parseStatus(values.status);
  if (!status) {
    return { ok: false, error: "El estado seleccionado no es válido." };
  }

  const priority = parsePriority(values.priority);
  if (!priority) {
    return { ok: false, error: "La prioridad seleccionada no es válida." };
  }

  let functionalStart: Date | null = null;
  if (values.functionalStart) {
    functionalStart = parseDate(values.functionalStart);
    if (!functionalStart) {
      return { ok: false, error: "La fecha de inicio no es válida." };
    }
  }

  let functionalEnd: Date | null = null;
  if (values.functionalEnd) {
    functionalEnd = parseDate(values.functionalEnd);
    if (!functionalEnd) {
      return { ok: false, error: "La fecha de fin no es válida." };
    }
  }

  if (functionalStart && functionalEnd && functionalEnd < functionalStart) {
    return {
      ok: false,
      error: "La fecha de fin no puede ser anterior a la de inicio.",
    };
  }

  return {
    ok: true,
    data: {
      projectId: project.id,
      responsibleId,
      title: values.title,
      description: values.description || null,
      status,
      priority,
      visibleToClient: values.visibleToClient,
      functionalStart,
      functionalEnd,
    },
  };
};

export const createTask = async (
  _prev: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> => {
  const session = await requireStaff();
  const values = extractValues(formData);

  if (!can(session.user.role, "create", "tasks")) {
    return invalid(values, "No tienes permisos para crear tareas.");
  }

  const validation = await validate(values);
  if (!validation.ok) {
    return invalid(values, validation.error);
  }
  const { data } = validation;

  await prisma.task.create({
    data: {
      ...data,
      createdById: session.user.id,
      updatedById: session.user.id,
    },
  });

  await setFlash("success", "Tarea creada correctamente.");
  redirect("/tasks");
};

export const updateTask = async (
  _prev: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> => {
  const session = await requireStaff();
  const values = extractValues(formData);
  const taskId = getString(formData, "taskId");

  if (!can(session.user.role, "update", "tasks")) {
    return invalid(values, "No tienes permisos para editar tareas.");
  }

  if (!taskId) {
    return invalid(values, "No se ha indicado la tarea a editar.");
  }

  const validation = await validate(values);
  if (!validation.ok) {
    return invalid(values, validation.error);
  }
  const { data } = validation;

  const current = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true },
  });
  if (!current) {
    return invalid(values, "La tarea indicada no existe.");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      ...data,
      updatedById: session.user.id,
    },
  });

  await setFlash("success", "Tarea actualizada correctamente.");
  redirect("/tasks");
};

export const deleteTask = async (formData: FormData) => {
  const session = await requireStaff();
  const taskId = getString(formData, "taskId");

  if (!can(session.user.role, "delete", "tasks")) {
    await setFlash("error", "No tienes permisos para eliminar tareas.");
    redirect("/tasks");
  }

  if (!taskId) {
    await setFlash("error", "No se ha indicado la tarea a eliminar.");
    redirect("/tasks");
  }

  const target = await prisma.task.findUnique({
    where: { id: taskId },
    select: { _count: { select: { timeEntries: true } } },
  });

  if (!target) {
    await setFlash("error", "La tarea indicada no existe.");
    redirect("/tasks");
  }

  if (target._count.timeEntries > 0) {
    await setFlash(
      "error",
      "No se puede eliminar: la tarea tiene tiempos registrados. Cámbiala de estado en su lugar.",
    );
    redirect("/tasks");
  }

  await prisma.task.delete({ where: { id: taskId } });
  await setFlash("success", "Tarea eliminada correctamente.");
  redirect("/tasks");
};
