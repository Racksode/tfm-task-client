import { type Prisma, RateScope, RateStatus } from "@prisma/client";

/**
 * Tarifa tal y como la consume el formulario y la resolución de defecto.
 * `hourlyAmount` ya viene como número (el `Decimal` de Prisma se serializa en la
 * página antes de pasarlo al componente cliente).
 */
export type RateOption = {
  id: string;
  name: string;
  hourlyAmount: number;
  currency: string;
  scope: RateScope;
  status: RateStatus;
  isDefault: boolean;
  clientId: string | null;
  projectId: string | null;
};

/** Fila de tarifa tal y como la devuelve Prisma (importe como `Decimal`). */
type RateRow = {
  id: string;
  name: string;
  hourlyAmount: Prisma.Decimal;
  currency: string;
  scope: RateScope;
  status: RateStatus;
  isDefault: boolean;
  clientId: string | null;
  projectId: string | null;
};

/** Serializa las tarifas de Prisma a `RateOption` (importe a número) para el form. */
export const toRateOptions = (rates: RateRow[]): RateOption[] =>
  rates.map((rate) => ({
    id: rate.id,
    name: rate.name,
    hourlyAmount: Number(rate.hourlyAmount),
    currency: rate.currency,
    scope: rate.scope,
    status: rate.status,
    isDefault: rate.isDefault,
    clientId: rate.clientId,
    projectId: rate.projectId,
  }));

/**
 * Tarifa sugerida por jerarquía proyecto → cliente → sistema.
 *
 * Solo considera tarifas `ACTIVE` y **únicamente** las marcadas como
 * predeterminadas (`isDefault`): devuelve la predeterminada del nivel más
 * específico que tenga una (proyecto → cliente → sistema). Si ningún nivel
 * aplicable tiene predeterminada, devuelve "" (no se preselecciona ninguna y el
 * usuario la elige a mano).
 */
export const resolveDefaultRateId = (
  rates: RateOption[],
  projectId: string | null,
  clientId: string | null,
): string => {
  const active = rates.filter(
    (rate) => rate.status === RateStatus.ACTIVE && rate.isDefault,
  );

  const chosen =
    (projectId &&
      active.find(
        (rate) =>
          rate.scope === RateScope.PROJECT && rate.projectId === projectId,
      )) ||
    (clientId &&
      active.find(
        (rate) => rate.scope === RateScope.CLIENT && rate.clientId === clientId,
      )) ||
    active.find((rate) => rate.scope === RateScope.SYSTEM);

  return chosen ? chosen.id : "";
};

/**
 * Coste estimado = (minutos / 60) × importe/hora, redondeado a 2 decimales.
 * Se devuelve como número; el servidor lo envuelve en `Prisma.Decimal` al
 * guardar el snapshot.
 */
export const estimatedCostFromMinutes = (
  durationMinutes: number,
  hourlyAmount: number,
): number => Math.round((durationMinutes / 60) * hourlyAmount * 100) / 100;
