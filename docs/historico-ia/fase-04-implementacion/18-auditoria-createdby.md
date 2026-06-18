# Histórico IA - PR2: auditoría createdBy/updatedBy

## Estado

`Resumen reconstruido a partir de la trazabilidad disponible`.

Segundo PR del roadmap `docs/planes/22-roadmap-estructura-ui-permisos.md`.

## Resumen del prompt

Tras los roles (PR1), se aborda PR2: registrar quién crea y quién actualiza cada registro, para mostrarlo en "datos de grabación" del detalle (PR4). Empezando por `User`, como indica el roadmap; se replicará por entidad al construir cada módulo.

## Resultado

- `prisma/schema.prisma`: `User` gana `createdById`/`createdBy` y `updatedById`/`updatedBy` (auto-relación a `User`, nullable), con sus back-relations `createdUsers`/`updatedUsers`. Migración `add_user_audit_fields` aplicada.
- `src/app/users/actions.ts`: `createUser` fija `createdById`/`updatedById`; `updateUser` y `setUserStatus` fijan `updatedById` con el actor de la sesión (`requireAdmin` devuelve la sesión).
- `docs/03-modelo-datos.md`: añadidos los campos de auditoría de usuario.

## Notas

- Los registros previos (incluido el primer SUPERADMIN del bootstrap) quedan con `createdBy/updatedBy` nulos: es correcto (campos opcionales; no hay actor previo).
- La visualización en el detalle ("datos de grabación") se hará en el PR de patrones (PR4).
- La auditoría se replicará en `Client`, `Project`, `Task`, etc. al implementar cada módulo.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Migración aplicada con `prisma migrate dev`.

## Commit o PR previsto

```text
feat: registrar createdBy/updatedBy en usuarios
```
