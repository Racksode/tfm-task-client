# Histórico IA - Módulo Task (/tasks)

## Prompt enviado

> implementa

(tras aprobar el plan del módulo Task; el usuario pidió recomendación para el selector de proyecto → se aplicó "selector plano").

## Plan propuesto

Clonar el patrón consolidado para el tercer módulo de negocio, **Task** (`/tasks`): auditoría en `Task`, permisos de negocio con `can()`, selector plano de proyecto, responsable staff opcional, estado/prioridad multivalor sin toggle, detalle con sub-listado de tiempos y enlaces a proyecto/responsable. Plan en `docs/planes/25-modulo-task.md`.

## Revisión humana

Aprobado. Decisiones confirmadas: selector de proyecto **plano** (evita perder el proyecto al editar tareas de proyectos cerrados); responsable limitado a usuarios staff; estados/prioridad sin toggle rápido.

## Resultado

- **Schema + migración** (`prisma/migrations/20260621181728_add_task_audit_fields/`): `Task.createdById`/`updatedById` (FK nullable a `User`, `ON DELETE SET NULL`) y relaciones inversas `User.createdTasks`/`updatedTasks`. **Aplicada**.
- **Módulo `src/app/tasks/`**: `actions.ts` (create/update/delete con `requireStaff` + `can()`, validación de proyecto, responsable staff, fechas), `task-form.tsx` (selector de proyecto "Proyecto — Cliente", responsable, estado/prioridad, fechas, `visibleToClient`), `page.tsx`, `[id]/page.tsx` (pastillas + proyecto/responsable enlazados + sub-listado de tiempos), `new/`, `[id]/edit/`, `delete-task-dialog.tsx`, `status.ts` (etiquetas y badges ES).
- **Borrado sin cascada**: bloqueo por `_count.timeEntries`.
- **Proyecto → tareas**: el detalle de proyecto ahora enlaza las tareas a `/tasks/[id]`.
- **Infra**: acento ámbar en `section-config.ts`, entrada "Tareas" (`ListChecks`) en `Nav`.
- Versión bump a **1.4.0**.

## Incidencia

Durante la validación, `typecheck` falló por **Prisma Client desactualizado** (relaciones `createdBy/updatedBy` de `Task` como `never`). Resuelto con `npx prisma generate`. El `postinstall` añadido en 1.3.1 cubre el caso en instalaciones; tras un `migrate dev` puntual puede requerirse regenerar manualmente.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Migración aplicada.

## Commit o PR previsto

```text
feat: implementar módulo de tareas (/tasks)
```
