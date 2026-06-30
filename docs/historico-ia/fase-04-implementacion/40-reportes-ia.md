# Histórico IA - Resumen de reportes con IA (PR2)

## Prompt enviado

> Siguiente paso tras el módulo de reportes (PR1): PR2 — resumen para el cliente
> asistido por IA. Definir el plan y luego implementarlo.

## Plan propuesto

Plan `docs/planes/29-reportes-con-ia.md` (PR2). El usuario preguntó por qué llamar
a la IA por API y su coste; se aclaró con datos de la referencia de la API: el
resumen lo genera un modelo (tokens, coste aparte, key propia), ínfimo para un
TFM. Se consultó la skill `claude-api` para modelos/precios/SDK exactos.

## Revisión humana

Aprobado. **Decisiones cerradas**: modelo **Haiku 4.5** por defecto
(`claude-haiku-4-5`, el más barato y de sobra para redactar a partir de notas),
configurable con `AI_MODEL`; integración **enchufable** (real con API key /
simulada sin ella) para que la demo funcione sin coste; **`AiUsage`** siempre,
también en error.

## Resultado (PR2)

- **`src/lib/ai.ts`** (`@anthropic-ai/sdk`): `generateProfessionalSummary` con
  *system prompt* en español (redactar resumen profesional orientado a cliente a
  partir de notas técnicas, sin inventar). Si no hay `ANTHROPIC_API_KEY` →
  resumen **simulado** por plantilla. Modelo por `AI_MODEL` (defecto Haiku 4.5),
  `max_tokens` 1024, sin streaming (salida corta).
- **`generateReportSummary`** (server action, `update`/`reports`): agrupa por
  tarea los `TimeEntry` del periodo (mismo filtro que la agregación), llama a la
  IA, congela `aiSummary`, marca `GENERATED` (+ `generatedAt`) y registra
  `AiUsage` (`REPORT_SUMMARY`, solicitante, entrada/salida, `GENERATED`). Si la
  llamada falla, registra `AiUsage` en `ERROR` y avisa, sin romper la página.
- **UI**: botón "Generar/Regenerar resumen (IA)" en el detalle del reporte; el
  `aiSummary` se muestra y el flujo `GENERATED`→`REVIEWED` + `visibleToClient`
  (del PR1) sirve de revisión humana antes de publicarlo.
- **Config**: `ANTHROPIC_API_KEY` y `AI_MODEL` documentados en `.env.example` y
  README. Sin migración (modelo `Report`/`AiUsage` ya existía).
- Versión bump a **1.11.0**.

## Pendiente

- **Portal de cliente** (`/portal`) y **dashboard** como siguiente bloque.
- Prueba conceptual de lenguaje natural (`docs/05-ia.md` §2.3) y total por
  proyecto, posteriores.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Resumen simulado
verificado sin API key.

## Commit o PR previsto

```text
feat: resumen de reportes con IA
```
