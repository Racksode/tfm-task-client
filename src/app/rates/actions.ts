"use server";

import { RateScope, RateStatus } from "@prisma/client";
import { redirect } from "next/navigation";

import { requireStaff } from "@/lib/auth-guards";
import { setFlash } from "@/lib/flash";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export type RateFormValues = {
  name: string;
  hourlyAmount: string;
  scope: string;
  status: string;
  clientId: string;
  projectId: string;
};

export type RateFormState = {
  error?: string;
  values?: RateFormValues;
  nonce?: number;
};

const getString = (formData: FormData, field: string) => {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
};

const extractValues = (formData: FormData): RateFormValues => ({
  name: getString(formData, "name"),
  hourlyAmount: getString(formData, "hourlyAmount"),
  scope: getString(formData, "scope"),
  status: getString(formData, "status"),
  clientId: getString(formData, "clientId"),
  projectId: getString(formData, "projectId"),
});

const invalid = (values: RateFormValues, error: string): RateFormState => ({
  error,
  values,
  nonce: Date.now(),
});

const parseScope = (value: string): RateScope | null =>
  value === RateScope.SYSTEM ||
  value === RateScope.CLIENT ||
  value === RateScope.PROJECT
    ? value
    : null;

const parseStatus = (value: string): RateStatus | null =>
  value === RateStatus.ACTIVE || value === RateStatus.INACTIVE ? value : null;

type ValidatedInput = {
  name: string;
  hourlyAmount: number;
  scope: RateScope;
  status: RateStatus;
  clientId: string | null;
  projectId: string | null;
};

const validate = async (
  values: RateFormValues,
): Promise<{ ok: true; data: ValidatedInput } | { ok: false; error: string }> => {
  if (!values.name) {
    return { ok: false, error: "El nombre es obligatorio." };
  }

  if (!values.hourlyAmount) {
    return { ok: false, error: "El importe por hora es obligatorio." };
  }
  const hourlyAmount = Number(values.hourlyAmount.replace(",", "."));
  if (!Number.isFinite(hourlyAmount) || hourlyAmount <= 0) {
    return {
      ok: false,
      error: "El importe por hora debe ser un número mayor que cero.",
    };
  }

  const scope = parseScope(values.scope);
  if (!scope) {
    return { ok: false, error: "El ámbito seleccionado no es válido." };
  }

  const status = parseStatus(values.status);
  if (!status) {
    return { ok: false, error: "El estado seleccionado no es válido." };
  }

  // El ámbito decide a qué entidad se vincula la tarifa.
  let clientId: string | null = null;
  let projectId: string | null = null;

  if (scope === RateScope.CLIENT) {
    if (!values.clientId) {
      return {
        ok: false,
        error: "Para una tarifa de cliente, selecciona el cliente.",
      };
    }
    const client = await prisma.client.findUnique({
      where: { id: values.clientId },
      select: { id: true },
    });
    if (!client) {
      return { ok: false, error: "El cliente seleccionado no existe." };
    }
    clientId = client.id;
  } else if (scope === RateScope.PROJECT) {
    if (!values.projectId) {
      return {
        ok: false,
        error: "Para una tarifa de proyecto, selecciona el proyecto.",
      };
    }
    const project = await prisma.project.findUnique({
      where: { id: values.projectId },
      select: { id: true },
    });
    if (!project) {
      return { ok: false, error: "El proyecto seleccionado no existe." };
    }
    projectId = project.id;
  }

  return {
    ok: true,
    data: { name: values.name, hourlyAmount, scope, status, clientId, projectId },
  };
};

export const createRate = async (
  _prev: RateFormState,
  formData: FormData,
): Promise<RateFormState> => {
  const session = await requireStaff();
  const values = extractValues(formData);

  if (!can(session.user.role, "create", "rates")) {
    return invalid(values, "No tienes permisos para gestionar tarifas.");
  }

  const validation = await validate(values);
  if (!validation.ok) {
    return invalid(values, validation.error);
  }

  await prisma.rate.create({ data: validation.data });

  await setFlash("success", "Tarifa creada correctamente.");
  redirect("/rates");
};

export const updateRate = async (
  _prev: RateFormState,
  formData: FormData,
): Promise<RateFormState> => {
  const session = await requireStaff();
  const values = extractValues(formData);
  const rateId = getString(formData, "rateId");

  if (!can(session.user.role, "update", "rates")) {
    return invalid(values, "No tienes permisos para gestionar tarifas.");
  }

  if (!rateId) {
    return invalid(values, "No se ha indicado la tarifa a editar.");
  }

  const validation = await validate(values);
  if (!validation.ok) {
    return invalid(values, validation.error);
  }

  const current = await prisma.rate.findUnique({
    where: { id: rateId },
    select: { id: true },
  });
  if (!current) {
    return invalid(values, "La tarifa indicada no existe.");
  }

  await prisma.rate.update({ where: { id: rateId }, data: validation.data });

  await setFlash("success", "Tarifa actualizada correctamente.");
  redirect("/rates");
};

export const deleteRate = async (formData: FormData) => {
  const session = await requireStaff();
  const rateId = getString(formData, "rateId");

  if (!can(session.user.role, "delete", "rates")) {
    await setFlash("error", "No tienes permisos para eliminar tarifas.");
    redirect("/rates");
  }

  if (!rateId) {
    await setFlash("error", "No se ha indicado la tarifa a eliminar.");
    redirect("/rates");
  }

  const target = await prisma.rate.findUnique({
    where: { id: rateId },
    select: { id: true },
  });
  if (!target) {
    await setFlash("error", "La tarifa indicada no existe.");
    redirect("/rates");
  }

  // Rate no tiene referencias entrantes (TimeEntry guarda la tarifa como snapshot),
  // así que el borrado es siempre seguro.
  await prisma.rate.delete({ where: { id: rateId } });
  await setFlash("success", "Tarifa eliminada correctamente.");
  redirect("/rates");
};
