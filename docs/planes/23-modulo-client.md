# Plan 23 - Implementación: módulo Client

## Objetivo

Implementar el primer módulo de negocio, **Client** (`/clients`), clonando el patrón CRUD pulido de `users` (listado / detalle con pastillas / alta / edición / borrado sin cascada / mensajes / auditoría), según el roadmap `docs/planes/22-roadmap-estructura-ui-permisos.md` y el "próximo paso" de `docs/estado-proyecto.md`.

## Contexto

El patrón de `users` quedó listo para clonar (v1.1.2). El modelo `Client` ya existía en Prisma pero **sin** campos de auditoría. A diferencia de `users` (sección `ADMIN+`), `clients` es una **sección de negocio**: `INTERNAL` también opera.

## Decisiones

- **Permisos vía `can(role, action, "clients")`** (ya existente): `INTERNAL+` puede ver/crear/editar/activar-desactivar; **solo `ADMIN+` elimina**. Modelo "Opera / Gestiona / Manda".
- **Auditoría**: se añaden `createdById`/`updatedById` (FK nullable a `User`, `ON DELETE SET NULL`) al modelo `Client`, con relaciones inversas en `User`. Migración `add_client_audit_fields`.
- **Detalle con sub-listados 1→N**: pastillas "Información principal" y "Datos de grabación" + tarjetas de **Proyectos** (informativo, sin módulo `/projects` aún) y **Usuarios** vinculados (enlazan a `/users/[id]`).
- **Borrado sin cascada**: bloqueado si el cliente tiene `users`, `projects`, `rates` o `reports` vinculados (se desactiva en su lugar).

## Alcance

- Rutas: `/clients`, `/clients/new`, `/clients/[id]`, `/clients/[id]/edit`.
- Reutiliza `AppShell`, `PageHeader`, `ClickableRow`, `icon-action`, `AlertBanner`, flash, `auth-guards`, `section-config`.
- Entrada en el menú (`Nav`) y acento de sección azul.
- Bump de versión a **1.2.0** (feat).

## Fuera de alcance

- Módulo `/projects` (los proyectos del detalle son informativos).
- Gestión de tarifas (`Rate`) y reportes; sin filtros/búsqueda/paginación (DataTable v1).

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Migración `prisma migrate dev` y prueba manual con Postgres (Docker) + usuario bootstrap.

## Commit previsto

```text
feat: implementar módulo de clientes (/clients)
```
