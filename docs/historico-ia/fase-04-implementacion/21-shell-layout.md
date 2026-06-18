# Histórico IA - PR5: shell y layout global

## Estado

`Resumen reconstruido a partir de la trazabilidad disponible`.

Quinto y último PR del roadmap `docs/planes/22-roadmap-estructura-ui-permisos.md`.

## Resultado

- **Tipografía** un punto más pequeña (`html { font-size: 15px }` en `src/app/globals.css`).
- **Menú** (`src/components/layout/nav.tsx`): icono por opción (lucide), bloques con separación sutil, filtrado por permisos en cliente (`can`), "Inicio" → "Dashboard". El bloque de administración (Usuarios) solo aparece a `ADMIN+`.
- **Footer** (`src/components/layout/app-shell.tsx`): copyright a la izquierda y versión a la derecha, leída de `.env` (`APP_VERSION_MAJOR/MINOR/PATCH`) vía `src/lib/config.ts`.
- **Badge de Next** oculto (`next.config.ts` → `devIndicators: false`).
- `.env.example` y README documentan las variables de versión.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde.

## Commit o PR previsto

```text
feat: pulir shell y layout (menú, footer, tipografía)
```
