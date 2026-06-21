# Histórico IA - Fix: Prisma Client desactualizado (postinstall generate)

## Prompt enviado

> ejecutando el tfm, aparece este error: PrismaClientValidationError [...] Unknown argument `createdById` [...] en project.create()

## Diagnóstico

El cliente Prisma de `node_modules` estaba **desactualizado**: no incluía los campos de auditoría `createdById`/`updatedById` de `Project` (en las opciones disponibles del error solo aparecían `tasks/rates/reports`). La migración estaba aplicada y el schema era correcto, pero el cliente no se había regenerado en ese entorno tras el cambio de schema (p. ej. tras un `npm install`/cambio de rama sin `prisma generate`).

## Resultado

- **Fix inmediato**: `prisma generate` + reiniciar el dev server (Turbopack mantenía en memoria el módulo antiguo).
- **Causa raíz / prevención**: añadido script `postinstall: "prisma generate"` en `package.json` para que el cliente se regenere automáticamente tras cada instalación de dependencias en cualquier equipo.
- Versión bump a **1.3.1** (fix). Documentado en `README`, `estado-proyecto.md` y nota `docs/notas/25-prisma-generate-postinstall.md`.

## Validación

`prisma generate` regenera el cliente con los campos de `Project`; `npm run postinstall` y `npm run typecheck` en verde.

## Commit o PR previsto

```text
fix: regenerar Prisma Client en postinstall (evita cliente desactualizado)
```
