# Histórico IA - Documentación funcional: historias de usuario

## Estado

`Resumen reconstruido a partir de la trazabilidad disponible`.

Fase documental D (opcional) del plan de documentación funcional/UX.

## Resumen del prompt

Tras cerrar casos de uso, pantallas/navegación, diagramas UML y la resincronización de índices, el usuario decidió hacer la Fase D: historias de usuario con criterios de aceptación y matriz de trazabilidad, trabajando en su propia rama.

## Revisión humana

El usuario eligió expresamente realizar la Fase D (opcional) antes de finalizar la nota de evolución de herramientas IA y de cerrar las incoherencias menores pendientes.

## Restricciones indicadas

- Documentación únicamente; sin cambios de código, esquema, migraciones, CI ni dependencias.
- Mantener el alcance del MVP; no inventar historias fuera de los requisitos.
- Reflejar el estado real: la columna de test figura como pendiente porque no hay herramienta de testing instalada.

## Resultado

Se creó `docs/13-historias-de-usuario.md` con:

- convención y prioridad MoSCoW;
- catálogo HU-01…HU-15 con criterios de aceptación Dado/Cuando/Entonces;
- matriz de trazabilidad RF ↔ CU ↔ HU ↔ pantalla ↔ estado impl. ↔ test.

Se enlazó el documento desde el índice de `README.md` y se registró el plan en `docs/planes/20-documentacion-historias-usuario.md`.

## Fuera de alcance

- Puesta en marcha de pruebas (pendiente; sin Vitest instalado).
- Finalización de la nota de evolución de herramientas IA y cierre de incoherencias menores (licencia, variables de entorno).

## Commit o PR previsto

```text
docs: añadir historias de usuario y matriz de trazabilidad
```
