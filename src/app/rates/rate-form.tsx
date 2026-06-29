"use client";

import { RateScope, RateStatus } from "@prisma/client";
import { useActionState, useState } from "react";

import { AlertBanner } from "@/components/feedback/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

import type { RateFormState } from "./actions";

type Option = { id: string; label: string };

type RateFormProps = {
  action: (state: RateFormState, formData: FormData) => Promise<RateFormState>;
  clients: Option[];
  projects: Option[];
  submitLabel: string;
  dismissMs?: number;
  defaultValues?: {
    id?: string;
    name?: string;
    hourlyAmount?: string;
    scope?: RateScope;
    status?: RateStatus;
    clientId?: string | null;
    projectId?: string | null;
  };
};

export function RateForm({
  action,
  clients,
  projects,
  submitLabel,
  dismissMs = 5000,
  defaultValues,
}: RateFormProps) {
  const [state, formAction, pending] = useActionState<RateFormState, FormData>(
    action,
    {},
  );

  const base = defaultValues ?? {};
  const value = (
    key: keyof NonNullable<RateFormState["values"]>,
    fallback = "",
  ) => state.values?.[key] ?? fallback;

  const initialScope =
    (state.values?.scope as RateScope | undefined) ??
    base.scope ??
    RateScope.CLIENT;
  const [scope, setScope] = useState<RateScope>(initialScope);

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
            <input type="hidden" name="rateId" value={base.id} />
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
            <Label htmlFor="hourlyAmount">Importe (€/h)</Label>
            <Input
              id="hourlyAmount"
              name="hourlyAmount"
              type="number"
              min="0"
              step="0.01"
              defaultValue={value("hourlyAmount", base.hourlyAmount ?? "")}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="scope">Ámbito</Label>
            {/* El ámbito es controlado para mostrar el selector de cliente o
                proyecto según corresponda; el servidor ignora el que no aplica. */}
            <Select
              id="scope"
              name="scope"
              value={scope}
              onChange={(event) => setScope(event.target.value as RateScope)}
            >
              <option value={RateScope.SYSTEM}>Sistema (global)</option>
              <option value={RateScope.CLIENT}>Cliente</option>
              <option value={RateScope.PROJECT}>Proyecto</option>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              id="status"
              name="status"
              defaultValue={value("status", base.status ?? RateStatus.ACTIVE)}
            >
              <option value={RateStatus.ACTIVE}>Activa</option>
              <option value={RateStatus.INACTIVE}>Inactiva</option>
            </Select>
          </div>

          {scope === RateScope.CLIENT ? (
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="clientId">Cliente</Label>
              <Select
                id="clientId"
                name="clientId"
                defaultValue={value("clientId", base.clientId ?? "")}
              >
                <option value="">Selecciona un cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.label}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}

          {scope === RateScope.PROJECT ? (
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="projectId">Proyecto</Label>
              <Select
                id="projectId"
                name="projectId"
                defaultValue={value("projectId", base.projectId ?? "")}
              >
                <option value="">Selecciona un proyecto</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.label}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}

          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit" disabled={pending}>
              {submitLabel}
            </Button>
            <span className="text-sm text-muted-foreground">
              El nombre, el importe y el ámbito son obligatorios.
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
