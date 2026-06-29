# Histórico IA - Módulo Tarifas (/rates) y eliminación de baseRate

## Prompt enviado

> coste de tiempos primero (antes que reportes con IA). Tras analizar el schema: modelo `Rate` completo como fuente de tarifas, eliminando `baseRate`.

## Plan propuesto

Bloque "coste" en dos PRs (plan `docs/planes/28-tarifas-y-coste.md`). PR1: infraestructura de tarifas sobre el modelo `Rate` + eliminar `baseRate`. PR2 (pendiente): aplicar el coste al registro con **Opción A** (selección manual de tarifa por registro).

## Revisión humana

Aprobado. Decisiones cerradas: fuente única = modelo `Rate` (eliminar `baseRate`); gestión de tarifas = `ADMIN+`; sin backfill (datos de prueba); coste por **Opción A**, con la **Opción C** (auto por horario) anotada como mejora futura.

## Resultado (PR1)

- **Módulo `src/app/rates/`** (CRUD ADMIN+, patrón `users`): `actions.ts` (create/update/delete con `can(..., "rates")`), `rate-form.tsx` (ámbito `SYSTEM`/`CLIENT`/`PROJECT` condicional → pide cliente o proyecto; importe €/h, estado activa/inactiva), `page.tsx`, `[id]/page.tsx`, `new/`, `[id]/edit/`, `delete-rate-dialog.tsx`, `status.ts`. `Rate` sin auditoría ni FK entrantes → borrado siempre seguro.
- **Permisos**: sección `rates` en `permissions.ts` fuera de `BUSINESS_SECTIONS` → solo `ADMIN+`. Ítem "Tarifas" (`Coins`) en `Nav` y acento rosa en `section-config.ts`.
- **Eliminado `baseRate`** de `Client` y `Project` (schema, formularios, detalle, listados, acciones).
- **Migración** `20260630120000_remove_base_rate` (`DROP COLUMN baseRate` en Client y Project). Generada a mano con `prisma migrate diff` + aplicada con `prisma migrate deploy` (el entorno no interactivo no admite `migrate dev` con aviso de pérdida de datos).
- Versión bump a **1.8.0**.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Migración aplicada; `prisma migrate status` → up to date.

## Pendiente (PR2)

Aplicación del coste al `TimeEntry` (Opción A): selector de tarifa + defecto por jerarquía, snapshot de `appliedHourlyRate` y cálculo de `estimatedCost`, mostrado en `/times` + totales. Previsto **1.9.0**.

## Commit o PR previsto

```text
feat: módulo de tarifas (/rates) y eliminación de baseRate
```
