# Histórico IA - Fix: revertir la migración `remove_base_rate` a DROP-only

## Prompt enviado

> Revisión de GitHub (P2, "Preserve applied migration history"): el fix 1.8.1
> editó la migración `20260630120000_remove_base_rate` **ya aplicada** para
> añadir un backfill `baseRate → Rate` antes de los `DROP COLUMN`. Cambiar una
> migración aplicada cambia su checksum en `_prisma_migrations`; sin un paso de
> recuperación committed, cualquier BD en el estado 1.8.0 sufre drift de
> historial.

## Diagnóstico

El P2 es correcto, y el backfill además **no aportaba valor**:

- La migración original (v1.8.0, commit `3aa65df`) era solo `DROP COLUMN
  baseRate` en `Client` y `Project`, y **ya se había aplicado** en local.
- El fix 1.8.1 (`6a9b132`) editó ese mismo fichero para anteponer
  `INSERT … SELECT … FROM "Client"/"Project" WHERE "baseRate" IS NOT NULL`, y
  **reconcilió el checksum a mano** en `_prisma_migrations` (anti-patrón: solo
  arregla la BD local, no la de nadie más).
- En cualquier BD que ya aplicó la versión `DROP`-only, las columnas `baseRate`
  **ya no existen**, así que esos `INSERT` nunca corren ahí. En una BD fresca o
  de pruebas no hay filas, así que tampoco insertan nada. La decisión original
  fue explícitamente **sin backfill** (datos de prueba).
- `prisma migrate status` **no compara** checksums de migraciones ya aplicadas
  (por eso no avisaba), pero `prisma migrate dev` sí lo reporta como migración
  modificada.

Resultado neto del fix 1.8.1: cero beneficio + drift de historial. Se revierte.

## Resultado

- `migration.sql` restaurado a su forma original `DROP COLUMN` (sha-256
  `22f6a8…`, idéntico al aplicado en v1.8.0). Se elimina el bloque `INSERT`.
- **Checksum local re-reconciliado** a `22f6a8…` con un `UPDATE` sobre
  `_prisma_migrations` ejecutado vía `prisma db execute`, dejando la BD local
  consistente con el fichero revertido. No hace falta `migrate reset`.
- Documentación 36 marcada como revertida; nota en `estado-proyecto.md`.
- Versión bump a **1.8.2** (fix).

## Regla que queda fijada

No se editan migraciones ya aplicadas. Si se necesita migrar datos, va en una
migración **nueva** y **previa** al cambio destructivo (nunca reescribiendo una
ya aplicada ni tocando el checksum a mano).

## Validación

`prisma migrate status` → up to date. `npm run typecheck`, `npm run lint`,
`npm run build` en verde.

## Commit o PR previsto

```text
fix: revertir la migración remove_base_rate a DROP-only y reconciliar checksum
```
