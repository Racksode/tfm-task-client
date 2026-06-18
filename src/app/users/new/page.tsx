import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { requireInternal } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

import { createUser } from "../actions";
import { UserForm } from "../user-form";

type NewUserPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function NewUserPage({ searchParams }: NewUserPageProps) {
  await requireInternal();

  const params = await searchParams;
  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <AppShell>
      <div className="grid gap-6 p-8">
        <PageHeader
          eyebrow="Usuarios"
          title="Nuevo usuario"
          actions={
            <Button asChild variant="outline">
              <Link href="/users">Volver al listado</Link>
            </Button>
          }
        />

        {params?.error ? (
          <Alert variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        <UserForm
          action={createUser}
          clients={clients}
          submitLabel="Crear usuario"
          passwordLabel="Contraseña inicial"
          passwordRequired
        />
      </div>
    </AppShell>
  );
}
