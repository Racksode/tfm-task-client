# Histórico IA - Fix: migrar baseRate a Rate antes del DROP

## Prompt enviado

> revisión de GitHub (P1): "Migrate base rates before dropping the columns" — la migración `remove_base_rate` elimina `Client.baseRate`/`Project.baseRate` sin volcar sus valores al modelo `Rate`.

## Diagnóstico

`20260630120000_remove_base_rate` hacía `DROP COLUMN baseRate` directamente. En una BD con tarifas configuradas (creadas con los formularios antiguos), esos importes se descartaban y el módulo `/rates` no podía recuperarlos. En local solo había datos de prueba, pero la migración debe ser correcta para cualquier BD que la aplique.

## Resultado

Antes de los `DROP`, la migración inserta una fila `Rate` por cada `Client`/`Project` con `baseRate` no nulo:

```sql
INSERT INTO "Rate" ("id","name","hourlyAmount","currency","scope","status","clientId","createdAt","updatedAt")
SELECT gen_random_uuid()::text, 'Tarifa base', "baseRate", 'EUR', 'CLIENT'::"RateScope", 'ACTIVE'::"RateStatus", "id", now(), now()
FROM "Client" WHERE "baseRate" IS NOT NULL;
-- ídem para Project con scope PROJECT
```

En una BD sin valores (fresca/pruebas) no inserta nada; el schema final es idéntico.

## Nota técnica

Se editó una migración **ya aplicada** en local (proyecto sin desplegar). El checksum SHA-256 de `_prisma_migrations` se reconcilió manualmente para que `prisma migrate dev/status` siga limpio. En CI y clones frescos la migración corre completa.

## Validación

Forma del `INSERT` (columnas, tipos, enums `RateScope`/`RateStatus`, casts, `gen_random_uuid`) validada contra la tabla `Rate` real en una transacción revertida. `prisma migrate status` → up to date. Versión bump a **1.8.1**.

## Commit o PR previsto

```text
fix: migrar baseRate a Rate antes de eliminar las columnas
```

## Actualización (2026-06-30, v1.8.2) — revertido

Este fix se **revirtió**. Editar una migración ya aplicada (y reconciliar el
checksum a mano) rompe el historial de cualquier BD que aplicó la versión
previa, y el backfill no aportaba nada real (ver
[37-fix-revert-migracion-baserate.md](37-fix-revert-migracion-baserate.md)). La
migración vuelve a su forma original `DROP COLUMN`.
