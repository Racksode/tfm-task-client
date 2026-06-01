# Historico IA - Modelo de datos

## Estado del historico

Resumen reconstruido a partir de la trazabilidad disponible.

## Contexto

Bloque usado para definir el modelo de datos conceptual inicial del MVP antes de cerrar arquitectura y sin entrar en implementacion fisica.

## Prompt enviado

Prompt literal disponible en `docs/prompts/README.md`.

```text
Lee README.md, AGENTS.md, docs/00-vision-y-alcance.md, docs/01-requisitos-funcionales.md, docs/02-requisitos-no-funcionales.md y docs/09-plan-trabajo-y-control-alcance.md.

Quiero completar docs/03-modelo-datos.md con el modelo de datos conceptual inicial del MVP del TFM.

El modelo debe cubrir clientes, proyectos, tareas, registros de tiempo, tarifas, reportes, usuarios y area de cliente, manteniendo el alcance limitado al MVP.

No quiero todavia migraciones, SQL, Prisma, Drizzle ni decisiones tecnicas concretas de implementacion. Eso se trabajara mas adelante en arquitectura.

Primero propone un plan de secciones, entidades, relaciones principales y reglas de negocio que deberia contener el documento.

No edites, no crees y no borres ficheros todavia. Solo devuelve el plan.
```

## Plan propuesto por IA

Resumen reconstruido a partir de la trazabilidad disponible.

El plan proponia describir entidades principales, relaciones, reglas de negocio, privacidad, visibilidad, trazabilidad minima y decisiones aplazadas para arquitectura.

## Revision humana

- Cubrir clientes, proyectos, tareas, registros de tiempo, tarifas, reportes, usuarios, area de cliente, uso de IA y trazabilidad.
- Mantener el documento como modelo conceptual.
- Evitar SQL, migraciones, ORM, indices o tipos fisicos.

## Prompt de aplicacion

Prompt de aplicacion reconstruido: aplicar el plan sobre `docs/03-modelo-datos.md`, mantener el enfoque conceptual y no introducir decisiones tecnicas de implementacion.

## Resultado

- Modificado `docs/03-modelo-datos.md`.
- Modelo conceptual inicial completado.
- Decisiones fisicas y de implementacion aplazadas.

## Commit / PR

```text
docs: definir modelo de datos inicial
```
