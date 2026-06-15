# Historico de trabajo con IA

> Carpeta interna de trazabilidad ampliada del trabajo realizado con agentes IA durante el TFM.

## Objetivo

Esta carpeta conserva un historico mas completo de los principales bloques de trabajo realizados con IA: prompts enviados, planes propuestos, revision humana, prompts de aplicacion, resultados y commits o PRs asociados.

No sustituye a la documentacion principal del proyecto, al historial de Git ni a `docs/planes/`.

## Diferencia con docs/planes/

`docs/planes/` mantiene una trazabilidad metodologica formal, breve y limpia de los planes principales.

`docs/historico-ia/` conserva mas contexto operativo sobre como se trabajo con IA en cada bloque relevante.

La documentacion principal del proyecto sigue siendo la fuente de verdad sobre requisitos, arquitectura, modelo de datos, integraciones, despliegue y alcance.

## Cuando registrar un historico

Se registraran los planes importantes generados con IA que afecten a fases, decisiones o bloques relevantes del proyecto.

No hace falta registrar cambios menores, correcciones tipograficas simples o ajustes sin impacto.

Los planes importantes se registran en dos niveles:

- `docs/planes/`: resumen metodologico breve y formal.
- `docs/historico-ia/`: historico ampliado del trabajo con IA.

## Tipos de historico

Cada bloque indica uno de estos estados:

- `Plan literal disponible`: el plan original esta disponible literalmente.
- `Reconstruccion estructurada del plan`: no consta el plan literal, pero puede reconstruirse la secuencia de trabajo.
- `Resumen reconstruido a partir de la trazabilidad disponible`: solo existen prompts, ajustes, resultados o planes resumidos.

## Metodologia registrada

El flujo metodologico documentado es:

1. Se pide un plan a la IA.
2. El usuario revisa el plan.
3. Se aplican ajustes humanos.
4. Se aprueba la ejecucion.
5. La IA aplica los cambios.
6. Se revisa el diff.
7. Se hace commit y, si procede, PR.

## Indice

### Fase 02 - Documentacion

- [Requisitos funcionales](fase-02-documentacion/01-requisitos-funcionales.md)
- [Requisitos no funcionales](fase-02-documentacion/02-requisitos-no-funcionales.md)
- [Modelo de datos](fase-02-documentacion/03-modelo-datos.md)
- [Arquitectura](fase-02-documentacion/04-arquitectura.md)

### Fase 03 - Decisiones tecnicas

- [Decisiones tecnicas iniciales](fase-03-decisiones-tecnicas/01-decisiones-tecnicas-iniciales.md)

### Fase 03 - Mantenimiento

- [Planes y prompts](fase-03-mantenimiento/01-planes-y-prompts.md)
- [Ampliar trazabilidad de planes](fase-03-mantenimiento/02-ampliar-trazabilidad-planes.md)

### Fase 04 - Implementacion

- [Proyecto tecnico base](fase-04-implementacion/01-proyecto-tecnico-base.md)
- [Persistencia inicial con Prisma](fase-04-implementacion/02-persistencia-inicial-prisma.md)
- [Capa de acceso a datos con Prisma](fase-04-implementacion/03-capa-acceso-datos-prisma.md)
- [CI basica con GitHub Actions](fase-04-implementacion/04-ci-basica-github-actions.md)
- [Prerrequisito de credenciales para auth](fase-04-implementacion/05-prerrequisito-credenciales-auth.md)
- [Autenticacion minima](fase-04-implementacion/06-auth-minima.md)
- [Bootstrap del primer usuario](fase-04-implementacion/07-bootstrap-primer-usuario.md)
- [Usuarios minimos](fase-04-implementacion/08-usuarios-minimos.md)
- [Backlog de mejoras futuras](fase-04-implementacion/09-backlog-mejoras-futuras.md)
- [Plan de roles basicos](fase-04-implementacion/10-plan-roles-basicos.md)
- [Cierre de roles basicos](fase-04-implementacion/11-cierre-roles-basicos.md)
- [UI base reutilizable v1](fase-04-implementacion/12-ui-base-reutilizable-v1.md)
- [Documentacion: casos de uso](fase-04-implementacion/13-documentacion-casos-de-uso.md)
- [Documentacion: pantallas y navegacion](fase-04-implementacion/14-documentacion-pantallas-navegacion.md)
- [Documentacion: diagramas UML](fase-04-implementacion/15-documentacion-diagramas-uml.md)
