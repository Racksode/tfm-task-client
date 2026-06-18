import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { isAdmin, isStaff } from "@/lib/permissions";

/**
 * Garantiza que existe una sesión activa. Si no, redirige a /login.
 */
export async function requireSession() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session;
}

/**
 * Garantiza una sesión de personal interno (INTERNAL, ADMIN o SUPERADMIN).
 * Un rol no autorizado se redirige a la raíz, que reenvía al área que corresponda.
 */
export async function requireStaff() {
  const session = await requireSession();

  if (!isStaff(session.user.role)) {
    redirect("/");
  }

  return session;
}

/**
 * Garantiza una sesión con rol de administración (ADMIN o SUPERADMIN).
 */
export async function requireAdmin() {
  const session = await requireSession();

  if (!isAdmin(session.user.role)) {
    redirect("/");
  }

  return session;
}
