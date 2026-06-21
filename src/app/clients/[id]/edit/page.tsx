import { ArrowLeft, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { actionButtonClass } from "@/components/data/icon-action";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { requireStaff } from "@/lib/auth-guards";
import { appConfig } from "@/lib/config";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import { updateClient } from "../../actions";
import { ClientForm } from "../../client-form";
import { DeleteClientDialog } from "../../delete-client-dialog";

type EditClientPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditClientPage({ params }: EditClientPageProps) {
  const session = await requireStaff();
  const role = session.user.role;
  const { id } = await params;

  if (!can(role, "update", "clients")) {
    redirect(`/clients/${id}`);
  }

  const client = await prisma.client.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      internalNotes: true,
      status: true,
      baseRate: true,
    },
  });

  if (!client) {
    notFound();
  }

  const defaultValues = {
    ...client,
    baseRate: client.baseRate ? client.baseRate.toString() : null,
  };

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          title={`Cliente: ${client.name}`}
          actions={
            <>
              <Link href="/clients" className={actionButtonClass("back")}>
                <ArrowLeft className="size-4" />
                Volver al listado
              </Link>
              <Link
                href={`/clients/${client.id}`}
                className={actionButtonClass("view")}
              >
                <Eye className="size-4" />
                Ver detalles
              </Link>
              {can(role, "delete", "clients") ? (
                <DeleteClientDialog clientId={client.id} clientName={client.name}>
                  <button type="button" className={actionButtonClass("delete")}>
                    <Trash2 className="size-4" />
                    Eliminar
                  </button>
                </DeleteClientDialog>
              ) : null}
            </>
          }
        />

        <ClientForm
          action={updateClient}
          defaultValues={defaultValues}
          submitLabel="Actualizar datos"
          dismissMs={appConfig.alertAutoDismissMs}
        />
      </div>
    </AppShell>
  );
}
