## Desarrollo por fases y control de alcance

Este proyecto corresponde a un Trabajo Final de Máster, por lo que debe priorizarse un MVP funcional, defendible y limitado.

Los agentes IA deben respetar las siguientes normas:

- No añadir funcionalidades nuevas sin aprobación explícita.
- No ampliar el alcance del MVP por iniciativa propia.
- No convertir líneas futuras del SaaS en funcionalidades del TFM sin confirmación.
- Proponer primero un plan antes de modificar ficheros relevantes.
- Separar claramente funcionalidades del TFM y líneas futuras.
- Priorizar código sencillo, mantenible y justificable.
- Evitar sobrediseñar la solución.
- No implementar integraciones externas completas si están marcadas como evolución futura.
- Sugerir mejoras como pendientes o futuras, no implementarlas directamente.
- Mantener la documentación actualizada cuando cambie una decisión importante.

## Trabajo en modo plan

Antes de ejecutar una tarea relevante, el agente deberá responder con:

1. objetivo del cambio
2. ficheros afectados
3. pasos propuestos
4. riesgos o dudas
5. posible commit asociado

No se deben modificar ficheros importantes hasta que el plan haya sido revisado y aprobado.

## Criterio de alcance

Antes de incorporar una funcionalidad, clasificarla como:

- imprescindible para el MVP
- recomendable pero aplazable
- línea futura del producto SaaS
- descartada para el TFM

Solo las funcionalidades imprescindibles para el MVP deberán implementarse durante el TFM.

```md
## Prevención de sobrealcance por IA

Los agentes IA no deben proponer ni implementar funcionalidades adicionales solo porque sean técnicamente posibles o rápidas de generar.

Antes de incorporar cualquier funcionalidad nueva, deberá clasificarse según:

- valor para el MVP
- coste de implementación
- coste de mantenimiento
- riesgo de complejidad
- impacto en seguridad
- valor comercial futuro
- categoría: TFM, SaaS futuro, experimentación o descartada

El chat con IA no es fuente de verdad del proyecto. Solo se considerarán decisiones aceptadas aquellas que estén reflejadas en la documentación del repositorio.

Los agentes deberán evitar:

- ampliar el MVP por iniciativa propia
- convertir líneas futuras en funcionalidades actuales
- generar documentación extensa sin utilidad clara
- crear nuevos documentos sin necesidad justificada
- sobrediseñar la arquitectura
- proponer integraciones externas como parte del MVP si están marcadas como futuras

El criterio principal será:

> Mejor un MVP pequeño, completo y defendible que un producto grande, incompleto y difícil de justificar.
```

## Disciplina de desarrollo

El proyecto debe desarrollarse por fases cerradas y verificables.

No se debe trabajar ?como si no hubiera un mañana?, añadiendo funcionalidades de forma continua solo porque la IA permite generarlas rápido.

El objetivo es construir un MVP pequeño, completo y defendible, no una plataforma SaaS completa en una primera entrega.

## Referencia documental

Las normas completas de planificación y control de alcance se documentan en:

```text
docs/09-plan-trabajo-y-control-alcance.md
```
