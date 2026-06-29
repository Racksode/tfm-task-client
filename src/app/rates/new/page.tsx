import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { actionButtonClass } from "@/components/data/icon-action";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { requireStaff } from "@/lib/auth-guards";
import { appConfig } from "@/lib/config";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import { createRate } from "../actions";
import { RateForm } from "../rate-form";

export default async function NewRatePage() {
  const session = await requireStaff();

  if (!can(session.user.role, "create", "rates")) {
    redirect("/dashboard");
  }

  const [clients, projects] = await Promise.all([
    prisma.client.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.project.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, client: { select: { name: true } } },
    }),
  ]);

  const clientOptions = clients.map((client) => ({
    id: client.id,
    label: client.name,
  }));
  const projectOptions = projects.map((project) => ({
    id: project.id,
    label: `${project.name} — ${project.client.name}`,
  }));

  return (
    <AppShell>
      <div className="grid gap-6 p-8">
        <PageHeader
          title="Nueva tarifa"
          actions={
            <Link href="/rates" className={actionButtonClass("back")}>
              <ArrowLeft className="size-4" />
              Volver al listado
            </Link>
          }
        />

        <RateForm
          action={createRate}
          clients={clientOptions}
          projects={projectOptions}
          submitLabel="Crear tarifa"
          dismissMs={appConfig.alertAutoDismissMs}
        />
      </div>
    </AppShell>
  );
}
