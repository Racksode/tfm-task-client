# Plan 17 - Documentación funcional: casos de uso

## Objetivo

Crear documentación de análisis funcional que faltaba a nivel de casos de uso, ampliando los casos resumidos de `docs/01-requisitos-funcionales.md` a formato formal.

Esta fase es documental. No modifica código, esquema de datos, migraciones, CI ni dependencias.

## Contexto

El proyecto disponía de requisitos funcionales (RF-01…RF-13) y casos de uso en formato resumen (CU-01…CU-07), pero no de casos de uso detallados con flujos, excepciones y reglas asociadas.

Forma parte de un plan por fases para completar la documentación funcional/UX:

- Fase A (esta): casos de uso formales.
- Fase B (futura): definición de pantallas y navegación.
- Fase C (futura): diagramas UML (casos de uso y secuencia).

## Alcance incluido

- `docs/10-casos-de-uso.md` con:
  - plantilla formal por caso de uso (actor, estado, RF, precondiciones, flujo principal, flujos alternativos/excepción, postcondiciones, reglas);
  - catálogo CU-01…CU-12 alineado con RF y modelo de datos;
  - catálogo de reglas de negocio numeradas RN-01…RN-22, consolidando reglas dispersas en requisitos y modelo de datos;
  - matriz de trazabilidad CU ↔ RF;
  - glosario del dominio.
- Enlace al nuevo documento en el índice de `README.md`.

## Límites

- No se introducen funcionalidades nuevas ni casos de uso fuera del MVP.
- No se modifica `prisma/schema.prisma`, migraciones, Auth, roles, CI ni dependencias.
- El campo `Estado` de cada caso de uso refleja el estado real del repositorio y no presenta como hecho lo que no existe.
- El modelo de datos sigue siendo la fuente de verdad conceptual; este documento referencia sus reglas, no las redefine.

## Resultado

El proyecto cuenta con casos de uso formales que enlazan requisitos funcionales, reglas de negocio y, en fases posteriores, pantallas y diagramas.

## Commit previsto

```text
docs: añadir casos de uso formales del MVP
```
