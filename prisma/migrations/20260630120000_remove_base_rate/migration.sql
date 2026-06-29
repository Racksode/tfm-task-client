-- Eliminar baseRate de Client y Project: las tarifas pasan a gestionarse con el
-- modelo Rate (scope SYSTEM/CLIENT/PROJECT), única fuente de verdad.

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "baseRate";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "baseRate";
