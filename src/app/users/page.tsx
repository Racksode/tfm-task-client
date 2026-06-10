import { UserRole, UserStatus } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { DataTable, type DataTableColumn } from "@/components/data/data-table";
import { TableActions } from "@/components/data/table-actions";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { prisma } from "@/lib/prisma";

import { createUser, updateUser } from "./actions";

type UsersPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);

const getRoleBadgeTone = (role: UserRole): "success" | "neutral" =>
  role === UserRole.INTERNAL ? "success" : "neutral";

const getStatusBadgeTone = (status: UserStatus): "success" | "warning" =>
  status === UserStatus.ACTIVE ? "success" : "warning";

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/users");
  }

  if (session.user.role !== UserRole.INTERNAL) {
    notFound();
  }

  const params = await searchParams;

  const [users, clients] = await Promise.all([
    prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        clientId: true,
        createdAt: true,
        updatedAt: true,
        client: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.client.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  type UserRow = (typeof users)[number];

  const userColumns: DataTableColumn<UserRow>[] = [
    {
      key: "name",
      header: "Nombre",
      render: (user) => user.name,
    },
    {
      key: "email",
      header: "Email",
      render: (user) => user.email,
    },
    {
      key: "role",
      header: "Rol",
      render: (user) => (
        <Badge tone={getRoleBadgeTone(user.role)}>{user.role}</Badge>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (user) => (
        <Badge tone={getStatusBadgeTone(user.status)}>{user.status}</Badge>
      ),
    },
    {
      key: "client",
      header: "Cliente",
      render: (user) => user.client?.name ?? "Sin cliente",
    },
    {
      key: "createdAt",
      header: "Creado",
      render: (user) => formatDate(user.createdAt),
    },
  ];

  return (
    <AppShell>
      <div className="users-page">
        <PageHeader
          description={
            <>
              Esta vista está protegida por sesión y reservada a usuarios
              INTERNAL para administrar usuarios básicos del MVP.
            </>
          }
          eyebrow="Usuarios"
          title="Gestión mínima de usuarios"
        />

        {params?.error ? <Alert tone="error">{params.error}</Alert> : null}
        {params?.success ? <Alert tone="success">{params.success}</Alert> : null}

        <section className="content-panel" aria-labelledby="create-user-title">
          <h2 id="create-user-title">Crear usuario</h2>
          {clients.length === 0 ? (
            <p className="helper-text">
              No hay clientes disponibles. La creación de usuarios CLIENT
              quedará bloqueada por validación hasta que exista al menos un
              cliente.
            </p>
          ) : null}
          <form action={createUser} className="form-grid">
            <label>
              Nombre
              <Input name="name" required />
            </label>
            <label>
              Email
              <Input name="email" type="email" required />
            </label>
            <label>
              Rol
              <Select name="role" defaultValue={UserRole.INTERNAL}>
                <option value={UserRole.INTERNAL}>INTERNAL</option>
                <option value={UserRole.CLIENT}>CLIENT</option>
              </Select>
            </label>
            <label>
              Estado
              <Select name="status" defaultValue={UserStatus.ACTIVE}>
                <option value={UserStatus.ACTIVE}>ACTIVE</option>
                <option value={UserStatus.INACTIVE}>INACTIVE</option>
              </Select>
            </label>
            <label>
              Cliente
              <Select name="clientId" defaultValue="">
                <option value="">Sin cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>
            </label>
            <label>
              Contraseña inicial
              <Input name="password" type="password" minLength={8} required />
            </label>
            <Button type="submit">Crear usuario</Button>
          </form>
        </section>

        <section className="content-panel" aria-labelledby="users-list-title">
          <h2 id="users-list-title">Usuarios existentes</h2>
          <DataTable
            actions={(user) => (
              <TableActions>
                <a className="table-action-link" href={`#edit-user-${user.id}`}>
                  Editar
                </a>
              </TableActions>
            )}
            columns={userColumns}
            emptyDescription="Crea el primer usuario para empezar a administrar el MVP."
            emptyTitle="No hay usuarios registrados"
            getRowKey={(user) => user.id}
            rows={users}
          />
        </section>

        <section className="content-panel" aria-labelledby="edit-users-title">
          <h2 id="edit-users-title">Editar usuarios</h2>
          <div className="user-edit-list">
            {users.map((user) => (
              <form
                key={user.id}
                action={updateUser}
                className="form-grid edit-form"
                id={`edit-user-${user.id}`}
              >
                <input name="userId" type="hidden" value={user.id} />
                <label>
                  Nombre
                  <Input name="name" defaultValue={user.name} required />
                </label>
                <label>
                  Email
                  <Input
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    required
                  />
                </label>
                <label>
                  Rol
                  <Select name="role" defaultValue={user.role}>
                    <option value={UserRole.INTERNAL}>INTERNAL</option>
                    <option value={UserRole.CLIENT}>CLIENT</option>
                  </Select>
                </label>
                <label>
                  Estado
                  <Select name="status" defaultValue={user.status}>
                    <option value={UserStatus.ACTIVE}>ACTIVE</option>
                    <option value={UserStatus.INACTIVE}>INACTIVE</option>
                  </Select>
                </label>
                <label>
                  Cliente
                  <Select name="clientId" defaultValue={user.clientId ?? ""}>
                    <option value="">Sin cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </Select>
                </label>
                <label>
                  Nueva contraseña
                  <Input
                    name="password"
                    type="password"
                    minLength={8}
                    placeholder="Dejar en blanco para no cambiar"
                  />
                </label>
                <p className="helper-text">
                  Última actualización: {formatDate(user.updatedAt)}
                </p>
                <Button type="submit">Guardar cambios</Button>
              </form>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
