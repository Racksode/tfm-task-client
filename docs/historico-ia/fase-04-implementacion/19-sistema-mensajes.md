# Histórico IA - PR3: sistema de mensajes

## Estado

`Resumen reconstruido a partir de la trazabilidad disponible`.

Tercer PR del roadmap `docs/planes/22-roadmap-estructura-ui-permisos.md`.

## Resultado

- Validación de formularios con `useActionState` (React 19): la action devuelve `{ error, values, nonce }`; el formulario conserva los datos en error, sin URL ni redirect (`src/app/users/user-form.tsx`, `src/app/users/actions.ts`).
- Mensajes entre páginas mediante flash en cookie httpOnly no manipulable: `setFlash`/`readFlash` (`src/lib/flash.ts`) y `clearFlash` server action (`src/lib/flash-actions.ts`).
- `AlertBanner` (`src/components/feedback/alert-banner.tsx`): variantes semánticas (info=cian, success=verde, warning=naranja, error=rosa), botón X y auto-cierre configurable.
- Timeout configurable por `.env` (`ALERT_AUTO_DISMISS_MS`, por defecto 5000) leído en `src/lib/config.ts`; documentado en README y `.env.example`.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde.

## Commit o PR previsto

```text
feat: sistema de mensajes con estado en servidor y alertas
```
