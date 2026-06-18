import { UserRole, UserStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth-guards";
import { canManageUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

import { DeleteUserDialog } from "../delete-user-dialog";

type UserDetailPageProps = {
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

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const session = await requireAdmin();
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      client: { select: { name: true } },
      createdBy: { select: { name: true } },
      updatedBy: { select: { name: true } },
    },
  });

  if (!user) {
    notFound();
  }

  const manageable = canManageUser(session.user.role, user.role);
  const isSelf = user.id === session.user.id;

  return (
    <AppShell>
      <div className="grid gap-4 p-8">
        <PageHeader
          eyebrow="Usuarios"
          title={user.name}
          actions={
            <>
              <Button asChild variant="outline">
                <Link href="/users">Volver al listado</Link>
              </Button>
              {manageable ? (
                <Button asChild variant="secondary">
                  <Link href={`/users/${user.id}/edit`}>Editar</Link>
                </Button>
              ) : null}
              {manageable && !isSelf ? (
                <DeleteUserDialog userId={user.id} userName={user.name}>
                  <Button variant="destructive">Eliminar</Button>
                </DeleteUserDialog>
              ) : null}
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Información principal</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre">{user.name}</Field>
              <Field label="Email">{user.email}</Field>
              <Field label="Rol">
                {user.role === UserRole.INTERNAL ? (
                  <Badge>INTERNAL</Badge>
                ) : (
                  <Badge variant="secondary">{user.role}</Badge>
                )}
              </Field>
              <Field label="Estado">
                {user.status === UserStatus.ACTIVE ? (
                  <Badge className="border-transparent bg-green-600 text-white">
                    Activo
                  </Badge>
                ) : (
                  <Badge variant="outline">Inactivo</Badge>
                )}
              </Field>
              <Field label="Cliente">{user.client?.name ?? "Sin cliente"}</Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Datos de grabación</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Creado">{formatDateTime(user.createdAt)}</Field>
              <Field label="Actualizado">{formatDateTime(user.updatedAt)}</Field>
              <Field label="Creado por">{user.createdBy?.name ?? "—"}</Field>
              <Field label="Actualizado por">{user.updatedBy?.name ?? "—"}</Field>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
