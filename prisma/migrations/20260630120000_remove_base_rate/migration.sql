-- Eliminar baseRate de Client y Project: las tarifas pasan a gestionarse con el
-- modelo Rate (scope SYSTEM/CLIENT/PROJECT), única fuente de verdad.
--
-- Antes de eliminar las columnas se migran los valores existentes a filas Rate
-- (scope CLIENT/PROJECT) para no perder tarifas configuradas. En una BD sin
-- valores (fresca o de pruebas) estos INSERT no insertan nada.

-- DataMigration: Client.baseRate -> Rate (scope CLIENT)
INSERT INTO "Rate" ("id", "name", "hourlyAmount", "currency", "scope", "status", "clientId", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, 'Tarifa base', "baseRate", 'EUR', 'CLIENT'::"RateScope", 'ACTIVE'::"RateStatus", "id", now(), now()
FROM "Client"
WHERE "baseRate" IS NOT NULL;

-- DataMigration: Project.baseRate -> Rate (scope PROJECT)
INSERT INTO "Rate" ("id", "name", "hourlyAmount", "currency", "scope", "status", "projectId", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, 'Tarifa base', "baseRate", 'EUR', 'PROJECT'::"RateScope", 'ACTIVE'::"RateStatus", "id", now(), now()
FROM "Project"
WHERE "baseRate" IS NOT NULL;

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "baseRate";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "baseRate";
