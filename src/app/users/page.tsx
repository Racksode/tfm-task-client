import { UserRole, UserStatus } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
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

  return (
    <main className="users-page">
      <header className="page-header">
        <p className="eyebrow">Usuarios</p>
        <h1>Gestión mínima de usuarios</h1>
        <p>
          Esta vista está protegida por sesión y reservada a usuarios INTERNAL
          para administrar usuarios básicos del MVP.
        </p>
      </header>

      {params?.error ? <p className="notice notice-error">{params.error}</p> : null}
      {params?.success ? (
        <p className="notice notice-success">{params.success}</p>
      ) : null}

      <section className="content-panel" aria-labelledby="create-user-title">
        <h2 id="create-user-title">Crear usuario</h2>
        {clients.length === 0 ? (
          <p className="helper-text">
            No hay clientes disponibles. La creación de usuarios CLIENT quedará
            bloqueada por validación hasta que exista al menos un cliente.
          </p>
        ) : null}
        <form action={createUser} className="form-grid">
          <label>
            Nombre
            <input name="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Rol
            <select name="role" defaultValue={UserRole.INTERNAL}>
              <option value={UserRole.INTERNAL}>INTERNAL</option>
              <option value={UserRole.CLIENT}>CLIENT</option>
            </select>
          </label>
          <label>
            Estado
            <select name="status" defaultValue={UserStatus.ACTIVE}>
              <option value={UserStatus.ACTIVE}>ACTIVE</option>
              <option value={UserStatus.INACTIVE}>INACTIVE</option>
            </select>
          </label>
          <label>
            Cliente
            <select name="clientId" defaultValue="">
              <option value="">Sin cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Contraseña inicial
            <input name="password" type="password" minLength={8} required />
          </label>
          <button type="submit">Crear usuario</button>
        </form>
      </section>

      <section className="content-panel" aria-labelledby="users-list-title">
        <h2 id="users-list-title">Usuarios existentes</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Cliente</th>
                <th>Creado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>{user.client?.name ?? "Sin cliente"}</td>
                  <td>{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-panel" aria-labelledby="edit-users-title">
        <h2 id="edit-users-title">Editar usuarios</h2>
        <div className="user-edit-list">
          {users.map((user) => (
            <form key={user.id} action={updateUser} className="form-grid edit-form">
              <input name="userId" type="hidden" value={user.id} />
              <label>
                Nombre
                <input name="name" defaultValue={user.name} required />
              </label>
              <label>
                Email
                <input name="email" type="email" defaultValue={user.email} required />
              </label>
              <label>
                Rol
                <select name="role" defaultValue={user.role}>
                  <option value={UserRole.INTERNAL}>INTERNAL</option>
                  <option value={UserRole.CLIENT}>CLIENT</option>
                </select>
              </label>
              <label>
                Estado
                <select name="status" defaultValue={user.status}>
                  <option value={UserStatus.ACTIVE}>ACTIVE</option>
                  <option value={UserStatus.INACTIVE}>INACTIVE</option>
                </select>
              </label>
              <label>
                Cliente
                <select name="clientId" defaultValue={user.clientId ?? ""}>
                  <option value="">Sin cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Nueva contraseña
                <input
                  name="password"
                  type="password"
                  minLength={8}
                  placeholder="Dejar en blanco para no cambiar"
                />
              </label>
              <p className="helper-text">
                Última actualización: {formatDate(user.updatedAt)}
              </p>
              <button type="submit">Guardar cambios</button>
            </form>
          ))}
        </div>
      </section>
    </main>
  );
}
