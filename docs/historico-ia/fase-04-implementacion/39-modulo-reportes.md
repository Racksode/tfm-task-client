# Histórico IA - Módulo Reportes (/reports, PR1)

## Prompt enviado

> Siguiente bloque tras el coste: reportes con IA. Plantear con plan y empezar
> por el PR1 (módulo de reportes sin IA: agregación de horas/coste + resumen
> manual).

## Plan propuesto

Plan `docs/planes/29-reportes-con-ia.md`, en dos PRs: PR1 módulo de reportes con
agregación y snapshot de horas/coste; PR2 resumen asistido por IA. Decisiones
cerradas: permisos **INTERNAL+** (sección de negocio), totales **congelados**
como snapshot, IA **enchufable** (real/simulada) en el PR2.

## Revisión humana

Aprobado. El usuario preguntó por qué llamar a la IA por API y su coste: se
aclara que el resumen lo genera un modelo (API de Claude, coste por tokens
ínfimo para un TFM, key aparte) y que la decisión real/simulado se cierra en el
PR2. PR1 no toca IA.

## Resultado (PR1)

- **Módulo `src/app/reports/`** (CRUD patrón `clients`): `actions.ts`
  (create/update/delete + `recalcReport` + `setReportReviewed`), `report-form.tsx`
  (cliente→proyecto en cascada, periodo, resumen interno, `visibleToClient`),
  `page.tsx`, `[id]/page.tsx`, `new/`, `[id]/edit/`, `delete-report-dialog.tsx`,
  `status.ts`.
- **Agregación** (`aggregatePeriod`): suma `durationMinutes` y `estimatedCost` de
  los `TimeEntry` del cliente (o proyecto) cuyo `workDate` cae en el periodo,
  excluyendo el cronómetro en curso, y **congela** `totalHours`/`estimatedCost`
  en el reporte. Se recalcula al crear/editar y con la acción "Recalcular".
- **Flujo de estado**: `DRAFT` al crear; "Marcar revisado" → `REVIEWED`
  (`reviewedAt` + revisor); "Reabrir" → `DRAFT`. `GENERATED` reservado para el PR2.
- **Permisos**: sección `reports` ya estaba en `BUSINESS_SECTIONS` (INTERNAL ve/
  crea/edita, ADMIN+ borra). Ítem "Reportes" (`FileText`) en el menú + acento
  índigo en `section-config.ts`. Borrado bloqueado si hay `AiUsage` vinculados.
- **Sin migración**: el modelo `Report`/`AiUsage` ya existía en el schema.
- Versión bump a **1.10.0**.

## Pendiente (PR2)

Resumen para el cliente con IA (API de Claude) → `aiSummary`, estado `GENERATED`
y `AiUsage`; integración enchufable (real/simulada). Previsto **1.11.0**.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Rutas `/reports`
construidas.

## Commit o PR previsto

```text
feat: módulo de reportes con agregación de horas y coste
```
