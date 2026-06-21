import { ArrowLeft, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { actionButtonClass } from "@/components/data/icon-action";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { requireAdmin } from "@/lib/auth-guards";
import { appConfig } from "@/lib/config";
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

  if (!canManageUser(session.user.role, user.role)) {
    redirect(`/users/${user.id}`);
  }

  const canDelete = user.id !== session.user.id;

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          title={`Usuario: ${user.name}`}
          actions={
            <>
              <Link href="/users" className={actionButtonClass("back")}>
                <ArrowLeft className="size-4" />
                Volver al listado
              </Link>
              <Link
                href={`/users/${user.id}`}
                className={actionButtonClass("view")}
              >
                <Eye className="size-4" />
                Ver detalles
              </Link>
              {canDelete ? (
                <DeleteUserDialog userId={user.id} userName={user.name}>
                  <button type="button" className={actionButtonClass("delete")}>
                    <Trash2 className="size-4" />
                    Eliminar
                  </button>
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
          dismissMs={appConfig.alertAutoDismissMs}
        />
      </div>
    </AppShell>
  );
}
