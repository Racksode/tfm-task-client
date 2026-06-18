"use server";

import { UserRole, UserStatus } from "@prisma/client";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

const MIN_PASSWORD_LENGTH = 8;
const SALT_ROUNDS = 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (path: string, message: string): never => {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
};

const succeed = (message: string): never => {
  revalidatePath("/users");
  redirect(`/users?success=${encodeURIComponent(message)}`);
};

const getFormString = (formData: FormData, field: string) => {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
};

const parseRole = (value: string): UserRole | null =>
  value === UserRole.INTERNAL || value === UserRole.CLIENT ? value : null;

const parseStatus = (value: string): UserStatus | null =>
  value === UserStatus.ACTIVE || value === UserStatus.INACTIVE ? value : null;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const resolveClientId = async (
  role: UserRole,
  rawClientId: string,
  errorPath: string,
) => {
  if (role === UserRole.INTERNAL) {
    return null;
  }

  if (!rawClientId) {
    fail(errorPath, "Los usuarios CLIENT requieren un cliente existente asociado.");
  }

  const client = await prisma.client.findUnique({
    where: { id: rawClientId },
    select: { id: true },
  });

  if (!client) {
    fail(errorPath, "El cliente seleccionado no existe.");
  }

  return client!.id;
};

type BaseUserInput = {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  clientId: string;
};

const validateBaseUserInput = (
  formData: FormData,
  errorPath: string,
): BaseUserInput => {
  const name = getFormString(formData, "name");
  const email = normalizeEmail(getFormString(formData, "email"));
  const role = parseRole(getFormString(formData, "role"));
  const status = parseStatus(getFormString(formData, "status"));
  const clientId = getFormString(formData, "clientId");

  if (!name) {
    fail(errorPath, "El nombre es obligatorio.");
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    fail(errorPath, "El email debe tener un formato válido.");
  }

  if (!role) {
    fail(errorPath, "El rol seleccionado no es válido.");
  }

  if (!status) {
    fail(errorPath, "El estado seleccionado no es válido.");
  }

  return { name, email, role: role!, status: status!, clientId };
};

export const createUser = async (formData: FormData) => {
  const session = await requireAdmin();

  const errorPath = "/users/new";
  const input = validateBaseUserInput(formData, errorPath);
  const password = getFormString(formData, "password");

  if (password.length < MIN_PASSWORD_LENGTH) {
    fail(errorPath, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    fail(errorPath, "Ya existe un usuario con ese email.");
  }

  const clientId = await resolveClientId(input.role, input.clientId, errorPath);
  const passwordHash = await hash(password, SALT_ROUNDS);

  await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      status: input.status,
      clientId,
      passwordHash,
      createdById: session.user.id,
      updatedById: session.user.id,
    },
  });

  succeed("Usuario creado correctamente.");
};

export const updateUser = async (formData: FormData) => {
  const session = await requireAdmin();

  const userId = getFormString(formData, "userId");

  if (!userId) {
    fail("/users", "No se ha indicado el usuario a editar.");
  }

  const errorPath = `/users/${userId}/edit`;
  const input = validateBaseUserInput(formData, errorPath);
  const password = getFormString(formData, "password");

  if (password && password.length < MIN_PASSWORD_LENGTH) {
    fail(errorPath, `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!currentUser) {
    fail("/users", "El usuario indicado no existe.");
  }

  const existingEmail = await prisma.user.findFirst({
    where: { email: input.email, NOT: { id: userId } },
    select: { id: true },
  });

  if (existingEmail) {
    fail(errorPath, "Ya existe otro usuario con ese email.");
  }

  const clientId = await resolveClientId(input.role, input.clientId, errorPath);
  const passwordHash = password ? await hash(password, SALT_ROUNDS) : undefined;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      status: input.status,
      clientId,
      updatedById: session.user.id,
      ...(passwordHash ? { passwordHash } : {}),
    },
  });

  succeed("Usuario actualizado correctamente.");
};

export const setUserStatus = async (formData: FormData) => {
  const session = await requireAdmin();

  const userId = getFormString(formData, "userId");
  const status = parseStatus(getFormString(formData, "status"));

  if (!userId || !status) {
    fail("/users", "Datos no válidos para cambiar el estado.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { status: status!, updatedById: session.user.id },
  });

  succeed("Estado del usuario actualizado.");
};
