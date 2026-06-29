# Histórico IA - Módulo Tiempos (/times)

## Prompt enviado

> (continuación de sesión) registro manual de tiempos sobre tareas; y depuración del modo "inicio y fin", que daba error "Indica la hora de inicio y de fin".

## Plan propuesto

Registro **manual** de `TimeEntry` clonando el patrón de negocio: formulario con tarea (selector en cascada proyecto→tarea), fecha, tiempo "por duración" o "por inicio y fin", y descripción; permisos de negocio con INTERNAL viendo solo sus registros. Plan en `docs/planes/26-modulo-times.md`.

## Revisión humana

Aprobado. Durante la sesión, el modo "por inicio y fin" fallaba persistentemente.

## Diagnóstico del bug inicio/fin

Se instrumentó temporalmente `createTimeEntry`/`updateTimeEntry` para volcar el `FormData` crudo a un fichero. Tras **recarga forzada** seguía llegando `mode="interval"` correcto pero `startTime=""`/`endTime=""` vacíos, mientras los inputs numéricos de "duración" sí capturaban. Causa real: el `<input type="time">` nativo devuelve `value=""` en ese navegador (fragilidad por locale/formato 12h con AM/PM sin fijar), **no** la reutilización de nodos DOM que se había sospechado.

## Resultado

- **Módulo `src/app/times/`**: `actions.ts` (create/update/delete con `requireStaff` + `can()`, validación, autor = sesión, `type = MANUAL`), `time-form.tsx`, `page.tsx`, `[id]/page.tsx`, `new/`, `[id]/edit/`, `delete-time-dialog.tsx`, `status.ts`.
- **Fix inicio/fin**: sustituidos los dos `type="time"` por pares numéricos **HH/MM** (`startHour`/`startMinute`/`endHour`/`endMinute`); el servidor construye la fecha con `combineDateParts` + `isValidHourMinute` (minuto vacío = 0). Estética compacta (`timeFieldClass`, envuelto en flex; ambos modos uniformes).
- **Permisos**: un `INTERNAL` ve/edita solo sus registros; `ADMIN+` todos y borra.
- **Integración**: ítem "Tiempos" en `Nav` (`Clock`), acento esmeralda, botón "Registrar tiempo" + sub-listado en `tasks/[id]`.
- Versión bump a **1.5.0**.

## Lección

Ante "el dato llega vacío", **instrumentar la server action para ver el `FormData` real** antes de teorizar sobre caché o reconciliación de DOM.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Sin migración (`TimeEntry` ya existía). Diagnóstico temporal eliminado.

## Commit o PR previsto

```text
feat: implementar módulo de control de tiempos (/times)
```
