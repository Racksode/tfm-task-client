# Histórico IA - Documentación funcional: diagramas UML

## Estado

`Resumen reconstruido a partir de la trazabilidad disponible`.

Fase documental C (y cierre) del plan de documentación funcional/UX.

## Resumen del prompt

Tras completar y mergear las fases de casos de uso y de pantallas/navegación (incluida la corrección del estado del login detectada en revisión), el usuario pidió pasar a la fase C: diagramas UML, con diagramas en Mermaid y trabajando en su propia rama.

## Revisión humana

El usuario aprobó el plan por fases y el formato Mermaid en la conversación previa. Se acordó crear la rama antes de cualquier commit, tras una incidencia anterior de commit directo a main.

## Restricciones indicadas

- Documentación únicamente; sin cambios de código, esquema, migraciones, CI ni dependencias.
- Mantener el alcance del MVP; no inventar casos de uso ni flujos.
- No duplicar el estado de implementación; los diagramas reflejan el comportamiento objetivo y el estado real vive en `docs/10` y `docs/11`.

## Resultado

Se creó `docs/12-diagramas-uml.md` con:

- diagrama de casos de uso (actores ↔ CU) con frontera de sistema;
- diagrama de secuencia de start/stop con prevención de solapamiento (CU-07);
- diagrama de secuencia de reporte con resumen IA y caso de fallo (CU-09, CU-10);
- diagrama de secuencia de consulta restringida como cliente (CU-11);
- matriz de trazabilidad diagrama ↔ CU ↔ reglas.

Se enlazó el documento desde el índice de `README.md` y se registró el plan en `docs/planes/19-documentacion-diagramas-uml.md`.

## Fuera de alcance

- Historias de usuario y matriz de trazabilidad hasta tests (opcional, no abordado).

## Commit o PR previsto

```text
docs: añadir diagramas UML de casos de uso y secuencia
```
