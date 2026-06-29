import { RateScope, RateStatus } from "@prisma/client";

/** Etiquetas en español para el ámbito de la tarifa. */
export const RATE_SCOPE_LABELS: Record<RateScope, string> = {
  [RateScope.SYSTEM]: "Sistema",
  [RateScope.CLIENT]: "Cliente",
  [RateScope.PROJECT]: "Proyecto",
};

export const RATE_SCOPE_BADGE: Record<RateScope, string> = {
  [RateScope.SYSTEM]: "border-transparent bg-slate-600 text-white",
  [RateScope.CLIENT]: "border-transparent bg-blue-600 text-white",
  [RateScope.PROJECT]: "border-transparent bg-violet-600 text-white",
};

/** Etiquetas en español para el estado de la tarifa. */
export const RATE_STATUS_LABELS: Record<RateStatus, string> = {
  [RateStatus.ACTIVE]: "Activa",
  [RateStatus.INACTIVE]: "Inactiva",
};

export const RATE_STATUS_BADGE: Record<RateStatus, string> = {
  [RateStatus.ACTIVE]: "border-transparent bg-green-600 text-white",
  [RateStatus.INACTIVE]: "border-transparent bg-slate-400 text-white",
};

/** Formatea un importe por hora como «12,00 €/h». */
export const formatHourlyRate = (amount: number, currency = "EUR") =>
  `${new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(amount)}/h`;
