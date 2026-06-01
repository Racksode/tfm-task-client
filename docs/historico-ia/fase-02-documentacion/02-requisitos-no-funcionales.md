# Historico IA - Requisitos no funcionales

## Estado del historico

Resumen reconstruido a partir de la trazabilidad disponible.

## Contexto

Bloque usado para definir el marco no funcional del MVP: seguridad, privacidad, calidad, mantenibilidad, usabilidad, rendimiento razonable, testing e IA responsable.

## Prompt enviado

Prompt literal disponible en `docs/prompts/README.md`.

```text
Lee README.md, AGENTS.md, docs/00-vision-y-alcance.md, docs/01-requisitos-funcionales.md y docs/09-plan-trabajo-y-control-alcance.md.

Quiero completar docs/02-requisitos-no-funcionales.md para este TFM, teniendo en cuenta seguridad desde diseno, OWASP Top Ten, mantenibilidad, testing, accesibilidad, usabilidad, rendimiento razonable, privacidad y control de calidad.

Primero propone un plan de secciones y requisitos.

No edites, no crees y no borres ficheros todavia. Solo devuelve el plan.
```

## Plan propuesto por IA

Resumen reconstruido a partir de la trazabilidad disponible.

El plan proponia documentar criterios generales del MVP, seguridad desde el diseno, referencias OWASP adaptadas, privacidad, trazabilidad minima, testing, accesibilidad, rendimiento razonable, errores, modo degradado e IA responsable.

## Revision humana

- Anadir trazabilidad minima sin convertirla en auditoria avanzada.
- Matizar RGPD como buenas practicas basicas de privacidad.
- Reforzar el modo degradado cuando la IA no este disponible.
- Mantener E2E como recomendable, no obligatorio.
- No adelantar stack, arquitectura concreta ni decisiones de implementacion.

## Prompt de aplicacion

Prompt de aplicacion disponible de forma resumida en `docs/prompts/README.md`: aplicar el plan sobre `docs/02-requisitos-no-funcionales.md` con los ajustes humanos y sin introducir decisiones tecnicas posteriores.

## Resultado

- Modificado `docs/02-requisitos-no-funcionales.md`.
- Requisitos no funcionales completados como marco proporcionado de calidad y seguridad.
- Incorporado el enfoque de IA responsable y modo degradado.

## Commit / PR

```text
docs: definir requisitos no funcionales del MVP
```
