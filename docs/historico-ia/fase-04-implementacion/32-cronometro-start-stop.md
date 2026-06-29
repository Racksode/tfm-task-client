# Histórico IA - Cronómetro start/stop

## Prompt enviado

> vamos a por el siguiente paso (el cronómetro start/stop que se dejó fuera del registro manual).

## Plan propuesto

Registro `START_STOP` con un único cronómetro activo por usuario. Plan en `docs/planes/27-cronometro-start-stop.md`. Decisiones cerradas con el usuario vía preguntas: ubicación (ficha de tarea + indicador global), concurrencia (uno activo, auto-detención del anterior), coste (aplazado).

## Revisión humana

Aprobado con recomendaciones: arrancar desde la ficha de tarea + indicador global en la cabecera (no un widget de arranque global); un solo cronómetro activo con auto-detención; sin timers simultáneos por ahora.

## Resultado

- `getActiveTimer` (`src/app/times/active-timer.ts`): el cronómetro en curso = `TimeEntry` `type = START_STOP` con `endedAt = null`.
- Acciones `startTimer` / `stopTimer` (`src/app/times/actions.ts`): start cierra el anterior y crea el nuevo (`durationMinutes = 0`, `startedAt = now`); stop calcula la duración y cierra.
- Componente cliente `ActiveTimerIndicator` (`src/components/layout/active-timer-indicator.tsx`): tarea + tiempo en vivo (con `suppressHydrationWarning`) + botón Detener; montado en `AppShell` (cabecera).
- Botón Iniciar/Detener en `tasks/[id]` (tonos `activate`/`deactivate`).
- El cronómetro en curso se **excluye** de `/times` y del sub-listado de la tarea con `NOT: { type: START_STOP, endedAt: null }`.
- Versión bump a **1.7.0**. Aquí se **formalizó la convención** de subir versión en cada PR (ver README); el salto desde 1.5.0 contabiliza dos features que se habían quedado sin versionar.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Flujo probado en navegador (iniciar → indicador → detener → registro guardado). Sin migración.

## Commit o PR previsto

```text
feat: cronómetro start/stop para registro de tiempos
```
