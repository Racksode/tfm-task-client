"use server";

import { ProjectStatus } from "@prisma/client";
import { redirect } from "next/navigation";

import { requireStaff } from "@/lib/auth-guards";
import { setFlash } from "@/lib/flash";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export type ProjectFormValues = {
  clientId: string;
  name: string;
  description: string;
  status: string;
  visibleToClient: boolean;
  startDate: string;
  expectedEndDate: string;
  baseRate: string;
};

export type ProjectFormState = {
  error?: string;
  values?: ProjectFormValues;
  nonce?: number;
};

const getString = (formData: FormData, field: string) => {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
};

const extractValues = (formData: FormData): ProjectFormValues => ({
  clientId: getString(formData, "clientId"),
  name: getString(formData, "name"),
  description: getString(formData, "description"),
  status: getString(formData, "status"),
  visibleToClient: formData.get("visibleToClient") != null,
  startDate: getString(formData, "startDate"),
  expectedEndDate: getString(formData, "expectedEndDate"),
  baseRate: getString(formData, "baseRate"),
});

const invalid = (values: ProjectFormValues, error: string): ProjectFormState => ({
  error,
  values,
  nonce: Date.now(),
});

const parseStatus = (value: string): ProjectStatus | null =>
  (Object.values(ProjectStatus) as string[]).includes(value)
    ? (value as ProjectStatus)
    : null;

const parseDate = (value: string): Date | null => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

type ValidatedInput = {
  clientId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  visibleToClient: boolean;
  startDate: Date | null;
  expectedEndDate: Date | null;
  baseRate: number | null;
};

const validate = async (
  values: ProjectFormValues,
): Promise<{ ok: true; data: ValidatedInput } | { ok: false; error: string }> => {
  if (!values.name) {
    return { ok: false, error: "El nombre es obligatorio." };
  }

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

  const status = parseStatus(values.status);
  if (!status) {
    return { ok: false, error: "El estado seleccionado no es válido." };
  }

  let startDate: Date | null = null;
  if (values.startDate) {
    startDate = parseDate(values.startDate);
    if (!startDate) {
      return { ok: false, error: "La fecha de inicio no es válida." };
    }
  }

  let expectedEndDate: Date | null = null;
  if (values.expectedEndDate) {
    expectedEndDate = parseDate(values.expectedEndDate);
    if (!expectedEndDate) {
      return { ok: false, error: "La fecha de fin prevista no es válida." };
    }
  }

  if (startDate && expectedEndDate && expectedEndDate < startDate) {
    return {
      ok: false,
      error: "La fecha de fin prevista no puede ser anterior a la de inicio.",
    };
  }

  let baseRate: number | null = null;
  if (values.baseRate) {
    const parsed = Number(values.baseRate.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed < 0) {
      return { ok: false, error: "La tarifa base debe ser un número positivo." };
    }
    baseRate = parsed;
  }

  return {
    ok: true,
    data: {
      clientId: client.id,
      name: values.name,
      description: values.description || null,
      status,
      visibleToClient: values.visibleToClient,
      startDate,
      expectedEndDate,
      baseRate,
    },
  };
};

export const createProject = async (
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> => {
  const session = await requireStaff();
  const values = extractValues(formData);

  if (!can(session.user.role, "create", "projects")) {
    return invalid(values, "No tienes permisos para crear proyectos.");
  }

  const validation = await validate(values);
  if (!validation.ok) {
    return invalid(values, validation.error);
  }
  const { data } = validation;

  await prisma.project.create({
    data: {
      ...data,
      createdById: session.user.id,
      updatedById: session.user.id,
    },
  });

  await setFlash("success", "Proyecto creado correctamente.");
  redirect("/projects");
};

export const updateProject = async (
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> => {
  const session = await requireStaff();
  const values = extractValues(formData);
  const projectId = getString(formData, "projectId");

  if (!can(session.user.role, "update", "projects")) {
    return invalid(values, "No tienes permisos para editar proyectos.");
  }

  if (!projectId) {
    return invalid(values, "No se ha indicado el proyecto a editar.");
  }

  const validation = await validate(values);
  if (!validation.ok) {
    return invalid(values, validation.error);
  }
  const { data } = validation;

  const current = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      clientId: true,
      _count: { select: { reports: true, rates: true } },
    },
  });
  if (!current) {
    return invalid(values, "El proyecto indicado no existe.");
  }

  // Mover el proyecto a otro cliente dejaría reportes y tarifas con el cliente
  // antiguo apuntando a un proyecto del nuevo cliente (datos incoherentes).
  if (data.clientId !== current.clientId) {
    const linked = current._count.reports + current._count.rates;
    if (linked > 0) {
      return invalid(
        values,
        "No se puede cambiar el cliente: el proyecto tiene reportes o tarifas vinculados.",
      );
    }
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      ...data,
      updatedById: session.user.id,
    },
  });

  await setFlash("success", "Proyecto actualizado correctamente.");
  redirect("/projects");
};

export const deleteProject = async (formData: FormData) => {
  const session = await requireStaff();
  const projectId = getString(formData, "projectId");

  if (!can(session.user.role, "delete", "projects")) {
    await setFlash("error", "No tienes permisos para eliminar proyectos.");
    redirect("/projects");
  }

  if (!projectId) {
    await setFlash("error", "No se ha indicado el proyecto a eliminar.");
    redirect("/projects");
  }

  const target = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      _count: {
        select: {
          tasks: true,
          rates: true,
          reports: true,
        },
      },
    },
  });

  if (!target) {
    await setFlash("error", "El proyecto indicado no existe.");
    redirect("/projects");
  }

  const links = target._count.tasks + target._count.rates + target._count.reports;

  if (links > 0) {
    await setFlash(
      "error",
      "No se puede eliminar: el proyecto tiene datos vinculados. Cámbialo de estado en su lugar.",
    );
    redirect("/projects");
  }

  await prisma.project.delete({ where: { id: projectId } });
  await setFlash("success", "Proyecto eliminado correctamente.");
  redirect("/projects");
};
