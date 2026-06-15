# Plan 19 - Documentación funcional: diagramas UML

## Objetivo

Cerrar el plan por fases de documentación funcional/UX con la vista UML del MVP: diagrama de casos de uso y diagramas de secuencia de los flujos con lógica destacable.

Esta fase es documental. No modifica código, esquema de datos, migraciones, CI ni dependencias.

## Contexto

Tras los casos de uso (plan 17) y la definición de pantallas y navegación (plan 18), faltaba la representación UML que relacione actores con casos de uso y detalle los flujos clave.

Plan por fases de documentación funcional/UX:

- Fase A: casos de uso formales (completada, plan 17).
- Fase B: pantallas y navegación (completada, plan 18).
- Fase C (esta): diagramas UML.

## Alcance incluido

- `docs/12-diagramas-uml.md` con:
  - diagrama de casos de uso (actores ↔ CU) en Mermaid, con frontera de sistema;
  - diagrama de secuencia de start/stop con prevención de solapamiento (CU-07);
  - diagrama de secuencia de generación de reporte con resumen IA, incluyendo el caso de fallo de IA (CU-09, CU-10);
  - diagrama de secuencia de consulta restringida como cliente (CU-11);
  - matriz de trazabilidad diagrama ↔ caso de uso ↔ reglas.
- Enlace al nuevo documento en el índice de `README.md`.

## Límites

- No se introducen casos de uso ni flujos fuera del MVP.
- No se modifica código, `prisma/schema.prisma`, migraciones, Auth, roles, CI ni dependencias.
- Los diagramas reflejan el comportamiento objetivo; el estado real de implementación se mantiene en `docs/10` y `docs/11` y no se duplica aquí.

## Resultado

El proyecto cierra la documentación de análisis funcional/UX con una vista UML coherente con los casos de uso y las pantallas.

## Commit previsto

```text
docs: añadir diagramas UML de casos de uso y secuencia
```
