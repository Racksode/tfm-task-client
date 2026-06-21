# Histórico IA - Fix: revisiones de código (Codex)

## Prompt enviado

> te paso varias revisiones de codex (PR 79–82) [...] añade esta nueva revisión al paquete (tasks: clientes inactivos).

## Contexto

Cinco revisiones sobre código ya mergeado en `main` (clients, projects, fix títulos/flash, postinstall, tasks). Se aplican todas en un PR de corrección sobre `main` (v1.4.0 → **1.4.1**). Las correcciones se rehicieron tras detectar que el módulo Task ya estaba en `origin/main` (el `main` local estaba desactualizado), de modo que los arreglos transversales (flash, guard de borrado) cubren también `tasks`.

## Resultado

### PR 82 (P1) — `postinstall` rompía `npm install` sin `DATABASE_URL`

`prisma.config.ts` usaba `env("DATABASE_URL")`, que falla al cargar si la variable no existe (instalación limpia: `npm install` antes de crear el `.env`). Reproducido: `PrismaConfigEnvError`. Solución: `process.env.DATABASE_URL` con fallback de formato válido; `prisma generate` (no conecta) funciona, y migrate/studio/runtime usan el `DATABASE_URL` real. Verificado moviendo el `.env`.

### PR 79 (P2) — `deleteUser` no contaba las relaciones de auditoría

Las FK de auditoría usan `ON DELETE SET NULL`, así que borrar un usuario que creó/actualizó clientes, proyectos o tareas perdía la traza en vez de bloquearse. El guard de `deleteUser` ahora suma `createdClients/updatedClients/createdProjects/updatedProjects/createdTasks/updatedTasks`.

### PR 81 (P2) — reasignación de cliente en `updateProject`

Cambiar el `clientId` de un proyecto con reportes o tarifas vinculados dejaba esas filas incoherentes. `updateProject` bloquea el cambio de cliente si el proyecto tiene `reports` o `rates`.

### PR 80 (P2) — el flash no era de lectura única

Borrar la cookie solo al cerrar (y nunca en errores) la dejaba viva (maxAge) y el error reaparecía en otro listado. Solución: el `AlertBanner` borra la cookie **al mostrarse** vía route handler `DELETE /api/flash` (fetch, no server action → sin refresh). Se elimina `src/lib/flash-actions.ts`. Aplicado a los 4 listados (`clients/projects/users/tasks`). Se mantiene: errores sin auto-cierre y sin cierre prematuro.

### Nueva revisión (P2) — crear tareas para clientes inactivos

RN-05 (`docs/10-casos-de-uso.md`): los clientes inactivos no deben usarse para trabajo nuevo. `validate` de `tasks/actions.ts` solo comprobaba que el proyecto existiera. Solución: en **creación** se valida `project.client.status`; si es `INACTIVE`, se rechaza. En **edición** se mantiene la excepción (se pueden seguir gestionando tareas existentes). Implementado con un flag `isCreate` en `validate`.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde (`/api/flash` y `/tasks` en el build). Versión bump a **1.4.1**.

## Commit o PR previsto

```text
fix: aplicar revisiones de código (flash, guards de borrado, postinstall, cliente inactivo)
```
