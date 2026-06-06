"use server";

import { UserRole, UserStatus } from "@prisma/client";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MIN_PASSWORD_LENGTH = 8;
const SALT_ROUNDS = 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const redirectToUsers = (kind: "error" | "success", message: string): never => {
  redirect(`/users?${kind}=${encodeURIComponent(message)}`);
};

const requireInternalSession = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/users");
  }

  if (session.user.role !== UserRole.INTERNAL) {
    throw new Error("Unauthorized");
  }

  return session;
};

const getFormString = (formData: FormData, field: string) => {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const parseRole = (value: string): UserRole | null => {
  if (value === UserRole.INTERNAL || value === UserRole.CLIENT) {
    return value;
  }

  return null;
};

const parseStatus = (value: string): UserStatus | null => {
  if (value === UserStatus.ACTIVE || value === UserStatus.INACTIVE) {
    return value;
  }

  return null;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const resolveClientId = async (role: UserRole, rawClientId: string) => {
  if (role === UserRole.INTERNAL) {
    return null;
  }

  if (!rawClientId) {
    redirectToUsers(
      "error",
      "Los usuarios CLIENT requieren un cliente existente asociado.",
    );
  }

  const client = await prisma.client.findUnique({
    where: {
      id: rawClientId,
    },
    select: {
      id: true,
    },
  });

  if (!client) {
    redirectToUsers("error", "El cliente seleccionado no existe.");
  }

  return client!.id;
};

const validateBaseUserInput = (
  formData: FormData,
): {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  clientId: string;
} => {
  const name = getFormString(formData, "name");
  const email = normalizeEmail(getFormString(formData, "email"));
  const role = parseRole(getFormString(formData, "role"));
  const status = parseStatus(getFormString(formData, "status"));
  const clientId = getFormString(formData, "clientId");

  if (!name) {
    redirectToUsers("error", "El nombre es obligatorio.");
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    redirectToUsers("error", "El email debe tener un formato válido.");
  }

  if (!role) {
    redirectToUsers("error", "El rol seleccionado no es válido.");
  }

  if (!status) {
    redirectToUsers("error", "El estado seleccionado no es válido.");
  }

  return {
    name,
    email,
    role: role!,
    status: status!,
    clientId,
  };
};

export const createUser = async (formData: FormData) => {
  await requireInternalSession();

  const input = validateBaseUserInput(formData);
  const password = getFormString(formData, "password");

  if (password.length < MIN_PASSWORD_LENGTH) {
    redirectToUsers(
      "error",
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    redirectToUsers("error", "Ya existe un usuario con ese email.");
  }

  const clientId = await resolveClientId(input.role, input.clientId);
  const passwordHash = await hash(password, SALT_ROUNDS);

  await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      status: input.status,
      clientId,
      passwordHash,
    },
  });

  revalidatePath("/users");
  redirectToUsers("success", "Usuario creado correctamente.");
};

export const updateUser = async (formData: FormData) => {
  await requireInternalSession();

  const userId = getFormString(formData, "userId");

  if (!userId) {
    redirectToUsers("error", "No se ha indicado el usuario a editar.");
  }

  const input = validateBaseUserInput(formData);
  const password = getFormString(formData, "password");

  if (password && password.length < MIN_PASSWORD_LENGTH) {
    redirectToUsers(
      "error",
      `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    );
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!currentUser) {
    redirectToUsers("error", "El usuario indicado no existe.");
  }

  const existingEmail = await prisma.user.findFirst({
    where: {
      email: input.email,
      NOT: {
        id: userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingEmail) {
    redirectToUsers("error", "Ya existe otro usuario con ese email.");
  }

  const clientId = await resolveClientId(input.role, input.clientId);
  const passwordHash = password ? await hash(password, SALT_ROUNDS) : undefined;

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      status: input.status,
      clientId,
      ...(passwordHash ? { passwordHash } : {}),
    },
  });

  revalidatePath("/users");
  redirectToUsers("success", "Usuario actualizado correctamente.");
};
