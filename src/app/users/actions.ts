"use server";

import { UserRole, UserStatus } from "@prisma/client";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth-guards";
import { setFlash } from "@/lib/flash";
import { canManageUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const MIN_PASSWORD_LENGTH = 8;
const SALT_ROUNDS = 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type UserFormValues = {
  name: string;
  email: string;
  role: string;
  status: string;
  clientId: string;
};

export type UserFormState = {
  error?: string;
  values?: UserFormValues;
  nonce?: number;
};

const getString = (formData: FormData, field: string) => {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
};

const extractValues = (formData: FormData): UserFormValues => ({
  name: getString(formData, "name"),
  email: getString(formData, "email"),
  role: getString(formData, "role"),
  status: getString(formData, "status"),
  clientId: getString(formData, "clientId"),
});

const invalid = (values: UserFormValues, error: string): UserFormState => ({
  error,
  values,
  nonce: Date.now(),
});

const parseRole = (value: string): UserRole | null =>
  value === UserRole.INTERNAL || value === UserRole.CLIENT ? value : null;

const parseStatus = (value: string): UserStatus | null =>
  value === UserStatus.ACTIVE || value === UserStatus.INACTIVE ? value : null;

type ValidatedInput = {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  clientId: string;
};

const validate = (
  values: UserFormValues,
): { ok: true; data: ValidatedInput } | { ok: false; error: string } => {
  if (!values.name) {
    return { ok: false, error: "El nombre es obligatorio." };
  }

  const email = values.email.toLowerCase();
  if (!email || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "El email debe tener un formato válido." };
  }

  const role = parseRole(values.role);
  if (!role) {
    return { ok: false, error: "El rol seleccionado no es válido." };
  }

  const status = parseStatus(values.status);
  if (!status) {
    return { ok: false, error: "El estado seleccionado no es válido." };
  }

  return {
    ok: true,
    data: { name: values.name, email, role, status, clientId: values.clientId },
  };
};

const resolveClientId = async (
  role: UserRole,
  rawClientId: string,
): Promise<{ ok: true; clientId: string | null } | { ok: false; error: string }> => {
  if (role !== UserRole.CLIENT) {
    return { ok: true, clientId: null };
  }

  if (!rawClientId) {
    return {
      ok: false,
      error: "Los usuarios CLIENT requieren un cliente existente asociado.",
    };
  }

  const client = await prisma.client.findUnique({
    where: { id: rawClientId },
    select: { id: true },
  });

  if (!client) {
    return { ok: false, error: "El cliente seleccionado no existe." };
  }

  return { ok: true, clientId: client.id };
};

export const createUser = async (
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> => {
  const session = await requireAdmin();
  const values = extractValues(formData);

  const validation = validate(values);
  if (!validation.ok) {
    return invalid(values, validation.error);
  }
  const { data } = validation;

  const password = getString(formData, "password");
  if (password.length < MIN_PASSWORD_LENGTH) {
    return invalid(
      values,
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });
  if (existing) {
    return invalid(values, "Ya existe un usuario con ese email.");
  }

  const client = await resolveClientId(data.role, data.clientId);
  if (!client.ok) {
    return invalid(values, client.error);
  }

  const passwordHash = await hash(password, SALT_ROUNDS);

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      clientId: client.clientId,
      passwordHash,
      createdById: session.user.id,
      updatedById: session.user.id,
    },
  });

  await setFlash("success", "Usuario creado correctamente.");
  redirect("/users");
};

export const updateUser = async (
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> => {
  const session = await requireAdmin();
  const values = extractValues(formData);
  const userId = getString(formData, "userId");

  if (!userId) {
    return invalid(values, "No se ha indicado el usuario a editar.");
  }

  const validation = validate(values);
  if (!validation.ok) {
    return invalid(values, validation.error);
  }
  const { data } = validation;

  const password = getString(formData, "password");
  if (password && password.length < MIN_PASSWORD_LENGTH) {
    return invalid(
      values,
      `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    );
  }

  const current = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!current) {
    return invalid(values, "El usuario indicado no existe.");
  }
  if (!canManageUser(session.user.role, current.role)) {
    return invalid(values, "No tienes permisos para gestionar este usuario.");
  }

  const duplicate = await prisma.user.findFirst({
    where: { email: data.email, NOT: { id: userId } },
    select: { id: true },
  });
  if (duplicate) {
    return invalid(values, "Ya existe otro usuario con ese email.");
  }

  const client = await resolveClientId(data.role, data.clientId);
  if (!client.ok) {
    return invalid(values, client.error);
  }

  const passwordHash = password ? await hash(password, SALT_ROUNDS) : undefined;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      clientId: client.clientId,
      updatedById: session.user.id,
      ...(passwordHash ? { passwordHash } : {}),
    },
  });

  await setFlash("success", "Usuario actualizado correctamente.");
  redirect("/users");
};

export const setUserStatus = async (formData: FormData) => {
  const session = await requireAdmin();

  const userId = getString(formData, "userId");
  const status = parseStatus(getString(formData, "status"));

  if (!userId || !status) {
    await setFlash("error", "Datos no válidos para cambiar el estado.");
    redirect("/users");
  }

  if (userId === session.user.id) {
    await setFlash("error", "No puedes cambiar el estado de tu propio usuario.");
    redirect("/users");
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!target) {
    await setFlash("error", "El usuario indicado no existe.");
    redirect("/users");
  }

  if (!canManageUser(session.user.role, target.role)) {
    await setFlash("error", "No tienes permisos para gestionar este usuario.");
    redirect("/users");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { status, updatedById: session.user.id },
  });

  await setFlash("success", "Estado del usuario actualizado.");
  redirect("/users");
};

export const deleteUser = async (formData: FormData) => {
  const session = await requireAdmin();
  const userId = getString(formData, "userId");

  if (!userId) {
    await setFlash("error", "No se ha indicado el usuario a eliminar.");
    redirect("/users");
  }

  if (userId === session.user.id) {
    await setFlash("error", "No puedes eliminar tu propio usuario.");
    redirect("/users");
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      _count: {
        select: {
          assignedTasks: true,
          timeEntries: true,
          reports: true,
          aiUsages: true,
          auditLogs: true,
          createdUsers: true,
          updatedUsers: true,
          createdClients: true,
          updatedClients: true,
          createdProjects: true,
          updatedProjects: true,
          createdTasks: true,
          updatedTasks: true,
        },
      },
    },
  });

  if (!target) {
    await setFlash("error", "El usuario indicado no existe.");
    redirect("/users");
  }

  if (!canManageUser(session.user.role, target.role)) {
    await setFlash("error", "No tienes permisos para eliminar este usuario.");
    redirect("/users");
  }

  const links =
    target._count.assignedTasks +
    target._count.timeEntries +
    target._count.reports +
    target._count.aiUsages +
    target._count.auditLogs +
    target._count.createdUsers +
    target._count.updatedUsers +
    target._count.createdClients +
    target._count.updatedClients +
    target._count.createdProjects +
    target._count.updatedProjects +
    target._count.createdTasks +
    target._count.updatedTasks;

  if (links > 0) {
    await setFlash(
      "error",
      "No se puede eliminar: el usuario tiene datos vinculados. Desactívalo en su lugar.",
    );
    redirect("/users");
  }

  await prisma.user.delete({ where: { id: userId } });
  await setFlash("success", "Usuario eliminado correctamente.");
  redirect("/users");
};
