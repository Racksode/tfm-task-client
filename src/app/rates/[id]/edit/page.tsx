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

import { updateRate } from "../../actions";
import { DeleteRateDialog } from "../../delete-rate-dialog";
import { RateForm } from "../../rate-form";

type EditRatePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditRatePage({ params }: EditRatePageProps) {
  const session = await requireStaff();
  const role = session.user.role;
  const { id } = await params;

  if (!can(role, "update", "rates")) {
    redirect(`/rates/${id}`);
  }

  const [rate, clients, projects] = await Promise.all([
    prisma.rate.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        hourlyAmount: true,
        scope: true,
        status: true,
        clientId: true,
        projectId: true,
      },
    }),
    prisma.client.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.project.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, client: { select: { name: true } } },
    }),
  ]);

  if (!rate) {
    notFound();
  }

  const clientOptions = clients.map((client) => ({
    id: client.id,
    label: client.name,
  }));
  const projectOptions = projects.map((project) => ({
    id: project.id,
    label: `${project.name} — ${project.client.name}`,
  }));

  const defaultValues = {
    id: rate.id,
    name: rate.name,
    hourlyAmount: String(rate.hourlyAmount),
    scope: rate.scope,
    status: rate.status,
    clientId: rate.clientId,
    projectId: rate.projectId,
  };

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          title={`Tarifa: ${rate.name}`}
          actions={
            <>
              <Link href="/rates" className={actionButtonClass("back")}>
                <ArrowLeft className="size-4" />
                Volver al listado
              </Link>
              <Link
                href={`/rates/${rate.id}`}
                className={actionButtonClass("view")}
              >
                <Eye className="size-4" />
                Ver detalles
              </Link>
              {can(role, "delete", "rates") ? (
                <DeleteRateDialog rateId={rate.id} label={rate.name}>
                  <button type="button" className={actionButtonClass("delete")}>
                    <Trash2 className="size-4" />
                    Eliminar
                  </button>
                </DeleteRateDialog>
              ) : null}
            </>
          }
        />

        <RateForm
          action={updateRate}
          clients={clientOptions}
          projects={projectOptions}
          defaultValues={defaultValues}
          submitLabel="Actualizar tarifa"
          dismissMs={appConfig.alertAutoDismissMs}
        />
      </div>
    </AppShell>
  );
}
