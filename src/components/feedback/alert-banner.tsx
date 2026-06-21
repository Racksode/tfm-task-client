"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type AlertType = "info" | "success" | "warning" | "error";

type AlertBannerProps = {
  type: AlertType;
  message: string;
  /** Milisegundos antes de auto-cerrar. 0 = no auto-cerrar. Los errores nunca se auto-cierran. */
  dismissMs?: number;
  /** Acción a ejecutar una vez al cerrarse el aviso (p. ej. borrar el flash). */
  onDismiss?: () => void;
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
  onDismiss,
}: AlertBannerProps) {
  const [open, setOpen] = useState(true);
  const dismissed = useRef(false);

  // Los errores permanecen hasta que el usuario los cierra (para poder leerlos);
  // el resto se auto-cierran según `dismissMs`.
  const autoDismissMs = type === "error" ? 0 : dismissMs;

  // El borrado del flash se hace al CERRAR, no al mostrar: hacerlo al montar
  // dispara un refresh del servidor que ocultaría el aviso antes de tiempo.
  const close = () => {
    if (dismissed.current) {
      return;
    }
    dismissed.current = true;
    setOpen(false);
    onDismiss?.();
  };

  useEffect(() => {
    if (autoDismissMs <= 0) {
      return;
    }
    const timer = setTimeout(close, autoDismissMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        onClick={close}
        aria-label="Cerrar mensaje"
        className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
