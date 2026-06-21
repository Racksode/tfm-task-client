# Histórico IA - Módulo Client (/clients)

## Prompt enviado

> revisa la documentación (mira solo agents e indicados en el mismo) y prepara plan para el siguiente punto

## Plan propuesto

Clonar el patrón CRUD de `users` para el primer módulo de negocio, **Client** (`/clients`), añadiendo auditoría al modelo `Client` y respetando que es una sección de negocio (permisos vía `can()`: `INTERNAL+` opera, `ADMIN+` borra). Detalle con sub-listados 1→N (proyectos y usuarios vinculados). Plan completo en `docs/planes/23-modulo-client.md`.

## Revisión humana

Aprobado en modo plan. Dos decisiones consultadas:

- **Permisos**: el usuario pidió recomendación → aplicado "INTERNAL opera, ADMIN borra" (coherente con estado-proyecto.md).
- **Detalle**: el usuario eligió **añadir sub-listados 1→N** (proyectos y usuarios del cliente).

## Resultado

- **Schema + migración** (`prisma/schema.prisma`, `prisma/migrations/20260621120000_add_client_audit_fields/`): `Client.createdById`/`updatedById` (FK nullable a `User`, `ON DELETE SET NULL`) y relaciones inversas `User.createdClients`/`updatedClients`.
- **Módulo `src/app/clients/`**: `actions.ts` (create/update/setStatus/delete con guardas `requireStaff` + `can()`), `client-form.tsx` (`useActionState`, sin password/rol), `page.tsx` (listado con acciones por icono gateadas), `[id]/page.tsx` (pastillas + sub-listados de proyectos y usuarios), `new/` y `[id]/edit/`, `delete-client-dialog.tsx`.
- **Borrado sin cascada**: bloqueo por `_count` de `users`/`projects`/`rates`/`reports`.
- **Infra**: `section-config.ts` (acento `clients` azul), `nav.tsx` (entrada "Clientes" con `Building2`). `permissions.ts` ya contemplaba `clients`.
- Versión bump a **1.2.0**.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. La migración se aplica con `npm run prisma:migrate:dev` con Docker/Postgres arriba (pendiente de ejecutar en el equipo con la BD levantada).

## Commit o PR previsto

```text
feat: implementar módulo de clientes (/clients)
```
