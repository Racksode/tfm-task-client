# Histórico IA - Coste de tiempos (PR2, Opción A)

## Prompt enviado

> Siguiente paso del bloque "coste": PR2 — aplicar la tarifa al registro de
> tiempo (Opción A: selección manual con defecto por jerarquía), calcular el
> coste estimado y mostrarlo.

## Plan propuesto

Plan `docs/planes/28-tarifas-y-coste.md` (PR2). Selector de tarifa en el
formulario de `/times` con defecto sugerido por jerarquía
proyecto→cliente→sistema, snapshot de `appliedHourlyRate`/`estimatedCost` y
visualización del coste en listado/detalle + totales.

## Revisión humana

Aprobado. **Decisiones cerradas en esta sesión**:

1. Además del snapshot, guardar `TimeEntry.rateId` (referencia) con
   **`onDelete: SetNull`**. Desviación consciente del plan 28 (que preveía "sin
   FK"): da trazabilidad y permite preseleccionar la tarifa al editar,
   manteniendo "borrado de tarifa siempre seguro" (SetNull anula el vínculo sin
   alterar el coste congelado).
2. Sustituir el defecto implícito "la más reciente" por una marca explícita
   **`Rate.isDefault`** (una predeterminada por ámbito/propietario). Surge de la
   reflexión del usuario: poder fijar la tarifa por defecto de un cliente
   (o proyecto/sistema) y elegir otra a mano cuando convenga. La jerarquía ya
   cubría "defecto de cliente + override por registro"; solo faltaba hacer el
   defecto explícito.

## Resultado

- **Schema/migración** `add_rate_to_time_entry`: `TimeEntry.rateId String?` +
  relación `rate` con `onDelete: SetNull`; inversa `timeEntries` en `Rate`.
- **`rate-cost.ts`** (módulo puro, reutilizable en cliente y servidor):
  `resolveDefaultRateId` (jerarquía proyecto→cliente→sistema, solo `ACTIVE` y
  solo `isDefault`: la predeterminada del nivel más específico que la tenga; sin
  fallback a "la más reciente", si no hay → no se preselecciona ninguna),
  `estimatedCostFromMinutes` (`(min/60) × importe`, redondeo a 2 decimales) y
  `toRateOptions` (serializa `Decimal` a número).
- **`Rate.isDefault`** (migración `add_rate_is_default`) + checkbox en el
  formulario de `/rates`; unicidad por ámbito garantizada en `createRate`/
  `updateRate` (transacción que desmarca las hermanas). Badge "Predeterminada"
  en listado y detalle de tarifas.
- **`actions.ts`**: `createTimeEntry`/`updateTimeEntry` congelan el snapshot a
  partir de la tarifa elegida (`resolveSelectedSnapshot`); al editar se
  recalcula (duración o tarifa pueden cambiar). El cronómetro aplica la tarifa
  por defecto al cerrarse (`closeTimer` → `resolveDefaultSnapshot`), cubriendo
  tanto parar como cambiar de tarea.
- **`time-form.tsx`**: selector "Tarifa" con opción "Sin tarifa"; el defecto se
  resugiere por jerarquía al cambiar de proyecto; en edición conserva la tarifa
  guardada aunque esté inactiva. Páginas `new`/`edit` cargan las tarifas
  `ACTIVE` (+ la aplicada si está inactiva) y el `clientId` de cada proyecto.
- **Visualización**: columna "Coste" + fila de total en el listado `/times`;
  "Tarifa aplicada" y "Coste estimado" en el detalle; coste por registro y total
  en el detalle de tarea. Caso "sin tarifa" → «—».

## Pendiente

- **Total por proyecto**: el detalle de proyecto aún no lista tiempos; se
  abordará junto con los reportes.
- **Opción C** (tarifas automáticas por horario): mejora futura ya anotada.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Migración
aplicada; `prisma migrate status` → up to date. Versión bump a **1.9.0**.

## Commit o PR previsto

```text
feat: coste estimado en registros de tiempo
```
