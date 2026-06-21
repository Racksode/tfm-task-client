import { TaskPriority, TaskStatus } from "@prisma/client";

/** Etiquetas en español para los estados de tarea. */
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "Pendiente",
  [TaskStatus.IN_PROGRESS]: "En progreso",
  [TaskStatus.PAUSED]: "En pausa",
  [TaskStatus.COMPLETED]: "Completada",
  [TaskStatus.DISCARDED]: "Descartada",
};

/** Etiquetas en español para la prioridad de tarea. */
export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: "Baja",
  [TaskPriority.MEDIUM]: "Media",
  [TaskPriority.HIGH]: "Alta",
};

export const TASK_STATUS_BADGE: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "border-transparent bg-slate-500 text-white",
  [TaskStatus.IN_PROGRESS]: "border-transparent bg-green-600 text-white",
  [TaskStatus.PAUSED]: "border-transparent bg-amber-500 text-white",
  [TaskStatus.COMPLETED]: "border-transparent bg-slate-700 text-white",
  [TaskStatus.DISCARDED]: "border-transparent bg-rose-600 text-white",
};

export const TASK_PRIORITY_BADGE: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: "border-transparent bg-slate-400 text-white",
  [TaskPriority.MEDIUM]: "border-transparent bg-sky-600 text-white",
  [TaskPriority.HIGH]: "border-transparent bg-orange-600 text-white",
};
