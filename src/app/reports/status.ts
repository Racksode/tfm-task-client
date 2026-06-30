import { ReportStatus } from "@prisma/client";

/** Etiquetas en español para el estado del reporte. */
export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  [ReportStatus.DRAFT]: "Borrador",
  [ReportStatus.GENERATED]: "Generado",
  [ReportStatus.REVIEWED]: "Revisado",
};

export const REPORT_STATUS_BADGE: Record<ReportStatus, string> = {
  [ReportStatus.DRAFT]: "border-transparent bg-slate-500 text-white",
  [ReportStatus.GENERATED]: "border-transparent bg-sky-600 text-white",
  [ReportStatus.REVIEWED]: "border-transparent bg-green-600 text-white",
};

/** Formatea un importe como moneda local, p. ej. «1.234,50 €». */
export const formatCurrency = (amount: number, currency = "EUR") =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(amount);

/** Formatea horas decimales como «12,5 h». */
export const formatHours = (hours: number) =>
  `${new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 }).format(hours)} h`;
