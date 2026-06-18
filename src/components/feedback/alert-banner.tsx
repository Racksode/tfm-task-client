"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type AlertType = "info" | "success" | "warning" | "error";

type AlertBannerProps = {
  type: AlertType;
  message: string;
  /** Milisegundos antes de auto-cerrar. 0 = no auto-cerrar. */
  dismissMs?: number;
  /** Acción a ejecutar una vez al mostrarse (p. ej. borrar el flash). */
  onShow?: () => void;
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
  onShow,
}: AlertBannerProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    onShow?.();
    // solo una vez al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dismissMs <= 0) {
      return;
    }
    const timer = setTimeout(() => setOpen(false), dismissMs);
    return () => clearTimeout(timer);
  }, [dismissMs]);

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
