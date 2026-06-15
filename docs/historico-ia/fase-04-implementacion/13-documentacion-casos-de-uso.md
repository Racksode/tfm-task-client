# Histórico IA - Documentación funcional: casos de uso

## Estado

`Resumen reconstruido a partir de la trazabilidad disponible`.

Fase documental A del plan de documentación funcional/UX.

## Resumen del prompt

El usuario pidió revisar el proyecto e identificar qué faltaba a nivel de documentación. Tras aclarar que se refería a documentación funcional (casos de uso, definición de pantallas, etc.), se acordó un plan por fases para cubrir casos de uso, pantallas/navegación y diagramas UML, empezando por los casos de uso y con diagramas en Mermaid.

## Revisión humana

El usuario aprobó el plan por fases y la prioridad de empezar por los casos de uso formales.

## Restricciones indicadas

- Documentación únicamente; sin cambios de código, esquema, migraciones, CI ni dependencias.
- Mantener el alcance del MVP; no inventar pantallas ni casos fuera de los RF.
- Reflejar el estado real de implementación sin presentar como hecho lo pendiente.

## Resultado

Se creó `docs/10-casos-de-uso.md` con:

- plantilla formal de caso de uso;
- catálogo CU-01…CU-12 alineado con RF-01…RF-13 y con el modelo de datos;
- catálogo de reglas de negocio RN-01…RN-22;
- matriz de trazabilidad CU ↔ RF;
- glosario del dominio.

Se enlazó el documento desde el índice de `README.md` y se registró el plan en `docs/planes/17-documentacion-casos-de-uso.md`.

## Fuera de alcance

- Definición de pantallas y navegación (Fase B futura).
- Diagramas UML de casos de uso y secuencia (Fase C futura).
- Historias de usuario y matriz de trazabilidad hasta tests (opcional, no abordado).

## Commit o PR previsto

```text
docs: añadir casos de uso formales del MVP
```
