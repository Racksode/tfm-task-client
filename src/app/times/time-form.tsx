"use client";

import { useActionState, useMemo, useState } from "react";

import { AlertBanner } from "@/components/feedback/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import type { TimeFormState } from "./actions";

type Mode = "duration" | "interval";

type TimeFormProps = {
  action: (state: TimeFormState, formData: FormData) => Promise<TimeFormState>;
  projects: { id: string; label: string }[];
  tasks: { id: string; projectId: string; label: string }[];
  submitLabel: string;
  dismissMs?: number;
  defaultValues?: {
    id?: string;
    taskId?: string;
    workDate?: string;
    mode?: Mode;
    durationHours?: string;
    durationMinutes?: string;
    startHour?: string;
    startMinute?: string;
    endHour?: string;
    endMinute?: string;
    description?: string | null;
  };
};

const todayInput = () => new Date().toISOString().slice(0, 10);

// Cajas numéricas compactas y centradas, compartidas por los campos de duración
// (Horas/Minutos) y de intervalo (HH:MM) para un aspecto uniforme. El ancho fijo
// solo se respeta dentro de un contenedor flex (en un grid el item se estira), por
// eso ambos modos envuelven el input en `flex items-center gap-2`.
const timeFieldClass = "w-16 text-center";

export function TimeForm({
  action,
  projects,
  tasks,
  submitLabel,
  dismissMs = 5000,
  defaultValues,
}: TimeFormProps) {
  const [state, formAction, pending] = useActionState<TimeFormState, FormData>(
    action,
    {},
  );

  const base = defaultValues ?? {};
  const value = (
    key: keyof NonNullable<TimeFormState["values"]>,
    fallback = "",
  ) => {
    const v = state.values?.[key];
    return typeof v === "string" ? v : fallback;
  };

  // Tarea inicial (tras error de servidor o desde defaultValues) y su proyecto.
  const initialTaskId = value("taskId", base.taskId ?? "");
  const initialProjectId =
    tasks.find((task) => task.id === initialTaskId)?.projectId ?? "";

  const [projectId, setProjectId] = useState(initialProjectId);
  const [taskId, setTaskId] = useState(initialTaskId);

  const projectTasks = useMemo(
    () => tasks.filter((task) => task.projectId === projectId),
    [tasks, projectId],
  );

  const initialMode =
    (state.values?.mode as Mode | undefined) ?? base.mode ?? "duration";
  const [mode, setMode] = useState<Mode>(initialMode);

  return (
    <Card>
      <CardContent className="pt-6">
        {state.error ? (
          <div className="mb-4">
            <AlertBanner
              key={state.nonce}
              type="error"
              message={state.error}
              dismissMs={dismissMs}
            />
          </div>
        ) : null}

        <form
          key={state.nonce ?? "init"}
          action={formAction}
          className="grid gap-4 sm:grid-cols-2"
        >
          {base.id ? (
            <input type="hidden" name="timeEntryId" value={base.id} />
          ) : null}
          <input type="hidden" name="mode" value={mode} />
          {/* El servidor solo necesita la tarea; el proyecto es un filtro de UI. */}
          <input type="hidden" name="taskId" value={taskId} />

          <div className="grid gap-2">
            <Label htmlFor="projectId">Proyecto</Label>
            <Select
              id="projectId"
              value={projectId}
              onChange={(event) => {
                setProjectId(event.target.value);
                setTaskId("");
              }}
            >
              <option value="">Selecciona un proyecto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task">Tarea</Label>
            <Select
              id="task"
              value={taskId}
              onChange={(event) => setTaskId(event.target.value)}
              disabled={!projectId}
            >
              <option value="">
                {projectId
                  ? "Selecciona una tarea"
                  : "Selecciona antes un proyecto"}
              </option>
              {projectTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="workDate">Fecha</Label>
            <Input
              id="workDate"
              name="workDate"
              type="date"
              defaultValue={value("workDate", base.workDate ?? todayInput())}
              required
            />
          </div>

          <div className="hidden sm:block" aria-hidden />

          <div className="grid gap-2 sm:col-span-2">
            <span className="text-sm font-medium">¿Cómo indicas el tiempo?</span>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="modeChoice"
                  checked={mode === "duration"}
                  onChange={() => setMode("duration")}
                  className="size-4"
                />
                Por duración
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="modeChoice"
                  checked={mode === "interval"}
                  onChange={() => setMode("interval")}
                  className="size-4"
                />
                Por inicio y fin
              </label>
            </div>
          </div>

          {/*
            Los campos de ambos modos se renderizan SIEMPRE en posiciones fijas
            y solo se oculta el modo inactivo con CSS; el servidor ignora los del
            modo no elegido según `mode`. Para el intervalo usamos campos
            numéricos hora/minuto (no `type="time"`): el input nativo de tiempo
            depende del locale del navegador y, en formato 12h, podía devolver
            valor vacío aunque el usuario rellenara HH:MM.
          */}
          <div
            className={cn(
              "grid gap-2 sm:col-span-2",
              mode !== "duration" && "hidden",
            )}
          >
            <Label htmlFor="durationHours">Duración</Label>
            <div className="flex items-center gap-2">
              <Input
                id="durationHours"
                name="durationHours"
                type="number"
                min={0}
                step={1}
                aria-label="Horas"
                defaultValue={value("durationHours", base.durationHours ?? "0")}
                className={timeFieldClass}
              />
              <span className="text-sm text-muted-foreground">h</span>
              <Input
                id="durationMinutes"
                name="durationMinutes"
                type="number"
                min={0}
                max={59}
                step={1}
                aria-label="Minutos"
                defaultValue={value("durationMinutes", base.durationMinutes ?? "0")}
                className={timeFieldClass}
              />
              <span className="text-sm text-muted-foreground">min</span>
            </div>
          </div>
          <div className={cn("grid gap-2", mode !== "interval" && "hidden")}>
            <Label htmlFor="startHour">Hora de inicio</Label>
            <div className="flex items-center gap-2">
              <Input
                id="startHour"
                name="startHour"
                type="number"
                min={0}
                max={23}
                step={1}
                placeholder="HH"
                aria-label="Hora de inicio (horas)"
                defaultValue={value("startHour", base.startHour ?? "")}
                className={timeFieldClass}
              />
              <span className="text-muted-foreground">:</span>
              <Input
                name="startMinute"
                type="number"
                min={0}
                max={59}
                step={1}
                placeholder="MM"
                aria-label="Hora de inicio (minutos)"
                defaultValue={value("startMinute", base.startMinute ?? "")}
                className={timeFieldClass}
              />
            </div>
          </div>
          <div className={cn("grid gap-2", mode !== "interval" && "hidden")}>
            <Label htmlFor="endHour">Hora de fin</Label>
            <div className="flex items-center gap-2">
              <Input
                id="endHour"
                name="endHour"
                type="number"
                min={0}
                max={23}
                step={1}
                placeholder="HH"
                aria-label="Hora de fin (horas)"
                defaultValue={value("endHour", base.endHour ?? "")}
                className={timeFieldClass}
              />
              <span className="text-muted-foreground">:</span>
              <Input
                name="endMinute"
                type="number"
                min={0}
                max={59}
                step={1}
                placeholder="MM"
                aria-label="Hora de fin (minutos)"
                defaultValue={value("endMinute", base.endMinute ?? "")}
                className={timeFieldClass}
              />
            </div>
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={value("description", base.description ?? "")}
              className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
            />
          </div>

          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit" disabled={pending}>
              {submitLabel}
            </Button>
            <span className="text-sm text-muted-foreground">
              El proyecto, la tarea y la fecha son obligatorios.
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
