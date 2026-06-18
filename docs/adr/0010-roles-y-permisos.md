# ADR 0010 - Roles y permisos del MVP

## Estado

Aceptada.

## Contexto

El MVP necesita distinguir niveles de personal interno (quien opera el negocio frente a quien administra usuarios y configuracion), ademas del cliente. Hasta ahora `UserRole` solo tenia `INTERNAL` y `CLIENT`, lo que no permite separar la gestion de usuarios ni la configuracion.

El usuario pidio definir los tipos administrador y super-administrador como base previa a la reforma de UI (ver `docs/planes/22-roadmap-estructura-ui-permisos.md`).

## Decision

Se amplia `UserRole` a la jerarquia `SUPERADMIN > ADMIN > INTERNAL > CLIENT` (enum Prisma + migracion).

Modelo de permisos "Opera / Gestiona / Manda":

- `INTERNAL`: CRUD de negocio (clientes, proyectos, tareas, tiempos, reportes), sin borrar ni acceder a usuarios o configuracion.
- `ADMIN`: ademas, gestion de usuarios, borrado y configuracion.
- `SUPERADMIN`: ademas, gestionar usuarios `ADMIN` y ajustes criticos.
- `CLIENT`: solo area de cliente.

Implementacion:

- `src/lib/permissions.ts`: `can(role, action, section)` para permisos por seccion y `canManageUser(actorRole, targetRole)` para la regla de que un `ADMIN` no gestiona a otros `ADMIN`/`SUPERADMIN`.
- `src/lib/auth-guards.ts`: `requireStaff` (INTERNAL/ADMIN/SUPERADMIN) y `requireAdmin` (ADMIN/SUPERADMIN), que sustituyen a `requireInternal`.
- La seccion de usuarios (`/users`) pasa a requerir `ADMIN+`; el dashboard requiere `requireStaff`; el menu oculta las secciones sin permiso.
- El bootstrap del primer usuario crea un `SUPERADMIN`.

## Alternativas valoradas

- **Mantener solo INTERNAL/CLIENT**: insuficiente para separar gestion de usuarios y configuracion. Descartada.
- **RBAC completo con tablas de roles y permisos**: flexible pero sobredimensiona el MVP y anade complejidad de mantenimiento. Descartada para el TFM; el modelo por jerarquia de rol es suficiente y defendible.

## Consecuencias

- Migracion de enum aplicada (`add_admin_roles`). Los usuarios existentes con rol `INTERNAL` dejan de acceder a `/users`; para administrar usuarios hay que promover una cuenta a `ADMIN`/`SUPERADMIN`.
- Los permisos por seccion se cablean con `can()`; el cableado fino por accion en la UI (mostrar/ocultar botones ver/editar/eliminar) se realiza en el PR de patrones de listado/detalle/edicion.
- `canManageUser` reserva la gestion de `ADMIN`/`SUPERADMIN` al `SUPERADMIN`.
- Quedan fuera: permisos granulares por recurso, equipos y multi-tenant.
