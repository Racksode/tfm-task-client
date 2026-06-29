# Histórico IA - Fix: inicio idempotente del cronómetro

## Prompt enviado

> validación de GitHub: "Avoid restarting the timer on duplicate starts".

## Diagnóstico

Con dos `startTimer` concurrentes para la **misma tarea** (doble clic en "Iniciar" sin timer en curso), la primera transacción creaba la fila activa y la segunda, tras esperar el lock, la **cerraba** y creaba otra. Como `elapsedMinutes` redondea a un mínimo de 1, quedaba un registro completado **espurio de 1 minuto** aunque el usuario solo quería iniciar uno.

## Resultado

`times/actions.ts`: dentro de la transacción con lock, el inicio es ahora **idempotente**. Se extraen `findActiveTimer` y `closeTimer`; la lógica:

```ts
const active = await findActiveTimer(tx, userId);
if (active?.taskId === task.id) return;                   // mismo task: no-op
if (active?.startedAt) await closeTimer(tx, active, now); // otra task: cerrar
await tx.timeEntry.create({ /* nuevo START_STOP */ });
```

Así un doble clic sobre la misma tarea no cierra el recién creado ni deja el registro espurio; el cambio a **otra** tarea sigue cerrando el anterior.

## Validación

`npm run typecheck`, `npm run lint` en verde. Caso de carrera inviable de reproducir a mano; verificado a nivel de lógica + tipos. Versión bump a **1.7.1**.

## Commit o PR previsto

```text
fix: inicio idempotente del cronómetro en la misma tarea
```
