import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { actionButtonClass } from "@/components/data/icon-action";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { requireStaff } from "@/lib/auth-guards";
import { appConfig } from "@/lib/config";
import { can } from "@/lib/permissions";

import { createClient } from "../actions";
import { ClientForm } from "../client-form";

export default async function NewClientPage() {
  const session = await requireStaff();

  if (!can(session.user.role, "create", "clients")) {
    redirect("/clients");
  }

  return (
    <AppShell>
      <div className="grid gap-6 p-8">
        <PageHeader
          title="Nuevo cliente"
          actions={
            <Link href="/clients" className={actionButtonClass("back")}>
              <ArrowLeft className="size-4" />
              Volver al listado
            </Link>
          }
        />

        <ClientForm
          action={createClient}
          submitLabel="Grabar datos"
          dismissMs={appConfig.alertAutoDismissMs}
        />
      </div>
    </AppShell>
  );
}
