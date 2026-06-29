import { TimeEntryType } from "@prisma/client";

/** Etiquetas en español para el tipo de registro de tiempo. */
export const TIME_TYPE_LABELS: Record<TimeEntryType, string> = {
  [TimeEntryType.MANUAL]: "Manual",
  [TimeEntryType.START_STOP]: "Cronómetro",
};

export const TIME_TYPE_BADGE: Record<TimeEntryType, string> = {
  [TimeEntryType.MANUAL]: "border-transparent bg-slate-500 text-white",
  [TimeEntryType.START_STOP]: "border-transparent bg-sky-600 text-white",
};

/** Formatea una duración en minutos como «Xh Ym» (o «Ym» si es menos de una hora). */
export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return `${mins} min`;
  }
  if (mins === 0) {
    return `${hours} h`;
  }
  return `${hours} h ${mins} min`;
};
