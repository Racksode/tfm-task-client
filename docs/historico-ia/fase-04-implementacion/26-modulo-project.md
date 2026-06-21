# Histórico IA - Módulo Project (/projects)

## Prompt enviado

> ok, perfecto, adelante

(tras aprobar el plan del módulo Project propuesto en el chat).

## Plan propuesto

Clonar el patrón consolidado (`users` + `clients`) para el segundo módulo de negocio, **Project** (`/projects`): auditoría en `Project`, permisos de negocio con `can()`, selector de cliente obligatorio, estado de 4 valores sin toggle rápido, detalle con sub-listado de tareas y enlace al cliente. Plan en `docs/planes/24-modulo-project.md`.

## Revisión humana

Aprobado en el chat. Decisiones confirmadas: estado sin toggle rápido (4 valores) y selector de cliente obligatorio.

## Resultado

- **Schema + migración** (`prisma/migrations/20260621175044_add_project_audit_fields/`): `Project.createdById`/`updatedById` (FK nullable a `User`, `ON DELETE SET NULL`) y relaciones inversas `User.createdProjects`/`updatedProjects`. **Aplicada** (Docker/Postgres arriba).
- **Módulo `src/app/projects/`**: `actions.ts` (create/update/delete con `requireStaff` + `can()`, validación de cliente, fechas y tarifa), `project-form.tsx` (selector de cliente, estado de 4 valores, fechas, `visibleToClient`, tarifa), `page.tsx` (listado sin toggle de estado), `[id]/page.tsx` (pastillas + cliente enlazado + sub-listado de tareas), `new/`, `[id]/edit/`, `delete-project-dialog.tsx`, `status.ts` (etiquetas en español).
- **Borrado sin cascada**: bloqueo por `_count` de `tasks`/`rates`/`reports`.
- **Cliente → proyectos**: el detalle de cliente ahora enlaza los proyectos a `/projects/[id]`.
- **Infra**: acento violeta en `section-config.ts`, entrada "Proyectos" (`FolderKanban`) en `Nav`.
- Versión bump a **1.3.0**.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Migración aplicada.

## Commit o PR previsto

```text
feat: implementar módulo de proyectos (/projects)
```
