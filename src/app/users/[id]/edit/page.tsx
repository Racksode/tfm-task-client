import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth-guards";
import { canManageUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import { updateUser } from "../../actions";
import { DeleteUserDialog } from "../../delete-user-dialog";
import { UserForm } from "../../user-form";

type EditUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: EditUserPageProps) {
  const session = await requireAdmin();
  const { id } = await params;

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

  const canDelete =
    canManageUser(session.user.role, user.role) &&
    user.id !== session.user.id;

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          eyebrow="Usuarios"
          title={`Editar: ${user.name}`}
          actions={
            <>
              <Button asChild variant="outline">
                <Link href="/users">Volver al listado</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href={`/users/${user.id}`}>Ver detalles</Link>
              </Button>
              {canDelete ? (
                <DeleteUserDialog userId={user.id} userName={user.name}>
                  <Button variant="destructive">Eliminar</Button>
                </DeleteUserDialog>
              ) : null}
            </>
          }
        />

        <UserForm
          action={updateUser}
          clients={clients}
          defaultValues={user}
          submitLabel="Actualizar datos"
          passwordLabel="Nueva contraseña"
          passwordRequired={false}
          passwordHint="Dejar en blanco para no cambiar"
        />
      </div>
    </AppShell>
  );
}
