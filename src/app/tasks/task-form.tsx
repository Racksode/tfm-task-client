"use client";

import { TaskPriority, TaskStatus } from "@prisma/client";
import { useActionState } from "react";

import { AlertBanner } from "@/components/feedback/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

import type { TaskFormState } from "./actions";
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from "./status";

type TaskFormProps = {
  action: (state: TaskFormState, formData: FormData) => Promise<TaskFormState>;
  projects: { id: string; label: string }[];
  responsibles: { id: string; name: string }[];
  submitLabel: string;
  dismissMs?: number;
  defaultValues?: {
    id?: string;
    projectId?: string;
    responsibleId?: string | null;
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    visibleToClient?: boolean;
    functionalStart?: string | null;
    functionalEnd?: string | null;
  };
};

export function TaskForm({
  action,
  projects,
  responsibles,
  submitLabel,
  dismissMs = 5000,
  defaultValues,
}: TaskFormProps) {
  const [state, formAction, pending] = useActionState<TaskFormState, FormData>(
    action,
    {},
  );

  const base = defaultValues ?? {};
  const value = (
    key: keyof NonNullable<TaskFormState["values"]>,
    fallback = "",
  ) => {
    const v = state.values?.[key];
    return typeof v === "string" ? v : fallback;
  };

  const visibleDefault =
    state.values?.visibleToClient ?? base.visibleToClient ?? false;

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
          {base.id ? <input type="hidden" name="taskId" value={base.id} /> : null}

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              defaultValue={value("title", base.title ?? "")}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="projectId">Proyecto</Label>
            <Select
              id="projectId"
              name="projectId"
              defaultValue={value("projectId", base.projectId ?? "")}
              required
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
            <Label htmlFor="responsibleId">Responsable</Label>
            <Select
              id="responsibleId"
              name="responsibleId"
              defaultValue={value("responsibleId", base.responsibleId ?? "")}
            >
              <option value="">Sin asignar</option>
              {responsibles.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              id="status"
              name="status"
              defaultValue={value("status", base.status ?? TaskStatus.PENDING)}
            >
              {Object.values(TaskStatus).map((status) => (
                <option key={status} value={status}>
                  {TASK_STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority">Prioridad</Label>
            <Select
              id="priority"
              name="priority"
              defaultValue={value("priority", base.priority ?? TaskPriority.MEDIUM)}
            >
              {Object.values(TaskPriority).map((priority) => (
                <option key={priority} value={priority}>
                  {TASK_PRIORITY_LABELS[priority]}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="functionalStart">Inicio</Label>
            <Input
              id="functionalStart"
              name="functionalStart"
              type="date"
              defaultValue={value("functionalStart", base.functionalStart ?? "")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="functionalEnd">Fin</Label>
            <Input
              id="functionalEnd"
              name="functionalEnd"
              type="date"
              defaultValue={value("functionalEnd", base.functionalEnd ?? "")}
            />
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

          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              name="visibleToClient"
              defaultChecked={visibleDefault}
              className="size-4 rounded border-input"
            />
            Visible para el cliente
          </label>

          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit" disabled={pending}>
              {submitLabel}
            </Button>
            <span className="text-sm text-muted-foreground">
              El título y el proyecto son obligatorios.
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
