# Plan 24 - Implementación: módulo Project

## Objetivo

Segundo módulo de negocio, **Project** (`/projects`), clonando el patrón consolidado (`users` + `clients`).

## Contexto

`clients` dejó fijado el patrón de sección de negocio (`requireStaff` + `can()`). `Project` ya existía en Prisma (pertenece a `Client`) pero **sin** auditoría.

## Decisiones

- **Permisos** con `can(role, action, "projects")`: `INTERNAL+` ve/crea/edita; **solo `ADMIN+` elimina**.
- **Auditoría**: `createdById`/`updatedById` en `Project` (migración `add_project_audit_fields`) con relaciones inversas en `User`.
- **Estado de 4 valores** (`ACTIVE/PAUSED/COMPLETED/CANCELLED`): se cambia desde el formulario; **sin toggle rápido** en el listado (no es binario como en `clients`).
- **Relación con Client**: `clientId` obligatorio → **selector de cliente** en el formulario. En el detalle del cliente, los proyectos pasan de informativos a **enlazables**.
- **Borrado sin cascada**: bloqueado si hay `tasks`/`rates`/`reports` vinculados.
- **Detalle con sub-listado 1→N**: tareas (informativo, aún sin `/tasks`); el cliente se muestra como enlace.

## Alcance

- Rutas `/projects`, `/projects/new`, `/projects/[id]`, `/projects/[id]/edit`.
- Campos: `name`, `clientId`, `description`, `status`, `visibleToClient`, `startDate`, `expectedEndDate`, `baseRate`.
- Infra: acento de sección (violeta), entrada "Proyectos" en el menú. Versión **1.3.0**.

## Fuera de alcance

- Módulo `/tasks` (las tareas del detalle son informativas).
- Gestión de tarifas (`Rate`) y reportes; sin filtros/búsqueda/paginación.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Migración aplicada con `prisma migrate dev` y prueba manual con Postgres + usuario bootstrap.

## Commit previsto

```text
feat: implementar módulo de proyectos (/projects)
```
