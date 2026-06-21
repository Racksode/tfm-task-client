import { ClientStatus } from "@prisma/client";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
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

import { DeleteClientDialog } from "../delete-client-dialog";

type ClientDetailPageProps = {
  params: Promise<{ id: string }>;
};

const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);

const currency = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

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

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const session = await requireStaff();
  const role = session.user.role;
  const { id } = await params;

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
      createdAt: true,
      updatedAt: true,
      createdBy: { select: { name: true } },
      updatedBy: { select: { name: true } },
      projects: { select: { id: true, name: true }, orderBy: { name: "asc" } },
      users: { select: { id: true, name: true }, orderBy: { name: "asc" } },
    },
  });

  if (!client) {
    notFound();
  }

  const accent = cn("border-l-4", getSectionAccent("clients"));

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          title={client.name}
          actions={
            <>
              <Link href="/clients" className={actionButtonClass("back")}>
                <ArrowLeft className="size-4" />
                Volver al listado
              </Link>
              {can(role, "update", "clients") ? (
                <Link
                  href={`/clients/${client.id}/edit`}
                  className={actionButtonClass("edit")}
                >
                  <Pencil className="size-4" />
                  Editar
                </Link>
              ) : null}
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

        <div className="grid gap-4 md:grid-cols-2">
          <Card className={accent}>
            <CardHeader>
              <CardTitle>Información principal</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre">{client.name}</Field>
              <Field label="Email">{client.email ?? "—"}</Field>
              <Field label="Teléfono">{client.phone ?? "—"}</Field>
              <Field label="Empresa">{client.company ?? "—"}</Field>
              <Field label="Estado">
                {client.status === ClientStatus.ACTIVE ? (
                  <Badge className="border-transparent bg-green-600 text-white">
                    Activo
                  </Badge>
                ) : (
                  <Badge variant="outline">Inactivo</Badge>
                )}
              </Field>
              <Field label="Tarifa base">
                {client.baseRate ? currency.format(Number(client.baseRate)) : "—"}
              </Field>
              <div className="sm:col-span-2">
                <Field label="Notas internas">
                  {client.internalNotes ? (
                    <span className="whitespace-pre-wrap">{client.internalNotes}</span>
                  ) : (
                    "—"
                  )}
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card className={accent}>
            <CardHeader>
              <CardTitle>Datos de grabación</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Creado">{formatDateTime(client.createdAt)}</Field>
              <Field label="Actualizado">{formatDateTime(client.updatedAt)}</Field>
              <Field label="Creado por">{client.createdBy?.name ?? "—"}</Field>
              <Field label="Actualizado por">{client.updatedBy?.name ?? "—"}</Field>
            </CardContent>
          </Card>

          <Card className={accent}>
            <CardHeader>
              <CardTitle>Proyectos</CardTitle>
            </CardHeader>
            <CardContent>
              {client.projects.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Sin proyectos vinculados.
                </p>
              ) : (
                <ul className="grid gap-1 text-sm">
                  {client.projects.map((project) => (
                    <li key={project.id}>{project.name}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className={accent}>
            <CardHeader>
              <CardTitle>Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              {client.users.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Sin usuarios vinculados.
                </p>
              ) : (
                <ul className="grid gap-1 text-sm">
                  {client.users.map((user) => (
                    <li key={user.id}>
                      <Link
                        href={`/users/${user.id}`}
                        className="text-primary hover:underline"
                      >
                        {user.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
