"use client";

import { UserRole, UserStatus } from "@prisma/client";
import { useActionState } from "react";

import { AlertBanner } from "@/components/feedback/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

import type { UserFormState } from "./actions";

type UserFormProps = {
  action: (state: UserFormState, formData: FormData) => Promise<UserFormState>;
  clients: { id: string; name: string }[];
  submitLabel: string;
  passwordLabel: string;
  passwordRequired: boolean;
  passwordHint?: string;
  defaultValues?: {
    id?: string;
    name?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
    clientId?: string | null;
  };
};

export function UserForm({
  action,
  clients,
  submitLabel,
  passwordLabel,
  passwordRequired,
  passwordHint,
  defaultValues,
}: UserFormProps) {
  const [state, formAction, pending] = useActionState<UserFormState, FormData>(
    action,
    {},
  );

  const base = defaultValues ?? {};
  const value = (key: keyof NonNullable<UserFormState["values"]>, fallback = "") =>
    state.values?.[key] ?? fallback;

  return (
    <Card>
      <CardContent className="pt-6">
        {state.error ? (
          <div className="mb-4">
            <AlertBanner type="error" message={state.error} dismissMs={0} />
          </div>
        ) : null}

        <form
          key={state.nonce ?? "init"}
          action={formAction}
          className="grid gap-4 sm:grid-cols-2"
        >
          {base.id ? <input type="hidden" name="userId" value={base.id} /> : null}

          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" defaultValue={value("name", base.name)} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={value("email", base.email)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Rol</Label>
            <Select id="role" name="role" defaultValue={value("role", base.role ?? UserRole.INTERNAL)}>
              <option value={UserRole.INTERNAL}>INTERNAL</option>
              <option value={UserRole.CLIENT}>CLIENT</option>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Estado</Label>
            <Select id="status" name="status" defaultValue={value("status", base.status ?? UserStatus.ACTIVE)}>
              <option value={UserStatus.ACTIVE}>ACTIVE</option>
              <option value={UserStatus.INACTIVE}>INACTIVE</option>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="clientId">Cliente</Label>
            <Select id="clientId" name="clientId" defaultValue={value("clientId", base.clientId ?? "")}>
              <option value="">Sin cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">{passwordLabel}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={8}
              required={passwordRequired}
              placeholder={passwordHint}
            />
          </div>

          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit" disabled={pending}>
              {submitLabel}
            </Button>
            <span className="text-sm text-muted-foreground">
              Los usuarios CLIENT requieren un cliente asociado.
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
