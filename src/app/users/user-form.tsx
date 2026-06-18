import { UserRole, UserStatus } from "@prisma/client";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type UserFormProps = {
  action: (formData: FormData) => Promise<void>;
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

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

export function UserForm({
  action,
  clients,
  submitLabel,
  passwordLabel,
  passwordRequired,
  passwordHint,
  defaultValues,
}: UserFormProps) {
  const values = defaultValues ?? {};

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={action} className="grid gap-4 sm:grid-cols-2">
          {values.id ? <input type="hidden" name="userId" value={values.id} /> : null}

          <Field label="Nombre" htmlFor="name">
            <Input id="name" name="name" defaultValue={values.name} required />
          </Field>

          <Field label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" defaultValue={values.email} required />
          </Field>

          <Field label="Rol" htmlFor="role">
            <Select id="role" name="role" defaultValue={values.role ?? UserRole.INTERNAL}>
              <option value={UserRole.INTERNAL}>INTERNAL</option>
              <option value={UserRole.CLIENT}>CLIENT</option>
            </Select>
          </Field>

          <Field label="Estado" htmlFor="status">
            <Select id="status" name="status" defaultValue={values.status ?? UserStatus.ACTIVE}>
              <option value={UserStatus.ACTIVE}>ACTIVE</option>
              <option value={UserStatus.INACTIVE}>INACTIVE</option>
            </Select>
          </Field>

          <Field label="Cliente" htmlFor="clientId">
            <Select id="clientId" name="clientId" defaultValue={values.clientId ?? ""}>
              <option value="">Sin cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label={passwordLabel} htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              minLength={8}
              required={passwordRequired}
              placeholder={passwordHint}
            />
          </Field>

          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit">{submitLabel}</Button>
            <span className="text-sm text-muted-foreground">
              Los usuarios CLIENT requieren un cliente asociado.
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
