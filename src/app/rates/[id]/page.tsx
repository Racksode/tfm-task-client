import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { actionButtonClass } from "@/components/data/icon-action";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireStaff } from "@/lib/auth-guards";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSectionAccent } from "@/lib/section-config";
import { cn } from "@/lib/utils";

import { DeleteRateDialog } from "../delete-rate-dialog";
import {
  RATE_SCOPE_BADGE,
  RATE_SCOPE_LABELS,
  RATE_STATUS_BADGE,
  RATE_STATUS_LABELS,
  formatHourlyRate,
} from "../status";

type RateDetailPageProps = {
  params: Promise<{ id: string }>;
};

const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm">{children}</span>
    </div>
  );
}

export default async function RateDetailPage({ params }: RateDetailPageProps) {
  const session = await requireStaff();
  const role = session.user.role;
  const { id } = await params;

  if (!can(role, "view", "rates")) {
    redirect("/dashboard");
  }

  const rate = await prisma.rate.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      hourlyAmount: true,
      currency: true,
      scope: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      client: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
    },
  });

  if (!rate) {
    notFound();
  }

  const accent = cn("border-l-4", getSectionAccent("rates"));

  let target: ReactNode = "Global (todo el sistema)";
  if (rate.client) {
    target = (
      <Link
        href={`/clients/${rate.client.id}`}
        className="text-primary hover:underline"
      >
        {rate.client.name}
      </Link>
    );
  } else if (rate.project) {
    target = (
      <Link
        href={`/projects/${rate.project.id}`}
        className="text-primary hover:underline"
      >
        {rate.project.name}
      </Link>
    );
  }

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
              {can(role, "update", "rates") ? (
                <Link
                  href={`/rates/${rate.id}/edit`}
                  className={actionButtonClass("edit")}
                >
                  <Pencil className="size-4" />
                  Editar
                </Link>
              ) : null}
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

        <div className="grid gap-4 md:grid-cols-2">
          <Card className={accent}>
            <CardHeader>
              <CardTitle>Información principal</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre">{rate.name}</Field>
              <Field label="Importe">
                {formatHourlyRate(Number(rate.hourlyAmount), rate.currency)}
              </Field>
              <Field label="Ámbito">
                <Badge className={RATE_SCOPE_BADGE[rate.scope]}>
                  {RATE_SCOPE_LABELS[rate.scope]}
                </Badge>
              </Field>
              <Field label="Estado">
                <Badge className={RATE_STATUS_BADGE[rate.status]}>
                  {RATE_STATUS_LABELS[rate.status]}
                </Badge>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Destino">{target}</Field>
              </div>
            </CardContent>
          </Card>

          <Card className={accent}>
            <CardHeader>
              <CardTitle>Datos de grabación</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Creada">{formatDateTime(rate.createdAt)}</Field>
              <Field label="Actualizada">{formatDateTime(rate.updatedAt)}</Field>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
