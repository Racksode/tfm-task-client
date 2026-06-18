import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { actionButtonClass } from "@/components/data/icon-action";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { requireAdmin } from "@/lib/auth-guards";
import { appConfig } from "@/lib/config";
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
          title="Nuevo usuario"
          actions={
            <Link href="/users" className={actionButtonClass("back")}>
              <ArrowLeft className="size-4" />
              Volver al listado
            </Link>
          }
        />

        <UserForm
          action={createUser}
          clients={clients}
          submitLabel="Grabar datos"
          passwordLabel="Contraseña inicial"
          passwordRequired
          dismissMs={appConfig.alertAutoDismissMs}
        />
      </div>
    </AppShell>
  );
}
