# Estado del proyecto y handoff

> **Documento vivo.** Punto único para retomar el trabajo desde cualquier equipo.
> Se actualiza al cerrar cada sesión/PR (ver checklist al final).
> Última actualización: 2026-06-21 (d).

## Cómo ponerse al día (equipo nuevo o nueva sesión)

1. `git pull`.
2. Lee **este documento** y el bloque "Estado actual" del `README.md`.
3. Para más detalle:
   - `docs/planes/22-roadmap-estructura-ui-permisos.md` — roadmap.
   - `docs/historico-ia/fase-04-implementacion/` — log de ejecución PR a PR.
   - `docs/adr/` — decisiones técnicas y su porqué.

> Nota: la "memoria" del asistente es local a cada equipo y **no** se sincroniza. La fuente de verdad compartida es el repo (este doc, README, planes, histórico, ADRs).

## Estado actual

- Versión: **1.3.1**.
- Documentación funcional/UX cerrada (`docs/10`–`docs/14`).
- Base técnica: Next.js (App Router) + TypeScript + Prisma + PostgreSQL + Auth.js. UI con Tailwind + shadcn.
- Acceso: login propio (`/login`), redirección por rol en `/`, `requireSession`/`requireStaff`/`requireAdmin` (`src/lib/auth-guards.ts`).
- Módulo **Usuarios completo y pulido** (`/users`, `/users/[id]`, `/users/new`, `/users/[id]/edit`): listado con acciones por icono + doble-clic, detalle con pastillas, alta/edición con `useActionState` + flash, borrado con `AlertDialog` sin cascada, permisos.
- Módulo **Client implementado** (`/clients`, `/clients/[id]`, `/clients/new`, `/clients/[id]/edit`): primer módulo de negocio, clonado de `users`. Permisos de sección de negocio con `can()` (`INTERNAL` opera, `ADMIN+` borra), auditoría `createdBy/updatedBy`, detalle con sub-listados 1→N (proyectos —ya enlazables— y usuarios vinculados).
- Módulo **Project implementado** (`/projects`, `/projects/[id]`, `/projects/new`, `/projects/[id]/edit`): segundo módulo de negocio. Relación con `Client` (selector obligatorio), estado de 4 valores (`ACTIVE/PAUSED/COMPLETED/CANCELLED`), fechas, `visibleToClient`, tarifa y auditoría. Detalle con sub-listado 1→N de tareas (informativo, aún sin `/tasks`).
- `/dashboard` y `/portal` son placeholders ("en construcción").

## Decisiones / convenciones en vigor

- **Roles** (`docs/adr/0010`): `SUPERADMIN > ADMIN > INTERNAL > CLIENT`. Modelo "Opera/Gestiona/Manda". Sección `users` = `ADMIN+`; secciones de negocio = `INTERNAL+`. Helpers en `src/lib/permissions.ts` (`can`, `canManageUser`, `isStaff`, `isAdmin`).
- **Patrón de permisos de negocio** (referencia: módulo `clients`): rutas/acciones con `requireStaff()` + comprobación por acción `can(role, action, section)` (también dentro de cada server action). `INTERNAL` obtiene `view/create/update`; `delete` solo `ADMIN+`. Es la plantilla a replicar en los siguientes módulos de negocio.
- **Borrado sin cascada**: bloquea si el registro tiene datos vinculados (se desactiva en su lugar).
- **Auditoría**: `createdById`/`updatedById` por entidad (empezado en `User`), capturando el actor en las server actions.
- **Mensajes**: validación con `useActionState` (conserva datos en error, sin URL); éxito con flash en cookie httpOnly (`src/lib/flash.ts`); `AlertBanner` (`src/components/feedback/`) con colores semánticos, X y auto-cierre (configurable, `ALERT_AUTO_DISMISS_MS`). El flash se borra **al cerrar** el aviso (no al mostrarlo: hacerlo al montar disparaba un refresh que lo ocultaba antes de tiempo). Los avisos de tipo **`error` no se auto-cierran** (se cierran con la X) para poder leerlos.
- **Títulos de cabecera** (`PageHeader`): el título indica siempre la sección y, si hay un registro, usa el formato **`Sección: valor`**. Listado en plural (`Usuarios`/`Clientes`); detalle y edición `Usuario: {nombre}` / `Cliente: {nombre}` (la edición se distingue por los botones de cabecera); alta `Nuevo usuario`/`Nuevo cliente`.
- **UI / patrón**: el módulo `users` es la **referencia a clonar**. Botones: ver=cian, editar/nuevo=verde turquesa (teal), eliminar=rojo, volver=marengo (`src/components/data/icon-action.tsx`). Pastillas de detalle con acento izquierdo por sección (`src/lib/section-config.ts`). Cabeceras solo con título (`PageHeader`, `items-center`).
- **Commits**: Conventional Commits (tipo en inglés, descripción en español). Cada cambio: rama propia + PR; descripción de PR en Markdown.
- **Versionado** (`README` > "Convención de versionado"): fuente en `src/lib/config.ts` (`APP_VERSION`). Revisión=`fix`/ajustes, subversión=`feat`, versión=hitos.
- **CI**: valida en PR (typecheck/lint/build/prisma); omite PRs solo-docs (`paths-ignore`).
- **Prisma Client**: se regenera en `postinstall` (`prisma generate`). Evita el error "Unknown argument" por cliente desactualizado tras un cambio de schema. Si aun así aparece: regenerar y reiniciar el dev server.

