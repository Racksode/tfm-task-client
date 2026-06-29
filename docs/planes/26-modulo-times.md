# Plan 26 - Implementación: módulo Tiempos (/times)

## Objetivo

Núcleo funcional del MVP: registrar tiempo de trabajo sobre **tareas** (`TimeEntry`). Cierra la cadena cliente→proyecto→tarea→**tiempo**. Este plan cubre el registro **manual**; el cronómetro start/stop va en el plan 27.

## Contexto

`TimeEntry` ya existía en Prisma (`taskId`, `userId`, `type` `MANUAL`/`START_STOP`, `workDate`, `startedAt?`/`endedAt?`, `durationMinutes`, `description?`, tarifa/coste estimado nullables). No requiere migración. A diferencia de los CRUD anteriores, introduce lógica propia (cálculo de duración).

## Decisiones

- **Registro MANUAL primero**; cronómetro start/stop = plan aparte; cálculo de coste = aplazado (campos null).
- **Dos formas de indicar el tiempo**: "por duración" (horas/minutos) o "por inicio y fin"; el servidor calcula `durationMinutes` y valida que fin > inicio.
- **Campos de hora numéricos HH/MM** en lugar de `<input type="time">` nativo: el input nativo devolvía `value=""` según el locale del navegador (formato 12h con segmento AM/PM sin fijar), provocando el error "Indica la hora de inicio y de fin". Confirmado instrumentando la server action (el `FormData` llegaba con la hora vacía).
- **Permisos** de negocio (`can(role, action, "times")`): un `INTERNAL` ve/crea/edita **solo sus registros**; `ADMIN+` ve/edita todos y borra. El autor (`userId`) es siempre la sesión.
- Selector en cascada **Proyecto → Tarea**; `type = MANUAL`.

## Alcance

- Rutas `/times`, `/times/new`, `/times/[id]`, `/times/[id]/edit`.
- Integración: ítem "Tiempos" en el menú (acento esmeralda), botón "Registrar tiempo" + sub-listado de registros en la ficha de tarea.
- Versión **1.5.0**.

## Fuera de alcance

- Cronómetro start/stop (plan 27).
- Cálculo de coste: depende de las tarifas (plan 28).
- Filtros / búsqueda / paginación.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Sin migración (`TimeEntry` ya existía).

## Commit previsto

```text
feat: implementar módulo de control de tiempos (/times)
```
