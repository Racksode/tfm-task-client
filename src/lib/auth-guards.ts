import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

/**
 * Garantiza que existe una sesión activa. Si no, redirige a /login.
 * Devuelve la sesión con el usuario garantizado.
 */
export async function requireSession() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session;
}

/**
 * Garantiza una sesión activa con rol INTERNAL. Aplica el mismo criterio
 * en páginas y server actions: sin sesión redirige a /login; con un rol
 * distinto, redirige a la raíz, que reenvía al área que corresponda.
 */
export async function requireInternal() {
  const session = await requireSession();

  if (session.user.role !== UserRole.INTERNAL) {
    redirect("/");
  }

  return session;
}
