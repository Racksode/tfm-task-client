# Histórico IA - PR1: tipos de usuario admin/super-admin y permisos

## Estado

`Resumen reconstruido a partir de la trazabilidad disponible`.

Primer PR del roadmap `docs/planes/22-roadmap-estructura-ui-permisos.md`.

## Resumen del prompt

Tras documentar el roadmap, se aborda PR1: definir la jerarquía de roles y la base de permisos antes de la reforma de UI. El usuario eligió "prerrequisitos primero" y el modelo de permisos "Opera / Gestiona / Manda", con la gestión de usuarios restringida a `ADMIN+`.

## Decisiones aplicadas

- `UserRole` → `SUPERADMIN > ADMIN > INTERNAL > CLIENT` (enum + migración `add_admin_roles`).
- Modelo de permisos documentado en `docs/adr/0010-roles-y-permisos.md`.

## Resultado

- `prisma/schema.prisma`: enum ampliado; migración aplicada sobre PostgreSQL local.
- `src/lib/permissions.ts`: `can(role, action, section)`, `canManageUser`, `isStaff`, `isAdmin`.
- `src/lib/auth-guards.ts`: `requireStaff` y `requireAdmin` sustituyen a `requireInternal`.
- `/users` (páginas y server actions) → `requireAdmin`; `/dashboard` → `requireStaff`; raíz `/` redirige con `isStaff`.
- `AppShell` filtra el menú por permisos (`can(role, "view", section)`).
- `scripts/bootstrap-first-user.mjs`: el primer usuario se crea como `SUPERADMIN`.
- Docs: ADR 0010 y sincronización de `docs/10` (RN-03, actores) y `docs/11` (rol de la sección de usuarios).

## Restricciones / notas

- Los usuarios existentes con rol `INTERNAL` dejan de acceder a `/users`; para administrar usuarios hay que promover una cuenta a `ADMIN`/`SUPERADMIN`.
- El cableado fino de permisos por acción en la UI (botones ver/editar/eliminar) se hará en el PR de patrones (PR4).

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Migración aplicada con `prisma migrate dev`.

## Commit o PR previsto

```text
feat: añadir roles admin/super-admin y base de permisos
```
