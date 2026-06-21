# Módulo Client y patrón de permisos de sección de negocio

## Qué se ha hecho

Primer módulo de negocio, **Client** (`/clients`), clonando el patrón CRUD de `users`. Es la primera sección que aplica el modelo de permisos de **negocio** (no solo `ADMIN+`), por lo que sirve de plantilla para los siguientes módulos (`Project`, `Task`…).

## Por qué

`users` se protegía con `requireAdmin`/`canManageUser` (gestión exclusiva de administradores). Las secciones de negocio deben permitir que `INTERNAL` **opere** (ver/crear/editar) reservando el borrado a `ADMIN+`. En lugar de un helper específico por entidad, se usa el helper genérico `can(role, action, section)` ya existente.

## Archivos y conceptos

- **Guarda de ruta**: `requireStaff()` (`src/lib/auth-guards.ts`) en todas las páginas y server actions de `/clients` (deja entrar a `INTERNAL/ADMIN/SUPERADMIN`).
- **Permiso por acción**: `can(role, "create"|"update"|"delete", "clients")` (`src/lib/permissions.ts`) decide qué botones se muestran y vuelve a comprobarse dentro de cada server action (defensa en profundidad). `INTERNAL` obtiene `view/create/update` en secciones de negocio; `delete` solo `ADMIN+`.
- **Auditoría**: `Client.createdById`/`updatedById` (FK nullable a `User`, `ON DELETE SET NULL`) + relaciones inversas en `User`. Se captura el actor de la sesión al crear/actualizar y se muestra en "Datos de grabación".
- **Borrado sin cascada**: se bloquea si el cliente tiene `users`, `projects`, `rates` o `reports` vinculados (mensaje sugiriendo desactivar).
- **Detalle con sub-listados 1→N**: tarjetas de Proyectos y Usuarios vinculados al cliente.
- **Migración**: `prisma/migrations/20260621120000_add_client_audit_fields/`.

## Implicaciones

- Queda fijado el patrón de permisos para módulos de negocio: `requireStaff` + `can()` por acción. Replicarlo en los siguientes módulos.
- El acento de sección (`src/lib/section-config.ts`) y la entrada de menú (`Nav`) se añaden por módulo.

## Qué queda sin implementar

- Módulo `/projects`: en el detalle del cliente los proyectos se listan de forma **informativa** (sin enlace), porque aún no existe esa ruta.
- Sin filtros, búsqueda ni paginación en el listado (DataTable v1).
- La migración debe aplicarse con `npm run prisma:migrate:dev` con Postgres (Docker) levantado.
