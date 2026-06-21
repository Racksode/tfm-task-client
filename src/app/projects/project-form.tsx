"use client";

import { ProjectStatus } from "@prisma/client";
import { useActionState } from "react";

import { AlertBanner } from "@/components/feedback/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

import type { ProjectFormState } from "./actions";
import { PROJECT_STATUS_LABELS } from "./status";

type ProjectFormProps = {
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  clients: { id: string; name: string }[];
  submitLabel: string;
  dismissMs?: number;
  defaultValues?: {
    id?: string;
    clientId?: string;
    name?: string;
    description?: string | null;
    status?: ProjectStatus;
    visibleToClient?: boolean;
    startDate?: string | null;
    expectedEndDate?: string | null;
    baseRate?: string | null;
  };
};

export function ProjectForm({
  action,
  clients,
  submitLabel,
  dismissMs = 5000,
  defaultValues,
}: ProjectFormProps) {
  const [state, formAction, pending] = useActionState<ProjectFormState, FormData>(
    action,
    {},
  );

  const base = defaultValues ?? {};
  const value = (
    key: keyof NonNullable<ProjectFormState["values"]>,
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
          {base.id ? (
            <input type="hidden" name="projectId" value={base.id} />
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              defaultValue={value("name", base.name ?? "")}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="clientId">Cliente</Label>
            <Select
              id="clientId"
              name="clientId"
              defaultValue={value("clientId", base.clientId ?? "")}
              required
            >
              <option value="">Selecciona un cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              id="status"
              name="status"
              defaultValue={value("status", base.status ?? ProjectStatus.ACTIVE)}
            >
              {Object.values(ProjectStatus).map((status) => (
                <option key={status} value={status}>
                  {PROJECT_STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="baseRate">Tarifa base (€/h)</Label>
            <Input
              id="baseRate"
              name="baseRate"
              type="number"
              min="0"
              step="0.01"
              defaultValue={value("baseRate", base.baseRate ?? "")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="startDate">Fecha de inicio</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              defaultValue={value("startDate", base.startDate ?? "")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expectedEndDate">Fin previsto</Label>
            <Input
              id="expectedEndDate"
              name="expectedEndDate"
              type="date"
              defaultValue={value("expectedEndDate", base.expectedEndDate ?? "")}
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
              El nombre y el cliente son obligatorios.
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
