/**
 * Configuración leída de variables de entorno (servidor).
 * Valores que en el futuro podrán moverse a una página de configuración.
 */

const toInt = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

/**
 * Versión de la app (version.subversion.revisión).
 * Fuente de verdad en código; se incrementa al avanzar cada PR.
 * Puede sobrescribirse por entorno con APP_VERSION.
 */
const APP_VERSION = "1.8.1";

export const appConfig = {
  /** Milisegundos antes de auto-cerrar las alertas. 0 = no auto-cerrar. */
  alertAutoDismissMs: toInt(process.env.ALERT_AUTO_DISMISS_MS, 5000),

  /** Versión mostrada en el footer. */
  version: process.env.APP_VERSION ?? APP_VERSION,
};
