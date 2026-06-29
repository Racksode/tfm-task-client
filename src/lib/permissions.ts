import { UserRole } from "@prisma/client";

export type Action = "view" | "create" | "update" | "delete" | "manage";

export type Section =
  | "dashboard"
  | "users"
  | "clients"
  | "projects"
  | "tasks"
  | "times"
  | "reports"
  | "assistant"
  | "config"
  | "rates";

export const STAFF_ROLES: UserRole[] = [
  UserRole.SUPERADMIN,
  UserRole.ADMIN,
  UserRole.INTERNAL,
];

export const ADMIN_ROLES: UserRole[] = [UserRole.SUPERADMIN, UserRole.ADMIN];

export const isStaff = (role: UserRole) => STAFF_ROLES.includes(role);

export const isAdmin = (role: UserRole) => ADMIN_ROLES.includes(role);

const BUSINESS_SECTIONS: Section[] = [
  "clients",
  "projects",
  "tasks",
  "times",
  "reports",
  "assistant",
];

/**
 * Modelo "Opera / Gestiona / Manda":
 * - SUPERADMIN: todo.
 * - ADMIN: gestión de usuarios, configuración, borrado y negocio.
 * - INTERNAL: opera el negocio (ver/crear/editar), sin borrar ni acceder a usuarios/config.
 * - CLIENT: sin acceso al área interna.
 */
export function can(role: UserRole, action: Action, section: Section): boolean {
  if (role === UserRole.SUPERADMIN) {
    return true;
  }

  if (role === UserRole.CLIENT) {
    return false;
  }

  if (role === UserRole.ADMIN) {
    return true;
  }

  if (role === UserRole.INTERNAL) {
    if (section === "dashboard") {
      return action === "view";
    }
    // Tarifas = configuración de negocio sensible: solo ADMIN+.
    if (section === "users" || section === "config" || section === "rates") {
      return false;
    }
    if (BUSINESS_SECTIONS.includes(section)) {
      return action === "view" || action === "create" || action === "update";
    }
    return false;
  }

  return false;
}

/**
 * Un ADMIN no puede gestionar a otros ADMIN ni a SUPERADMIN; solo SUPERADMIN puede.
 */
export function canManageUser(
  actorRole: UserRole,
  targetRole: UserRole,
): boolean {
  if (actorRole === UserRole.SUPERADMIN) {
    return true;
  }
  if (actorRole === UserRole.ADMIN) {
    return targetRole === UserRole.INTERNAL || targetRole === UserRole.CLIENT;
  }
  return false;
}
