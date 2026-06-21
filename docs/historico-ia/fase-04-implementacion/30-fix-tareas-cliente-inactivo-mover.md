# Histórico IA - Fix: mover tareas a clientes inactivos

## Prompt enviado

> revisión de codex: "Block moving tasks to inactive clients" — al editar una tarea y cambiar su proyecto a uno de cliente inactivo, el guard se saltaba porque `updateTask` llama a `validate(..., { isCreate: false })`.

## Diagnóstico

La corrección previa (RN-05) bloqueaba la **creación** de tareas para clientes inactivos, pero la excepción de edición era demasiado amplia: permitía **mover** una tarea existente a un proyecto de cliente inactivo (trabajo nuevo para un cliente inactivo).

## Resultado

`validate` (en `src/app/tasks/actions.ts`) pasa de recibir `{ isCreate }` a `{ currentProjectId }`. El bloqueo por cliente inactivo se aplica cuando hay **nueva asociación de proyecto** (`values.projectId !== currentProjectId`):

- **Crear** (`currentProjectId: null`): siempre es nueva asociación → se bloquea si el cliente está inactivo.
- **Editar manteniendo el proyecto** (`projectId` igual): excepción → permitido aunque el cliente esté inactivo.
- **Editar cambiando a otro proyecto** de cliente inactivo: nueva asociación → **bloqueado**.

`updateTask` ahora carga la tarea actual (`projectId`) **antes** de validar para conocer el proyecto previo. Mensaje unificado: "No se pueden asignar tareas a un cliente inactivo."

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Versión bump a **1.4.2**.

## Commit o PR previsto

```text
fix: bloquear mover tareas a un proyecto de cliente inactivo
```
