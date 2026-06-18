# Plan 22 - Roadmap: estructura, patrones de UI y permisos (pre-Clients)

## Objetivo

Fijar los **patrones estructurales** (listado, detalle, edición, mensajes, permisos) que se replicarán en todos los módulos (Clients, Projects, Tasks…) y aplicar una tanda de **ajustes de diseño** transversales, **antes** de construir los módulos de negocio. Cambiar estos patrones después obligaría a tocar todos los módulos.

Este documento es el roadmap: la implementación se realiza en una **secuencia de PRs**, cada uno con su rama, validación y registro propios.

## Contexto

Tras el rework de login/usuarios y el pulido del shell (UI 100% shadcn/Tailwind), el usuario aportó una lista de requisitos de estructura y diseño, con capturas de referencia (CRM tipo admin: detalle con "pastillas", listado con acciones por icono azul/cian/rojo, formularios con asterisco de obligatorio, botones de cabecera arriba-derecha, footer con versión).

Hallazgos del código que condicionan el plan:

- Todos los modelos Prisma tienen `createdAt`/`updatedAt`, pero **no** `createdBy`/`updatedBy`. Existe `AuditLog` para trazar acciones.
- `User` tiene relaciones (tasks, timeEntries, reports, aiUsages, auditLogs): un borrado físico choca con claves foráneas.
- `UserRole` actual = `{ INTERNAL, CLIENT }` (no hay admin/super-admin).
- `next.config.ts` vacío; `.env.example` mínimo.

## Decisiones adoptadas

- **Prerrequisitos primero**: definir tipos admin/super-admin y la auditoría `createdBy/updatedBy` antes de la reforma de UI.
- **Modelo de permisos "Opera / Gestiona / Manda"**:
  - `INTERNAL`: CRUD de negocio (clientes, proyectos, tareas, tiempos, reportes), **sin** borrar ni gestionar usuarios.
  - `ADMIN`: + gestión de usuarios + borrado + configuración.
  - `SUPERADMIN`: + gestionar `ADMIN` y ajustes críticos.
  - `CLIENT`: solo área de cliente.
- **Sección Usuarios**: gestión restringida a `ADMIN` y `SUPERADMIN`.
- **Borrado sin cascada**: desactivar para registros con histórico; borrado físico con diálogo de confirmación y **bloqueo si tiene datos vinculados** (preserva la trazabilidad, valor central de la app).
- **Auditoría "quién"**: se añaden `createdBy/updatedBy` (PR de schema + migración).
- **Mensajes**: estado en servidor (no en URL); datos del formulario conservados en error.

## Secuencia de PRs

### PR1 - Tipos de usuario admin/super-admin + base de permisos (prerrequisito)

- Ampliar `UserRole` a jerarquía `SUPERADMIN > ADMIN > INTERNAL > CLIENT` (enum Prisma + migración). El bootstrap del primer usuario pasa a `SUPERADMIN`.
- Helper de permisos `can(role, action, section)` en `src/lib/permissions.ts` y `canManageUser(actorRole, targetRole)` (un `ADMIN` no gestiona a otros `ADMIN`/`SUPERADMIN`).
- Guards: `requireStaff` (INTERNAL/ADMIN/SUPERADMIN) y `requireAdmin` (ADMIN/SUPERADMIN), evolucionando `requireInternal`.
- `/users` pasa a `ADMIN+`; `/dashboard` a `requireStaff`; el menú oculta lo no permitido.
- ADR de roles y actualización de los docs afectados (`docs/10/11/13`).

### PR2 - Auditoría createdBy/updatedBy (prerrequisito, schema + migración)

- Añadir `createdById`/`updatedById` (nullable, FK a `User`) a las entidades de negocio (empezando por `User`).
- Capturar el actor (sesión) al crear/actualizar en las server actions.
- Se mostrará en "datos de grabación" del detalle (PR4).

### PR3 - Sistema de mensajes (estado en servidor, no en URL)

Cubre requisitos 1, 2, 3 y 7.

- Validación con `useActionState` (React 19): la action devuelve errores + valores → el formulario **conserva los datos** en error, sin URL ni redirect.
- Mensajes entre páginas: **flash en cookie httpOnly** (lectura única), no manipulable.
- `AlertBanner` reutilizable: variantes semánticas (info=cian, success=verde, warning=naranja, error=rojo/rosa), botón de cierre (X) y auto-cierre ~5s configurable por `.env`.

### PR4 - Patrones de listado / detalle / edición (estructura reusable)

Cubre requisitos 4, 5 y 6. Se implementa sobre `users` como referencia a clonar.

- **Listado**: sin descripción (solo título); botón "Nuevo" alineado al pie del título; cabecera de tabla en gris claro; acciones por fila en **iconos** (Ver azul, Editar cian, Eliminar rojo) según permisos; activar/desactivar con el mismo estilo.
- **Detalle/Ver** (`/users/[id]`): botones de cabecera (Volver/Editar/Eliminar) según permisos; info en pastillas ("Principal", "Datos de grabación"); slot para sub-listado 1→N.
- **Edición/Alta**: botones de cabecera (Volver/Ver detalles/Eliminar); botón de guardar abajo-izquierda con label dinámica ("Grabar datos" / "Actualizar datos").
- **Borrado**: server action + diálogo de confirmación (shadcn `AlertDialog`), sin cascada.
- **Badges** de cápsula a "pastilla" (`rounded-md`).

### PR5 - Shell y layout global

Cubre requisito 8.

- Tipografía un punto más pequeña.
- Menú: "Inicio" → "Dashboard"; icono por opción; separación sutil entre bloques; bloque de configuración visible solo a `ADMIN+` (depende de PR1).
- Quitar el badge de Next (`next.config.ts` → `devIndicators`).
- Footer con copyright (izquierda) y versión (derecha) desde `.env`.
- Página Dashboard mínima.

## Transversal: tokens y `.env`

- Variantes de color de alerta y radio de badge en `src/app/globals.css`.
- `.env`/`.env.example`: `APP_VERSION` (o `MAJOR/MINOR/PATCH`) y `ALERT_AUTO_DISMISS_MS`, leídos en `src/lib/config.ts` y documentados en el README.

## Reutilización

- `AppShell`/`Nav`/`PageHeader` y primitivos `src/components/ui/*` ya migrados a Tailwind.
- `requireSession` y los nuevos `requireStaff`/`requireAdmin` (`src/lib/auth-guards.ts`).
- El patrón de `user-form.tsx` y `actions.ts` como base de los módulos siguientes.

## Validación (por PR)

- `npm run build`, `npm run typecheck`, `npm run lint` en verde.
- Validación manual con Postgres + usuario bootstrap (`npm run bootstrap:first-user`).

## Notas de alcance

- PR1 y PR2 tocan **schema + migración**: validación cuidadosa.
- Hasta PR1, las acciones se muestran a INTERNAL (stub); al cerrar PR1 se cablean con `can()`.
- Cada PR se registra en `docs/planes/` y `docs/historico-ia/` según `AGENTS.md`.

## Commit previsto

```text
docs: documentar roadmap de estructura, patrones de UI y permisos
```
