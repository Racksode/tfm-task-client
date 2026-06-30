# Plan 29 - Reportes (con IA)

Bloque **reportes** en **dos PRs**: (1) módulo de reportes con agregación de horas/coste y resumen manual; (2) resumen asistido por IA.

## Objetivo

Generar un reporte del trabajo realizado para un cliente (y opcionalmente un proyecto) en un periodo: horas y coste agregados + un resumen profesional, revisable antes de hacerlo visible al cliente. Es la funcionalidad diferenciadora del TFM (`docs/05-ia.md`).

## Contexto

El schema ya trae el modelo **`Report`** (cliente, proyecto opcional, periodo, `totalHours`, `estimatedCost`, `functionalSummary` interno, `aiSummary` para cliente, `status` `DRAFT`/`GENERATED`/`REVIEWED`, `visibleToClient`, revisor) y **`AiUsage`** (traza de cada llamada IA, tipo `REPORT_SUMMARY`). No hace falta migración para el PR1.

## Decisiones (cerradas con el usuario)

- **Permisos = INTERNAL+** (sección de negocio `reports`, ya en `BUSINESS_SECTIONS`): INTERNAL ve/crea/edita, ADMIN+ borra. Patrón de `clients`.
- **Coste/horas congelados** como snapshot en el `Report` al crear/recalcular (igual que `TimeEntry`): no se recalculan solos al añadir tiempos después; hay acción explícita de recalcular.
- **IA enchufable (PR2)**: si hay API key de Claude → resumen real; si no → resumen simulado de respaldo. Coste por uso ínfimo (tokens), se decide en el PR2.

## Alcance

### PR1 — Módulo de reportes (este PR, **v1.10.0**)

- Módulo CRUD `/reports` (patrón `users`/`clients`): listado, alta, detalle, edición, borrado (bloqueado si tiene `AiUsage` vinculados).
- Formulario: cliente (obligatorio) → proyecto (opcional, en cascada), periodo (inicio/fin), `functionalSummary` (resumen interno manual), `visibleToClient`.
- **Agregación**: al crear/editar/recalcular se suman las horas (`durationMinutes`) y el coste (`estimatedCost`) de los `TimeEntry` del cliente/proyecto cuyo `workDate` cae en el periodo (excluye el cronómetro en curso) y se congelan en `totalHours`/`estimatedCost`.
- **Flujo de estado**: `DRAFT` al crear; acción "Marcar como revisado" → `REVIEWED` (guarda `reviewedAt`/`reviewer`); "Reabrir" → `DRAFT`. `GENERATED` se reserva para el PR2.
- Sección `reports` en el menú (ítem "Reportes") + acento de color. Permisos ya existentes.

### PR2 — Resumen con IA (pendiente, previsto **v1.11.0**)

- Acción "Generar resumen" → llamada a la API de Claude con las tareas/descripciones del periodo; guarda `aiSummary`, marca `GENERATED` y registra `AiUsage`. Revisión humana antes de `visibleToClient`. Integración enchufable (real/simulada).

## Fuera de alcance / mejora futura

- Total por proyecto en el detalle de proyecto (anotado en el bloque de coste).
- Prueba conceptual de lenguaje natural (`docs/05-ia.md` §2.3): asistente aparte, posterior.
- Exportación a PDF del reporte.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Sin migración.

## Commits previstos

```text
feat: módulo de reportes con agregación de horas y coste   # PR1
feat: resumen de reportes con IA                           # PR2
```
