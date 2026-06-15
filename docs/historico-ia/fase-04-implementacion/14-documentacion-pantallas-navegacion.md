# Histórico IA - Documentación funcional: pantallas y navegación

## Estado

`Resumen reconstruido a partir de la trazabilidad disponible`.

Fase documental B del plan de documentación funcional/UX.

## Resumen del prompt

Tras cerrar y mergear la fase de casos de uso, el usuario pidió pasar a la siguiente fase del plan acordado: definición de pantallas y navegación, con diagramas en Mermaid.

## Revisión humana

El usuario aprobó el plan por fases y el formato Mermaid en la conversación previa. La fase A se validó y mergeó antes de iniciar esta.

## Restricciones indicadas

- Documentación únicamente; sin cambios de código, esquema, migraciones, CI ni dependencias.
- Mantener el alcance del MVP; no inventar pantallas fuera de los casos de uso.
- Reflejar el estado real de implementación (`/`, `/users`, login NextAuth) sin presentar como hecho lo pendiente.

## Resultado

Se creó `docs/11-pantallas-y-navegacion.md` con:

- inventario de pantallas con ruta, rol, CU y estado;
- sitemap en Mermaid separado por rol;
- ficha por pantalla (contenido, campos, acciones, validaciones, estados, visibilidad);
- estados de UI comunes;
- flujos de navegación en Mermaid (demo, start/stop, consulta como cliente);
- matriz de trazabilidad pantalla ↔ caso de uso.

Se enlazó el documento desde el índice de `README.md` y se registró el plan en `docs/planes/18-documentacion-pantallas-navegacion.md`.

## Fuera de alcance

- Diagramas UML de casos de uso y secuencia (Fase C futura).
- Historias de usuario y trazabilidad hasta tests (opcional, no abordado).

## Commit o PR previsto

```text
docs: definir pantallas y navegación del MVP
```
