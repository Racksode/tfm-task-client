# Instrucciones para agentes IA

Este documento define las normas que deben seguir los agentes IA que trabajen sobre este repositorio.

El proyecto corresponde a un Trabajo Final de Máster, por lo que debe priorizarse un MVP funcional, defendible y limitado.

## Estado y continuidad

Al iniciar una sesión, para reconstruir el contexto (estado actual, decisiones en vigor y próximos pasos), consulta primero [docs/estado-proyecto.md](docs/estado-proyecto.md) y el bloque "Estado actual" del `README.md`. Es la fuente de verdad compartida entre equipos (la memoria del asistente es local y no se sincroniza).

Al cerrar cada PR, sigue el **checklist de cierre** de `docs/estado-proyecto.md` (validar, bump de versión, actualizar README y ese documento, registrar en `docs/planes/` e `docs/historico-ia/`).

## Desarrollo por fases y control de alcance

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
- Antes de introducir nuevas fases técnicas relevantes, revisar las notas de planificación en `docs/notas/`, especialmente las relacionadas con skills, CI/CD o metodología de trabajo. Si una tarea alcanza el punto definido para introducir skills, CI o CD, avisarlo explícitamente y proponer una tarea separada; no implementarlos sin aprobación previa.

## Trabajo en modo plan

Antes de ejecutar una tarea relevante, el agente deberá responder con:

1. Objetivo del cambio.
2. Ficheros afectados.
3. Pasos propuestos.
4. Riesgos o dudas.
5. Posible commit asociado.

No se deben modificar ficheros importantes hasta que el plan haya sido revisado y aprobado.

Cuando un plan importante sea aprobado y aplicado, deberá registrarse en dos niveles:

- `docs/planes/`: resumen metodológico breve y formal.
- `docs/historico-ia/`: histórico ampliado del trabajo con IA, incluyendo cuando proceda prompt enviado, plan propuesto, revisión humana, prompt de aplicación, resultado y commit o PR.

No es necesario registrar cambios menores, correcciones tipográficas simples o ajustes sin impacto.

## Documentación formativa

Cuando una tarea introduzca una decisión técnica, infraestructura, dependencia, patrón de arquitectura, migración, integración, herramienta nueva o un cambio relevante del flujo de trabajo, se deberá crear o actualizar una nota formativa en `docs/notas/`, ya sea en la misma tarea o proponiéndola como tarea posterior cuando convenga separar implementación y documentación.

La nota debe explicar brevemente qué se ha hecho, por qué, qué archivos o conceptos intervienen, qué implicaciones tiene para el proyecto y qué queda sin implementar, si aplica. No debe presentar como implementado nada que no exista realmente.

No es necesario crear una nota para cambios menores, correcciones de texto, ajustes triviales o cambios sin impacto técnico. Este tipo de documentación debe mantenerse en `docs/notas/`; no se debe crear `docs/guias/`.

## Criterio de alcance

Antes de incorporar una funcionalidad, deberá clasificarse como:

- Imprescindible para el MVP.
- Recomendable pero aplazable.
- Línea futura del producto SaaS.
- Descartada para el TFM.

Solo las funcionalidades imprescindibles para el MVP deberán implementarse durante el TFM.

## Prevención de sobrealcance por IA

Los agentes IA no deben proponer ni implementar funcionalidades adicionales solo porque sean técnicamente posibles o rápidas de generar.

Antes de incorporar cualquier funcionalidad nueva, deberá clasificarse según:

- Valor para el MVP.
- Coste de implementación.
- Coste de mantenimiento.
- Riesgo de complejidad.
- Impacto en seguridad.
- Valor comercial futuro.
- Categoría: TFM, SaaS futuro, experimentación o descartada.

El chat con IA no es fuente de verdad del proyecto. Solo se considerarán decisiones aceptadas aquellas que estén reflejadas en la documentación del repositorio.

Los agentes deberán evitar:

- Ampliar el MVP por iniciativa propia.
- Convertir líneas futuras en funcionalidades actuales.
- Generar documentación extensa sin utilidad clara.
- Crear nuevos documentos sin necesidad justificada.
- Sobrediseñar la arquitectura.
- Proponer integraciones externas como parte del MVP si están marcadas como futuras.

El criterio principal será:

> Mejor un MVP pequeño, completo y defendible que un producto grande, incompleto y difícil de justificar.

## Disciplina de desarrollo

El proyecto debe desarrollarse por fases cerradas y verificables.

No se debe trabajar "como si no hubiera un mañana", añadiendo funcionalidades de forma continua solo porque la IA permite generarlas rápido.

El objetivo es construir un MVP pequeño, completo y defendible, no una plataforma SaaS completa en una primera entrega.

## Prompts documentados

Los prompts reutilizables del proyecto se documentan en:

```text
docs/prompts/README.md
```
