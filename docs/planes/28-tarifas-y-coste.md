# Plan 28 - Tarifas (/rates) y coste de tiempos

Bloque "coste de tiempos" en **dos PRs**: (1) infraestructura de tarifas, (2) aplicación del coste al registro de tiempo.

## Objetivo

Poder calcular el coste estimado del tiempo trabajado a partir de una **tarifa por hora**.

## Contexto

El schema ya traía dos mecanismos de tarifa en paralelo: `baseRate` (campo en `Client`/`Project`, usado en sus formularios) y un modelo **`Rate`** completo (sin UI): `name`, `hourlyAmount`, `currency` (EUR), `scope` `SYSTEM`/`CLIENT`/`PROJECT`, `status` `ACTIVE`/`INACTIVE`, vínculo opcional a cliente/proyecto. `TimeEntry` ya tiene `appliedHourlyRate` y `estimatedCost` (nullables).

## Decisiones (cerradas con el usuario)

- **Fuente única de tarifas: el modelo `Rate`.** Se **elimina `baseRate`** de `Client` y `Project` (evita dos orígenes en conflicto).
- **Gestión de tarifas = `ADMIN+`** (configuración de negocio sensible); el resto de módulos siguen con INTERNAL crea/edita y ADMIN+ borra.
- **`Rate` no lleva auditoría** `createdBy/updatedBy` (se respeta el modelo tal cual). Sin FK entrantes (el coste se guarda como snapshot en `TimeEntry`) → borrado siempre seguro.
- **Aplicación del coste (PR2) = Opción A: selección manual de tarifa por registro.** Al crear/editar un `TimeEntry` se elige la tarifa (con defecto sugerido por jerarquía proyecto→cliente→sistema); se **congela** `appliedHourlyRate` y se calcula `estimatedCost = (durationMinutes/60) × tarifa`. Cubre el caso del usuario (tarifas por horario estándar/extra/festivo elegidas a mano) y el *override* por tarea/registro.

## Alcance

### PR1 — Infraestructura de tarifas (hecho, **v1.8.0**)

- Módulo CRUD `/rates` (ADMIN+) clonando el patrón de `users`: listado, alta, detalle, edición, borrado. Formulario con ámbito condicional (cliente/proyecto). Sección `rates` en `permissions.ts` (fuera de `BUSINESS_SECTIONS`), ítem "Tarifas" en el menú (acento rosa, solo ADMIN+).
- Eliminado `baseRate` de Client/Project (schema, formularios, detalle, listados, acciones) + migración `remove_base_rate`.

### PR2 — Coste de tiempos (pendiente, previsto **v1.9.0**)

- Selector de tarifa en el formulario de tiempo + resolución del defecto.
- Snapshot de `appliedHourlyRate` + cálculo de `estimatedCost` al crear/editar.
- Mostrar coste en detalle y listado de `/times` + totales (por tarea/proyecto).

## Fuera de alcance / mejora futura

- **Opción C — tarifas automáticas por horario** (mejora futura anotada): reglas de día/franja/festivo en `Rate` (migración), hora real en el registro, sugerencia automática con override y **partición** de registros que cruzan franjas (p. ej. 17:00–19:00 = 1 h estándar + 1 h extra). Más vistoso pero complejo; va después de que la Opción A funcione.

## Validación

PR1: `npm run typecheck`, `npm run lint`, `npm run build` en verde. Migración `remove_base_rate` aplicada.

## Commits previstos

```text
feat: módulo de tarifas (/rates) y eliminación de baseRate   # PR1
feat: coste estimado en registros de tiempo                  # PR2
```
