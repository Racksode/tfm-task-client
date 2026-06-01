# Historico IA - Requisitos funcionales

## Estado del historico

Resumen reconstruido a partir de la trazabilidad disponible.

## Contexto

Bloque usado durante la definicion funcional del MVP para completar `docs/01-requisitos-funcionales.md` manteniendo el alcance limitado al TFM.

## Prompt enviado

Prompt literal disponible en `docs/prompts/README.md`.

```text
Lee README.md, AGENTS.md, docs/00-vision-y-alcance.md y docs/09-plan-trabajo-y-control-alcance.md.

Quiero completar docs/01-requisitos-funcionales.md con el alcance realista del MVP del TFM.

Primero propone un plan de secciones y requisitos.

No edites, no crees y no borres ficheros todavia. Solo devuelve el plan.
```

## Plan propuesto por IA

Resumen reconstruido a partir de la trazabilidad disponible.

El plan proponia definir alcance funcional del MVP, actores principales, requisitos funcionales, casos de uso, reglas relevantes, clasificacion de funcionalidades y criterios de aceptacion.

## Revision humana

- Sustituir "CRUD" por "gestion basica" cuando fuera posible.
- Mantener la prueba de lenguaje natural como prueba conceptual interna.
- Evitar integraciones externas y ejecucion automatica de acciones.
- Anadir una tabla de clasificacion de funcionalidades.
- No adelantar campos tecnicos ni modelo de datos.

## Prompt de aplicacion

Prompt de aplicacion disponible de forma resumida en `docs/prompts/README.md`: aplicar el plan sobre `docs/01-requisitos-funcionales.md` con los ajustes humanos y mantener el alcance limitado al MVP.

## Resultado

- Modificado `docs/01-requisitos-funcionales.md`.
- Requisitos funcionales del MVP completados.
- Separacion explicita entre funcionalidades del TFM y lineas futuras.

## Commit / PR

```text
docs: definir requisitos funcionales del MVP
```
