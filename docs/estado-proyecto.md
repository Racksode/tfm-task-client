# Estado del proyecto y handoff

> **Documento vivo.** Punto único para retomar el trabajo desde cualquier equipo.
> Se actualiza al cerrar cada sesión/PR (ver checklist al final).
> Última actualización: 2026-06-30 (j).

## Cómo ponerse al día (equipo nuevo o nueva sesión)

1. `git pull`.
2. Lee **este documento** y el bloque "Estado actual" del `README.md`.
3. Para más detalle:
   - `docs/planes/22-roadmap-estructura-ui-permisos.md` — roadmap.
   - `docs/historico-ia/fase-04-implementacion/` — log de ejecución PR a PR.
   - `docs/adr/` — decisiones técnicas y su porqué.

> Nota: la "memoria" del asistente es local a cada equipo y **no** se sincroniza. La fuente de verdad compartida es el repo (este doc, README, planes, histórico, ADRs).

## Estado actual

- Versión: **1.8.2**.
- Documentación funcional/UX cerrada (`docs/10`–`docs/14`).
- Base técnica: Next.js (App Router) + TypeScript + Prisma + PostgreSQL + Auth.js. UI con Tailwind + shadcn.
- Acceso: login propio (`/login`), redirección por rol en `/`, `requireSession`/`requireStaff`/`requireAdmin` (`src/lib/auth-guards.ts`).
- Módulo **Usuarios completo y pulido** (`/users`, `/users/[id]`, `/users/new`, `/users/[id]/edit`): listado con acciones por icono + doble-clic, detalle con pastillas, alta/edición con `useActionState` + flash, borrado con `AlertDialog` sin cascada, permisos.
- Módulo **Client implementado** (`/clients`, `/clients/[id]`, `/clients/new`, `/clients/[id]/edit`): primer módulo de negocio, clonado de `users`. Permisos de sección de negocio con `can()` (`INTERNAL` opera, `ADMIN+` borra), auditoría `createdBy/updatedBy`, detalle con sub-listados 1→N (proyectos —ya enlazables— y usuarios vinculados).
- Módulo **Project implementado** (`/projects`, `/projects/[id]`, `/projects/new`, `/projects/[id]/edit`): segundo módulo de negocio. Relación con `Client` (selector obligatorio), estado de 4 valores (`ACTIVE/PAUSED/COMPLETED/CANCELLED`), fechas, `visibleToClient`, tarifa y auditoría. Detalle con sub-listado 1→N de tareas (ya enlazables).
- Módulo **Task implementado** (`/tasks`, `/tasks/[id]`, `/tasks/new`, `/tasks/[id]/edit`): tercer módulo de negocio. Relación con `Project` (selector plano "Proyecto — Cliente") y `responsible` (usuario staff, opcional); `status` (5 valores) y `priority` (3), fechas, `visibleToClient` y auditoría. Detalle con sub-listado 1→N de registros de tiempo (ya enlazados a `/times`).
- Módulo **Tiempos implementado** (`/times`, `/times/[id]`, `/times/new`, `/times/[id]/edit`): cuarto módulo de negocio. Registro **manual** (tiempo "por duración" o "por inicio y fin", con campos numéricos HH/MM) y **cronómetro start/stop** (`type` `MANUAL`/`START_STOP`); selector en cascada proyecto→tarea; `INTERNAL` ve/edita solo sus registros, `ADMIN+` todos. Indicador global del cronómetro en curso en la cabecera. Coste aún sin calcular (PR2).
- Módulo **Tarifas implementado** (`/rates`, solo `ADMIN+`): gestión del modelo `Rate` (ámbito `SYSTEM`/`CLIENT`/`PROJECT`, importe €/h, estado activa/inactiva). Es la **única fuente de tarifas**; se eliminó `baseRate` de `Client`/`Project`.
- `/dashboard` y `/portal` son placeholders ("en construcción").

## Decisiones / convenciones en vigor

