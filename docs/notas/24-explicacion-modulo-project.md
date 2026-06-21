# Módulo Project: relaciones, estado multivalor y fechas

## Qué se ha hecho

Segundo módulo de negocio, **Project** (`/projects`), clonando el patrón de `clients`. Aporta tres elementos nuevos respecto a `clients`/`users` que conviene tener presentes al clonar los siguientes módulos (`Task`…).

## Novedades respecto al patrón previo

1. **Relación obligatoria con otra entidad** (`Project.clientId`): el formulario incluye un **selector de cliente** (las páginas `new`/`edit` cargan `prisma.client.findMany`) y la server action valida que el cliente exista. En el detalle, el cliente se muestra como **enlace** a `/clients/[id]`; y en el detalle del cliente, los proyectos pasan de informativos a enlazables.
2. **Estado con varios valores** (`ProjectStatus`: `ACTIVE/PAUSED/COMPLETED/CANCELLED`): a diferencia del binario de `clients`/`users`, **no hay toggle rápido** en el listado; el estado se cambia desde el formulario. Las etiquetas en español están centralizadas en `src/app/projects/status.ts` y los colores de badge se definen en listado y detalle.
3. **Fechas opcionales** (`startDate`, `expectedEndDate`): inputs `type="date"`; en `edit` se formatean a `YYYY-MM-DD` (`toISOString().slice(0,10)`) y en la action se parsean a `Date`, validando que el fin no sea anterior al inicio.

## Archivos y conceptos

- Auditoría: `Project.createdById/updatedById` + relaciones inversas en `User` (migración `add_project_audit_fields`).
- Permisos: `requireStaff()` + `can(role, action, "projects")` (igual que `clients`).
- Borrado sin cascada: bloqueo por `tasks`/`rates`/`reports` vinculados (mensaje sugiriendo cambiar de estado).
- Infra: acento violeta (`section-config.ts`), entrada "Proyectos" en `Nav`.

## Qué queda sin implementar

- Módulo `/tasks`: en el detalle del proyecto las tareas se listan de forma **informativa** (sin enlace).
- Sin filtros, búsqueda ni paginación en el listado.
