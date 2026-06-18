import { cn } from "@/lib/utils";

export type ActionTone = "view" | "edit" | "delete" | "activate" | "deactivate";

const TONES: Record<ActionTone, string> = {
  view: "bg-blue-600 hover:bg-blue-700",
  edit: "bg-cyan-500 hover:bg-cyan-600",
  delete: "bg-red-600 hover:bg-red-700",
  activate: "bg-emerald-600 hover:bg-emerald-700",
  deactivate: "bg-amber-500 hover:bg-amber-600",
};

/** Clases para un botón/enlace de acción por icono (cuadrado, color sólido). */
export function iconActionClass(tone: ActionTone) {
  return cn(
    "inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    TONES[tone],
  );
}
