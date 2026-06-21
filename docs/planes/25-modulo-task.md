# Plan 25 - Implementación: módulo Task

## Objetivo

Tercer módulo de negocio, **Task** (`/tasks`), clonando el patrón consolidado (`users` + `clients` + `projects`).

## Contexto

`projects` dejó fijado el patrón con relación a otra entidad (selector), estado multivalor y fechas. `Task` ya existía en Prisma (pertenece a `Project`, con responsable opcional) pero **sin** auditoría.

## Decisiones

- **Permisos** con `can(role, action, "tasks")`: `INTERNAL+` ve/crea/edita; **solo `ADMIN+` elimina**.
- **Auditoría**: `createdById`/`updatedById` en `Task` (migración `add_task_audit_fields`) + relaciones inversas en `User`.
- **Relación con Project**: `projectId` obligatorio → **selector plano** "Proyecto — Cliente" (recomendado: evita que el proyecto desaparezca al editar tareas de proyectos cerrados).
- **Responsable**: `responsibleId` opcional → selector de usuarios **staff** (un CLIENT no es responsable de tareas), con "Sin asignar".
- **Estado y prioridad multivalor** (`TaskStatus` 5 valores, `TaskPriority` 3): se cambian desde el formulario; sin toggle rápido en el listado.
- **Borrado sin cascada**: bloqueado si hay `timeEntries` vinculados.
- **Detalle con sub-listado 1→N**: registros de tiempo (informativo, aún sin `/times`); proyecto y responsable enlazados.

## Alcance

- Rutas `/tasks`, `/tasks/new`, `/tasks/[id]`, `/tasks/[id]/edit`.
- Campos: `title`, `projectId`, `responsibleId`, `description`, `status`, `priority`, `visibleToClient`, `functionalStart`, `functionalEnd`.
- Infra: acento ámbar, entrada "Tareas" en el menú. En el detalle del proyecto, las tareas pasan a enlazables. Versión **1.4.0**.

## Fuera de alcance

- Registro de tiempos (`/times`): las entradas del detalle son informativas.
- Sin filtros/búsqueda/paginación.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Migración aplicada con `prisma migrate dev`.

## Commit previsto

```text
feat: implementar módulo de tareas (/tasks)
```
