import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

import { createUser } from "../actions";
import { UserForm } from "../user-form";

export default async function NewUserPage() {
  await requireAdmin();

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

        <UserForm
          action={createUser}
          clients={clients}
          submitLabel="Grabar datos"
          passwordLabel="Contraseña inicial"
          passwordRequired
        />
      </div>
    </AppShell>
  );
}
