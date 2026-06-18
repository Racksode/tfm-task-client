/**
 * Configuración visual por sección.
 * `accent` es la clase del acento izquierdo de las pastillas de detalle
 * (igual que la barra del ítem de menú activo). Cada sección puede definir
 * su color; por defecto, el primario.
 */
export const sectionAccentClass: Record<string, string> = {
  users: "border-l-primary",
  // clients: "border-l-blue-500",
  // projects: "border-l-violet-500",
  // tasks: "border-l-amber-500",
};

export function getSectionAccent(section: string): string {
  return sectionAccentClass[section] ?? "border-l-primary";
}
