"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type AlertType = "info" | "success" | "warning" | "error";

type AlertBannerProps = {
  type: AlertType;
  message: string;
  /** Milisegundos antes de auto-cerrar. 0 = no auto-cerrar. Los errores nunca se auto-cierran. */
  dismissMs?: number;
  /**
   * Si es un aviso de tipo "flash" (cookie), bórrala al mostrarse para que sea
   * de lectura única y no reaparezca en otras páginas que leen la misma cookie.
   */
  clearFlashOnShow?: boolean;
};

const STYLES: Record<AlertType, string> = {
  info: "border-sky-200 bg-sky-50 text-sky-800",
  success: "border-green-200 bg-green-50 text-green-800",
  warning: "border-orange-200 bg-orange-50 text-orange-900",
  error: "border-rose-200 bg-rose-50 text-rose-800",
};

export function AlertBanner({
  type,
  message,
  dismissMs = 5000,
  clearFlashOnShow = false,
}: AlertBannerProps) {
  const [open, setOpen] = useState(true);

  // Los errores permanecen hasta que el usuario los cierra (para poder leerlos);
  // el resto se auto-cierran según `dismissMs`.
  const autoDismissMs = type === "error" ? 0 : dismissMs;

  // Lectura única: se borra la cookie del flash al mostrarse, vía route handler
  // (fetch), NO con una server action, porque una server action dispararía un
  // refresh que ocultaría el aviso antes de tiempo. Así el aviso permanece y la
  // cookie no reaparece al navegar a otra página.
  useEffect(() => {
    if (!clearFlashOnShow) {
      return;
    }
    void fetch("/api/flash", { method: "DELETE" });
  }, [clearFlashOnShow]);

  useEffect(() => {
    if (autoDismissMs <= 0) {
      return;
    }
    const timer = setTimeout(() => setOpen(false), autoDismissMs);
    return () => clearTimeout(timer);
  }, [autoDismissMs]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="status"
      className={cn(
        "flex items-start justify-between gap-3 rounded-md border px-4 py-3 text-sm",
        STYLES[type],
      )}
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Cerrar mensaje"
        className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
