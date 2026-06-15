# Plan 18 - Documentación funcional: pantallas y navegación

## Objetivo

Crear la documentación de pantallas y navegación del MVP, continuando el plan por fases de documentación funcional/UX iniciado con los casos de uso.

Esta fase es documental. No modifica código, esquema de datos, migraciones, CI ni dependencias.

## Contexto

Tras formalizar los casos de uso (`docs/10-casos-de-uso.md`, plan 17), faltaba la capa de definición de pantallas: inventario, contenido por pantalla, estados de UI y flujos de navegación.

Plan por fases de documentación funcional/UX:

- Fase A: casos de uso formales (completada, plan 17).
- Fase B (esta): pantallas y navegación.
- Fase C (futura): diagramas UML (casos de uso y secuencia).

## Alcance incluido

- `docs/11-pantallas-y-navegacion.md` con:
  - inventario de pantallas (ruta, rol, CU, estado);
  - mapa de pantallas (sitemap) en Mermaid, separado por rol interno y cliente;
  - ficha por pantalla (propósito, contenido, campos, acciones, validaciones, estados, visibilidad);
  - estados de UI comunes;
  - flujos de navegación en Mermaid (demo, start/stop con prevención de solapamiento, consulta como cliente);
  - matriz de trazabilidad pantalla ↔ caso de uso.
- Enlace al nuevo documento en el índice de `README.md`.

## Límites

- No se introducen pantallas ni funcionalidades fuera del MVP.
- No se modifica código, `prisma/schema.prisma`, migraciones, Auth, roles, CI ni dependencias.
- El campo `Estado` de cada pantalla refleja el estado real del repositorio.
- Las rutas pendientes son una propuesta coherente, ajustable en implementación.

## Resultado

El proyecto cuenta con una definición de pantallas y navegación enlazada con los casos de uso y la UI base ya implementada.

## Commit previsto

```text
docs: definir pantallas y navegación del MVP
```
