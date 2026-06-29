# Plan 27 - Implementación: cronómetro start/stop

## Objetivo

Completar el módulo de tiempos con el registro tipo **`START_STOP`**: iniciar y detener un contador sobre una tarea, la pieza que se dejó fuera del registro manual (plan 26).

## Contexto

`TimeEntry` ya contempla `type = START_STOP`, `startedAt`/`endedAt` nullables y `durationMinutes`. No requiere migración. El cronómetro **en curso** = un `TimeEntry` `START_STOP` con `endedAt = null` y `durationMinutes = 0` hasta detenerse. Ojo: un registro MANUAL "por duración" también tiene `endedAt` null, así que "en curso" se identifica por `type = START_STOP AND endedAt = null`.

## Decisiones (cerradas con el usuario)

- **Un único cronómetro activo por usuario**, con **auto-detención del anterior** al iniciar otro (estilo Toggl). No se permiten timers simultáneos (línea futura).
- **Ubicación**: se inicia desde la **ficha de tarea** + **indicador global** en la cabecera (tarea + tiempo en vivo + botón Detener, visible en toda la app). El "widget global" de arranque desde la barra se descarta por coste.
- **Coste**: aplazado (igual que el registro manual).
- El cronómetro en curso se **excluye** de los listados (`/times` y el sub-listado de la tarea) con `NOT: { type: START_STOP, endedAt: null }`; al detenerlo pasa a ser un registro normal.

## Alcance

- `getActiveTimer` (`src/app/times/active-timer.ts`), acciones `startTimer`/`stopTimer` (`src/app/times/actions.ts`), componente cliente `ActiveTimerIndicator` (`src/components/layout/`) montado en `AppShell`, botón Iniciar/Detener en `tasks/[id]`.
- Versión **1.7.0** (se formalizó aquí la convención de subir versión en cada PR; salto desde 1.5.0 al contabilizar dos features sin versionar).

## Fuera de alcance

- Cálculo de coste; timers simultáneos; edición del cronómetro en curso desde el listado.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Sin migración.

## Commit previsto

```text
feat: cronómetro start/stop para registro de tiempos
```
