# Plan 20 - Documentación funcional: historias de usuario

## Objetivo

Completar la documentación funcional con las historias de usuario del MVP y una matriz de trazabilidad que enlace requisitos, casos de uso, historias, pantallas y pruebas.

Esta fase es documental. No modifica código, esquema de datos, migraciones, CI ni dependencias.

## Contexto

Tras los casos de uso (plan 17), las pantallas y navegación (plan 18) y los diagramas UML (plan 19), faltaba el catálogo de historias de usuario con criterios de aceptación y la trazabilidad completa.

Corresponde a la Fase D (opcional) del plan por fases de documentación funcional/UX.

## Alcance incluido

- `docs/13-historias-de-usuario.md` con:
  - convención de historia y prioridad MoSCoW;
  - catálogo HU-01…HU-15 con criterios de aceptación en formato Dado/Cuando/Entonces;
  - matriz de trazabilidad RF ↔ CU ↔ HU ↔ pantalla ↔ estado impl. ↔ test.
- Enlace al nuevo documento en el índice de `README.md`.

## Límites

- No se introducen historias ni funcionalidades fuera del MVP.
- No se modifica código, `prisma/schema.prisma`, migraciones, Auth, roles, CI ni dependencias.
- El estado de implementación y de pruebas refleja la realidad del repositorio: la columna de test figura como pendiente porque aún no hay herramienta de testing instalada.

## Resultado

El bloque de documentación funcional/UX queda completo: visión, requisitos, casos de uso, pantallas, diagramas y historias de usuario con trazabilidad.

## Commit previsto

```text
docs: añadir historias de usuario y matriz de trazabilidad
```
