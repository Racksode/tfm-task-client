"use client";

import { ClientStatus } from "@prisma/client";
import { useActionState } from "react";

import { AlertBanner } from "@/components/feedback/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

import type { ClientFormState } from "./actions";

type ClientFormProps = {
  action: (state: ClientFormState, formData: FormData) => Promise<ClientFormState>;
  submitLabel: string;
  dismissMs?: number;
  defaultValues?: {
    id?: string;
    name?: string;
    email?: string | null;
    phone?: string | null;
    company?: string | null;
    internalNotes?: string | null;
    status?: ClientStatus;
  };
};

export function ClientForm({
  action,
  submitLabel,
  dismissMs = 5000,
  defaultValues,
}: ClientFormProps) {
  const [state, formAction, pending] = useActionState<ClientFormState, FormData>(
    action,
    {},
  );

  const base = defaultValues ?? {};
  const value = (
    key: keyof NonNullable<ClientFormState["values"]>,
    fallback = "",
  ) => state.values?.[key] ?? fallback;

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
            <input type="hidden" name="clientId" value={base.id} />
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={value("email", base.email ?? "")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={value("phone", base.phone ?? "")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              name="company"
              defaultValue={value("company", base.company ?? "")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              id="status"
              name="status"
              defaultValue={value("status", base.status ?? ClientStatus.ACTIVE)}
            >
              <option value={ClientStatus.ACTIVE}>ACTIVE</option>
              <option value={ClientStatus.INACTIVE}>INACTIVE</option>
            </Select>
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="internalNotes">Notas internas</Label>
            <textarea
              id="internalNotes"
              name="internalNotes"
              rows={3}
              defaultValue={value("internalNotes", base.internalNotes ?? "")}
              className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
            />
          </div>

          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit" disabled={pending}>
              {submitLabel}
            </Button>
            <span className="text-sm text-muted-foreground">
              Solo el nombre es obligatorio.
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