- **Roles** (`docs/adr/0010`): `SUPERADMIN > ADMIN > INTERNAL > CLIENT`. Modelo "Opera/Gestiona/Manda". Sección `users` = `ADMIN+`; secciones de negocio = `INTERNAL+`. Helpers en `src/lib/permissions.ts` (`can`, `canManageUser`, `isStaff`, `isAdmin`).
- **Patrón de permisos de negocio** (referencia: módulo `clients`): rutas/acciones con `requireStaff()` + comprobación por acción `can(role, action, section)` (también dentro de cada server action). `INTERNAL` obtiene `view/create/update`; `delete` solo `ADMIN+`. Es la plantilla a replicar en los siguientes módulos de negocio.
- **Borrado sin cascada**: bloquea si el registro tiene datos vinculados (se desactiva en su lugar). Incluye las **relaciones de auditoría inversas** (`deleteUser` cuenta `createdClients/updatedClients/createdProjects/updatedProjects/createdTasks/updatedTasks`; al añadir un módulo nuevo con auditoría hay que sumar sus relaciones inversas aquí). Reasignaciones que romperían la integridad también se bloquean (p. ej. cambiar el cliente de un proyecto con reportes/tarifas).
- **Auditoría**: `createdById`/`updatedById` por entidad (empezado en `User`), capturando el actor en las server actions.
- **Mensajes**: validación con `useActionState` (conserva datos en error, sin URL); éxito con flash en cookie httpOnly (`src/lib/flash.ts`); `AlertBanner` (`src/components/feedback/`) con colores semánticos, X y auto-cierre (configurable, `ALERT_AUTO_DISMISS_MS`). Lectura única: la cookie del flash se borra **al mostrarse** vía route handler `DELETE /api/flash` (fetch, no server action, para no disparar un refresh que oculte el aviso ni dejar la cookie viva en otras páginas). Los avisos de tipo **`error` no se auto-cierran** (se cierran con la X) para poder leerlos.
- **Títulos de cabecera** (`PageHeader`): el título indica siempre la sección y, si hay un registro, usa el formato **`Sección: valor`**. Listado en plural (`Usuarios`/`Clientes`); detalle y edición `Usuario: {nombre}` / `Cliente: {nombre}` (la edición se distingue por los botones de cabecera); alta `Nuevo usuario`/`Nuevo cliente`.
- **UI / patrón**: el módulo `users` es la **referencia a clonar**. Botones: ver=cian, editar/nuevo=verde turquesa (teal), eliminar=rojo, volver=marengo (`src/components/data/icon-action.tsx`). Pastillas de detalle con acento izquierdo por sección (`src/lib/section-config.ts`). Cabeceras solo con título (`PageHeader`, `items-center`).
- **Commits**: Conventional Commits (tipo en inglés, descripción en español). Cada cambio: rama propia + PR; descripción de PR en Markdown.
- **Versionado** (`README` > "Convención de versionado"): fuente en `src/lib/config.ts` (`APP_VERSION`). Revisión=`fix`/ajustes, subversión=`feat`, versión=hitos.
- **CI**: valida en PR (typecheck/lint/build/prisma); omite PRs solo-docs (`paths-ignore`).
- **Prisma Client**: se regenera en `postinstall` (`prisma generate`). Evita el error "Unknown argument" por cliente desactualizado tras un cambio de schema. Si aun así aparece: regenerar y reiniciar el dev server.
- **Tarifas y coste** (`docs/planes/28`): el modelo `Rate` (ámbito `SYSTEM`/`CLIENT`/`PROJECT`) es la **única fuente de tarifas**; se eliminó `baseRate` de Client/Project. Gestión de tarifas = **ADMIN+** (sección `rates`, fuera de `BUSINESS_SECTIONS`). El coste se **congela** como snapshot en el `TimeEntry` (no se recalcula al cambiar una tarifa después).
- **Cronómetro start/stop**: un **único** cronómetro activo por usuario (auto-detención del anterior); en curso = `START_STOP` con `endedAt = null` (excluido de los listados). Inicio/parada **atómicos** (transacción + `pg_advisory_xact_lock` vía `$executeRaw`, no `$queryRaw`) e **idempotentes** por tarea.
- **Inputs de hora**: se usan campos numéricos **HH/MM**, no `<input type="time">` nativo (devolvía valor vacío según el locale del navegador).

## Próximo paso: PR2 — coste de tiempos (Opción A)

Aplicar una tarifa al registro de tiempo y calcular el coste estimado. Plan en `docs/planes/28-tarifas-y-coste.md`.

- **Opción A (decidida)**: al crear/editar un `TimeEntry` se **elige la tarifa** (selector), con un defecto sugerido por jerarquía proyecto→cliente→sistema (tarifa `ACTIVE`; si hay varias en un nivel, la más reciente).
- Se **congela** `appliedHourlyRate` y se calcula `estimatedCost = (durationMinutes/60) × tarifa`. Cambiar una tarifa después no altera el histórico.
- Mostrar el coste en el detalle y listado de `/times` + totales (por tarea/proyecto). Caso "sin tarifa" → «—».
- Cubre el *override* por tarea/registro (es la propia selección). Bump previsto a **1.9.0** (feat).

> **Mejora futura (Opción C)**: tarifas automáticas por horario (estándar/extra/festivo) con reglas de día/franja/festivo, sugerencia + override y **partición** de registros que cruzan franjas (p. ej. 17:00–19:00 = 1 h estándar + 1 h extra). Anotada para después de que la Opción A funcione.

> **Deuda documental saldada (2026-06-30)**: se han escrito a posteriori los `docs/planes/26–28` y `docs/historico-ia/fase-04-implementacion/31–35` de los módulos Tiempos, cronómetro, sus fixes de revisión y Tarifas. A partir de aquí, documentar **en el mismo PR** (no acumular deuda).

> **Migración `remove_base_rate` revertida a DROP-only (2026-06-30, v1.8.2)**: el fix 1.8.1 había editado una migración **ya aplicada** para añadir un backfill `baseRate → Rate` (y reconciliado el checksum a mano). Es un anti-patrón (rompe el historial de migraciones de cualquier BD que aplicó la versión previa) y el backfill no aportaba nada: en una BD que ya hizo el `DROP` las columnas no existen, y en una fresca/pruebas no hay filas. Se revierte la migración a su forma original `DROP COLUMN` y se re-reconcilia el checksum local. **Regla**: no editar migraciones ya aplicadas; si hace falta migrar datos, va en una migración **nueva** y previa al cambio destructivo. Detalle en `docs/historico-ia/fase-04-implementacion/37-fix-revert-migracion-baserate.md`.

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
