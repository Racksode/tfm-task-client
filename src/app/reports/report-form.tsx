"use client";

import { useActionState, useMemo, useState } from "react";

import { AlertBanner } from "@/components/feedback/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

import type { ReportFormState } from "./actions";

type ReportFormProps = {
  action: (state: ReportFormState, formData: FormData) => Promise<ReportFormState>;
  clients: { id: string; label: string }[];
  projects: { id: string; clientId: string; label: string }[];
  submitLabel: string;
  dismissMs?: number;
  defaultValues?: {
    id?: string;
    clientId?: string;
    projectId?: string | null;
    periodStart?: string;
    periodEnd?: string;
    functionalSummary?: string | null;
    visibleToClient?: boolean;
  };
};

export function ReportForm({
  action,
  clients,
  projects,
  submitLabel,
  dismissMs = 5000,
  defaultValues,
}: ReportFormProps) {
  const [state, formAction, pending] = useActionState<ReportFormState, FormData>(
    action,
    {},
  );

  const base = defaultValues ?? {};
  const value = (
    key: keyof NonNullable<ReportFormState["values"]>,
    fallback = "",
  ) => {
    const v = state.values?.[key];
    return typeof v === "string" ? v : fallback;
  };

  const [clientId, setClientId] = useState(value("clientId", base.clientId ?? ""));
  const [projectId, setProjectId] = useState(
    value("projectId", base.projectId ?? ""),
  );

  const clientProjects = useMemo(
    () => projects.filter((project) => project.clientId === clientId),
    [projects, clientId],
  );

  const visibleChecked =
    state.values?.visibleToClient !== undefined
      ? state.values.visibleToClient === "true"
      : (base.visibleToClient ?? false);

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
            <input type="hidden" name="reportId" value={base.id} />
          ) : null}
          <input type="hidden" name="projectId" value={projectId} />

          <div className="grid gap-2">
            <Label htmlFor="clientId">Cliente</Label>
            <Select
              id="clientId"
              name="clientId"
              value={clientId}
              onChange={(event) => {
                setClientId(event.target.value);
                setProjectId("");
              }}
            >
              <option value="">Selecciona un cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project">Proyecto (opcional)</Label>
            <Select
              id="project"
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              disabled={!clientId}
            >
              <option value="">
                {clientId ? "Todos los proyectos del cliente" : "Selecciona antes un cliente"}
              </option>
              {clientProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="periodStart">Inicio del periodo</Label>
            <Input
              id="periodStart"
              name="periodStart"
              type="date"
              defaultValue={value("periodStart", base.periodStart ?? "")}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="periodEnd">Fin del periodo</Label>
            <Input
              id="periodEnd"
              name="periodEnd"
              type="date"
              defaultValue={value("periodEnd", base.periodEnd ?? "")}
              required
            />
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="functionalSummary">Resumen interno</Label>
            <textarea
              id="functionalSummary"
              name="functionalSummary"
              rows={4}
              defaultValue={value("functionalSummary", base.functionalSummary ?? "")}
              className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
            />
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="visibleToClient"
                value="true"
                defaultChecked={visibleChecked}
                className="size-4"
              />
              Visible para el cliente
            </label>
            <span className="text-xs text-muted-foreground">
              Al guardar se calculan las horas y el coste del periodo a partir de
              los tiempos registrados.
            </span>
          </div>

          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit" disabled={pending}>
              {submitLabel}
            </Button>
            <span className="text-sm text-muted-foreground">
              El cliente y el periodo son obligatorios.
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
