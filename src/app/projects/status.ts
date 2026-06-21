import { ProjectStatus } from "@prisma/client";

/** Etiquetas en español para los estados de proyecto. */
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.ACTIVE]: "Activo",
  [ProjectStatus.PAUSED]: "En pausa",
  [ProjectStatus.COMPLETED]: "Completado",
  [ProjectStatus.CANCELLED]: "Cancelado",
};
