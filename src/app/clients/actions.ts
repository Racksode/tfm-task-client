"use server";

import { ClientStatus } from "@prisma/client";
import { redirect } from "next/navigation";

import { requireStaff } from "@/lib/auth-guards";
import { setFlash } from "@/lib/flash";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ClientFormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  internalNotes: string;
  status: string;
  baseRate: string;
};

export type ClientFormState = {
  error?: string;
  values?: ClientFormValues;
  nonce?: number;
};

const getString = (formData: FormData, field: string) => {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
};

const extractValues = (formData: FormData): ClientFormValues => ({
  name: getString(formData, "name"),
  email: getString(formData, "email"),
  phone: getString(formData, "phone"),
  company: getString(formData, "company"),
  internalNotes: getString(formData, "internalNotes"),
  status: getString(formData, "status"),
  baseRate: getString(formData, "baseRate"),
});

const invalid = (values: ClientFormValues, error: string): ClientFormState => ({
  error,
  values,
  nonce: Date.now(),
});

const parseStatus = (value: string): ClientStatus | null =>
  value === ClientStatus.ACTIVE || value === ClientStatus.INACTIVE ? value : null;

type ValidatedInput = {
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  internalNotes: string | null;
  status: ClientStatus;
  baseRate: number | null;
};

const validate = (
  values: ClientFormValues,
): { ok: true; data: ValidatedInput } | { ok: false; error: string } => {
  if (!values.name) {
    return { ok: false, error: "El nombre es obligatorio." };
  }

  let email: string | null = null;
  if (values.email) {
    email = values.email.toLowerCase();
    if (!EMAIL_PATTERN.test(email)) {
      return { ok: false, error: "El email debe tener un formato válido." };
    }
  }

  const status = parseStatus(values.status);
  if (!status) {
    return { ok: false, error: "El estado seleccionado no es válido." };
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
      name: values.name,
      email,
      phone: values.phone || null,
      company: values.company || null,
      internalNotes: values.internalNotes || null,
      status,
      baseRate,
    },
  };
};

export const createClient = async (
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> => {
  const session = await requireStaff();
  const values = extractValues(formData);

  if (!can(session.user.role, "create", "clients")) {
    return invalid(values, "No tienes permisos para crear clientes.");
  }

  const validation = validate(values);
  if (!validation.ok) {
    return invalid(values, validation.error);
  }
  const { data } = validation;

  await prisma.client.create({
    data: {
      ...data,
      createdById: session.user.id,
      updatedById: session.user.id,
    },
  });

  await setFlash("success", "Cliente creado correctamente.");
  redirect("/clients");
};

export const updateClient = async (
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> => {
  const session = await requireStaff();
  const values = extractValues(formData);
  const clientId = getString(formData, "clientId");

  if (!can(session.user.role, "update", "clients")) {
    return invalid(values, "No tienes permisos para editar clientes.");
  }

  if (!clientId) {
    return invalid(values, "No se ha indicado el cliente a editar.");
  }

  const validation = validate(values);
  if (!validation.ok) {
    return invalid(values, validation.error);
  }
  const { data } = validation;

  const current = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true },
  });
  if (!current) {
    return invalid(values, "El cliente indicado no existe.");
  }

  await prisma.client.update({
    where: { id: clientId },
    data: {
      ...data,
      updatedById: session.user.id,
    },
  });

  await setFlash("success", "Cliente actualizado correctamente.");
  redirect("/clients");
};

export const setClientStatus = async (formData: FormData) => {
  const session = await requireStaff();

  const clientId = getString(formData, "clientId");
  const status = parseStatus(getString(formData, "status"));

  if (!can(session.user.role, "update", "clients")) {
    await setFlash("error", "No tienes permisos para cambiar el estado.");
    redirect("/clients");
  }

  if (!clientId || !status) {
    await setFlash("error", "Datos no válidos para cambiar el estado.");
    redirect("/clients");
  }

  const target = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true },
  });

  if (!target) {
    await setFlash("error", "El cliente indicado no existe.");
    redirect("/clients");
  }

  await prisma.client.update({
    where: { id: clientId },
    data: { status, updatedById: session.user.id },
  });

  await setFlash("success", "Estado del cliente actualizado.");
  redirect("/clients");
};

export const deleteClient = async (formData: FormData) => {
  const session = await requireStaff();
  const clientId = getString(formData, "clientId");

  if (!can(session.user.role, "delete", "clients")) {
    await setFlash("error", "No tienes permisos para eliminar clientes.");
    redirect("/clients");
  }

  if (!clientId) {
    await setFlash("error", "No se ha indicado el cliente a eliminar.");
    redirect("/clients");
  }

  const target = await prisma.client.findUnique({
    where: { id: clientId },
    select: {
      _count: {
        select: {
          users: true,
          projects: true,
          rates: true,
          reports: true,
        },
      },
    },
  });

  if (!target) {
    await setFlash("error", "El cliente indicado no existe.");
    redirect("/clients");
  }

  const links =
    target._count.users +
    target._count.projects +
    target._count.rates +
    target._count.reports;

  if (links > 0) {
    await setFlash(
      "error",
      "No se puede eliminar: el cliente tiene datos vinculados. Desactívalo en su lugar.",
    );
    redirect("/clients");
  }

  await prisma.client.delete({ where: { id: clientId } });
  await setFlash("success", "Cliente eliminado correctamente.");
  redirect("/clients");
};
