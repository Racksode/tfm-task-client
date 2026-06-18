import { cn } from "@/lib/utils";

const TONES = {
  view: "bg-blue-600 hover:bg-blue-700",
  edit: "bg-cyan-500 hover:bg-cyan-600",
  delete: "bg-red-600 hover:bg-red-700",
  activate: "bg-emerald-600 hover:bg-emerald-700",
  deactivate: "bg-amber-500 hover:bg-amber-600",
  back: "bg-slate-600 hover:bg-slate-700",
  create: "bg-blue-600 hover:bg-blue-700",
} as const;

export type ActionTone = keyof typeof TONES;

/** Botón/enlace de acción solo icono (cuadrado, color sólido). */
export function iconActionClass(tone: ActionTone) {
  return cn(
    "inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    TONES[tone],
  );
}

/** Botón de acción con icono + texto (color sólido), para cabeceras de página. */
export function actionButtonClass(tone: ActionTone) {
  return cn(
    "inline-flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    TONES[tone],
  );
}
