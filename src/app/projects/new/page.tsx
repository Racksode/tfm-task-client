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

import { createProject } from "../actions";
import { ProjectForm } from "../project-form";

export default async function NewProjectPage() {
  const session = await requireStaff();

  if (!can(session.user.role, "create", "projects")) {
    redirect("/projects");
  }

  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <AppShell>
      <div className="grid gap-6 p-8">
        <PageHeader
          title="Nuevo proyecto"
          actions={
            <Link href="/projects" className={actionButtonClass("back")}>
              <ArrowLeft className="size-4" />
              Volver al listado
            </Link>
          }
        />

        <ProjectForm
          action={createProject}
          clients={clients}
          submitLabel="Grabar datos"
          dismissMs={appConfig.alertAutoDismissMs}
        />
      </div>
    </AppShell>
  );
}
