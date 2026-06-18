import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { requireInternal } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

import { updateUser } from "../../actions";
import { UserForm } from "../../user-form";

type EditUserPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export default async function EditUserPage({ params, searchParams }: EditUserPageProps) {
  await requireInternal();

  const { id } = await params;
  const sp = await searchParams;

  const [user, clients] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        clientId: true,
      },
    }),
    prisma.client.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <AppShell>
      <div className="grid gap-6 p-8">
        <PageHeader
          eyebrow="Usuarios"
          title={`Editar: ${user.name}`}
          actions={
            <Button asChild variant="outline">
              <Link href="/users">Volver al listado</Link>
            </Button>
          }
        />

        {sp?.error ? (
          <Alert variant="destructive">
            <AlertDescription>{sp.error}</AlertDescription>
          </Alert>
        ) : null}

        <UserForm
          action={updateUser}
          clients={clients}
          defaultValues={user}
          submitLabel="Guardar cambios"
          passwordLabel="Nueva contraseña"
          passwordRequired={false}
          passwordHint="Dejar en blanco para no cambiar"
        />
      </div>
    </AppShell>
  );
}
