"use client";

import { Square } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { stopTimer } from "@/app/times/actions";
import { cn } from "@/lib/utils";

function formatElapsed(startedAtISO: string) {
  const diffMs = Date.now() - new Date(startedAtISO).getTime();
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

type ActiveTimerIndicatorProps = {
  taskId: string;
  taskTitle: string;
  /** Instante de inicio en ISO (serializable desde el servidor). */
  startedAt: string;
};

/** Indicador global del cronómetro en curso: tarea, tiempo en vivo y botón de parar. */
export function ActiveTimerIndicator({
  taskId,
  taskTitle,
  startedAt,
}: ActiveTimerIndicatorProps) {
  const [elapsed, setElapsed] = useState(() => formatElapsed(startedAt));

  useEffect(() => {
    const id = setInterval(() => setElapsed(formatElapsed(startedAt)), 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="relative flex size-2.5 shrink-0" aria-hidden>
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
      </span>
      <Link
        href={`/tasks/${taskId}`}
        className="min-w-0 truncate text-sm font-medium hover:underline"
        title={taskTitle}
      >
        {taskTitle}
      </Link>
      <span
        suppressHydrationWarning
        className="shrink-0 tabular-nums text-sm text-muted-foreground"
      >
        {elapsed}
      </span>
      <form action={stopTimer}>
        <button
          type="submit"
          className={cn(
            "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-white transition-colors",
            "bg-amber-500 hover:bg-amber-600",
          )}
        >
          <Square className="size-3.5" />
          Detener
        </button>
      </form>
    </div>
  );
}
