/**
 * Configuración leída de variables de entorno (servidor).
 * Valores que en el futuro podrán moverse a una página de configuración.
 */

const toInt = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

export const appConfig = {
  /** Milisegundos antes de auto-cerrar las alertas. 0 = no auto-cerrar. */
  alertAutoDismissMs: toInt(process.env.ALERT_AUTO_DISMISS_MS, 5000),
};