## Próximo paso: módulo Task

Clonar el patrón ya consolidado (`users` + `clients` + `projects`) para `/tasks`:

- Rutas: `/tasks` (listado), `/tasks/[id]` (detalle con pastillas), `/tasks/new`, `/tasks/[id]/edit`.
- **Permisos**: sección de negocio → `requireStaff` + `can(role, action, "tasks")` (INTERNAL opera; borrar solo `ADMIN+`). Añadir `tasks` al menú (`Nav`) y su acento en `src/lib/section-config.ts`.
- `Task` pertenece a un `Project` (`projectId` obligatorio → selector) y tiene `responsible` (User opcional). Estados `TaskStatus`/`TaskPriority` (varios valores → sin toggle rápido, como en `projects`). En el detalle del proyecto, las tareas pasarán de informativas a enlazables.
- Añadir auditoría `createdById/updatedById` a `Task` (migración), como en `Client`/`Project`.
- Bump de versión a **1.4.0** (feat).

## Notas y dudas por resolver (del usuario)

> Apuntes y dudas para revisar más adelante. No son mejoras del producto ni del SaaS; son cuestiones de método y herramientas.

1. **Consumo de tokens.** Entender por qué cualquier pregunta consume miles de tokens (sobre todo al principio de la conversación) y cómo reducir el consumo.

2. **Base reutilizable para nuevos proyectos.**
   - En un CRM previo (Laravel + Node) los permisos eran intrínsecos de Laravel. ¿Cómo gestionarlos en proyectos con Next?
   - Definir el guion documental a crear en cada proyecto (RF, CU, etc.).
   - Cómo crear una base/plantilla para no partir de cero, contemplando dos tipos: webs estáticas (con BD) y aplicaciones tipo CRM. Valorar Skills, subagentes, etc.

3. **Revisión de reutilización y permisos.**
   - Revisar si usamos un framework propio y si todo está bien reutilizado, en especial la gestión de permisos.
   - Documentar/explicar cómo se gestionan los permisos actualmente.

## Checklist de cierre de PR

- [ ] Validar: `npm run typecheck && npm run lint && npm run build` (y migración Prisma si aplica).
- [ ] **Bump de versión** en `src/lib/config.ts` según el tipo de PR (revisión/subversión/versión).
- [ ] Actualizar el bloque **"Estado actual"** del `README.md` si cambió el estado.
- [ ] Actualizar **este documento** (estado, decisiones, próximos pasos, fecha).
- [ ] Registrar en `docs/planes/` y `docs/historico-ia/` si es un bloque relevante.
- [ ] Commit (Conventional Commits) + PR con descripción en Markdown.
