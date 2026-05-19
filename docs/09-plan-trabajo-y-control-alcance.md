# Plan de trabajo, fases y control del alcance

> Documento interno de trabajo para el TFM.
> Define la forma de organizar el desarrollo, controlar el alcance y evitar que el proyecto crezca de forma descontrolada por el uso intensivo de herramientas de inteligencia artificial.

## 1. Objetivo del documento

Este documento define la metodología de trabajo para organizar el desarrollo del TFM por fases, establecer entregables concretos y controlar el alcance del proyecto.

El uso de herramientas de inteligencia artificial permite generar ideas, código, documentación y funcionalidades con mucha rapidez. Esto supone una ventaja importante, pero también puede provocar que el proyecto crezca más allá de lo razonable para un Trabajo Final de Máster.

Por este motivo, se establecen criterios claros para diferenciar:

- funcionalidades imprescindibles para el MVP del TFM
- funcionalidades recomendables pero aplazables
- líneas futuras del producto SaaS
- ideas descartadas o no prioritarias

## 2. Principio general

El proyecto se desarrollará por fases cerradas y controladas.

Cada fase deberá tener:

- un objetivo claro
- entregables concretos
- funcionalidades delimitadas
- criterios de finalización
- revisión antes de pasar a la siguiente fase

No se avanzará añadiendo funcionalidades de forma indefinida.

El objetivo no es construir el SaaS completo en el TFM, sino desarrollar un MVP funcional, defendible y técnicamente coherente.

## 3. Riesgo principal: crecimiento descontrolado con IA

Una de las principales ventajas del desarrollo asistido por IA es la velocidad para generar soluciones. Sin embargo, esa misma velocidad puede provocar varios riesgos:

- añadir funcionalidades no previstas
- sobredimensionar el proyecto
- generar más código del necesario
- mezclar funcionalidades del MVP con líneas futuras
- perder el foco del TFM
- dedicar demasiadas horas a mejoras no esenciales
- complicar la defensa final del proyecto

Por tanto, cualquier propuesta generada por IA deberá revisarse antes de incorporarse al proyecto.

```md
## 3.1. Riesgo de sobredefinición y falsa sensación de avance

Durante la definición del proyecto se ha identificado un riesgo específico asociado al uso intensivo de herramientas de inteligencia artificial: la tendencia a generar rápidamente documentación, funcionalidades, integraciones y líneas futuras, creando una falsa sensación de avance.

La documentación generada con IA puede ser útil, pero no debe confundirse con progreso real del producto.

El proyecto aplicará las siguientes reglas:

- La documentación no sustituye al avance real del MVP.
- No se añadirán funcionalidades al MVP sin validar su necesidad.
- Toda nueva idea deberá clasificarse como imprescindible, aplazable, futura o descartada.
- Las integraciones complejas se tratarán como evolución futura salvo justificación explícita.
- El chat con IA no será la fuente de verdad del proyecto.
- Las decisiones aceptadas deberán reflejarse en la documentación del repositorio.
- Cada funcionalidad deberá valorarse por coste, mantenimiento, riesgo y valor real.
- No se crearán documentos nuevos si no ayudan a construir o defender el TFM.

La reflexión completa sobre este riesgo se recoge en:

[docs/notas/03-reflexion-sobrealcance-ia.md](docs/notas/03-reflexion-sobrealcance-ia.md)
```

## 4. Clasificación de nuevas ideas o funcionalidades

Antes de incorporar una nueva funcionalidad, deberá clasificarse en una de estas categorías:

### 4.1. Imprescindible para el MVP

Funcionalidad necesaria para demostrar el núcleo del proyecto.

Ejemplos:

- gestión básica de clientes
- gestión básica de proyectos
- gestión de tareas
- registro de tiempos
- sistema start/stop
- generación de reportes
- área básica de cliente
- uso controlado de IA para generar resúmenes o reportes

### 4.2. Recomendable pero aplazable

Funcionalidad interesante, pero no necesaria para defender el TFM.

Ejemplos:

- filtros avanzados
- paneles estadísticos complejos
- notificaciones
- automatizaciones secundarias
- personalización avanzada de reportes

### 4.3. Línea futura del producto SaaS

Funcionalidad importante para una posible explotación comercial posterior, pero fuera del alcance inicial.

Ejemplos:

- integración completa con Holded
- integración con WhatsApp
- integración con agentes externos como OpenClaw o Hermes
- app móvil nativa
- multiempresa avanzado
- pasarela de pago
- sistema completo de facturación

### 4.4. Descartada para el TFM

Funcionalidad que no aporta valor suficiente al objetivo académico o que complica innecesariamente el proyecto.

## 5. Desarrollo por fases

El desarrollo del TFM se organizará en las siguientes fases.

### 5.1. Fase 1: definición y documentación inicial

Objetivo:

- definir la idea del proyecto
- concretar el alcance del MVP
- separar TFM y evolución futura
- preparar documentación inicial
- crear estructura del repositorio

Entregables:

- `README.md`
- `docs/00-vision-y-alcance.md`
- `docs/09-plan-trabajo-y-control-alcance.md`
- `docs/99-metodologia-documentacion.md`
- `.gitignore`
- `AGENTS.md`

Criterio de finalización:

- el alcance del TFM queda claramente definido
- las líneas futuras quedan separadas del MVP
- el repositorio tiene una estructura documental inicial coherente

### 5.2. Fase 2: diseño funcional

Objetivo:

- definir requisitos funcionales
- definir roles principales
- describir casos de uso
- preparar historias de usuario
- identificar entidades principales

Entregables:

- `docs/01-requisitos-funcionales.md`
- historias de usuario
- casos de uso principales
- flujo básico de gestión de clientes, tareas y tiempos

Criterio de finalización:

- el sistema está descrito desde el punto de vista funcional
- las funcionalidades del MVP están acotadas

### 5.3. Fase 3: diseño técnico y arquitectura

Objetivo:

- definir arquitectura inicial
- decidir stack tecnológico
- definir estructura de carpetas
- definir modelo de datos inicial
- documentar decisiones técnicas relevantes

Entregables:

- `docs/03-modelo-datos.md`
- `docs/04-arquitectura.md`
- ADRs iniciales en `docs/adr/`
- decisión sobre stack tecnológico

Criterio de finalización:

- existe una base técnica suficiente para comenzar el desarrollo
- las decisiones importantes están justificadas

### 5.4. Fase 4: implementación del núcleo del MVP

Objetivo:

- implementar las funcionalidades principales del sistema

Funcionalidades previstas:

- autenticación básica
- gestión de clientes
- gestión de proyectos
- gestión de tareas
- registro manual de tiempos
- control start/stop de tareas
- prevención de solapamientos
- cálculo básico de horas y costes

Criterio de finalización:

- el usuario interno puede registrar clientes, proyectos, tareas y tiempos
- el sistema permite controlar una tarea activa
- el sistema evita solapamientos salvo permisos específicos

### 5.5. Fase 5: integración de IA dentro del MVP

Objetivo:

- incorporar una funcionalidad de IA realista y defendible

Funcionalidades posibles:

- generación de resumen profesional de tareas
- conversión de notas técnicas en texto entendible para cliente
- propuesta de resumen para reporte de horas
- clasificación básica de tareas

Criterio de finalización:

- existe al menos una funcionalidad de IA integrada en el flujo real del sistema
- la IA aporta valor al caso de uso principal
- la acción de la IA puede revisarse o confirmarse por el usuario

### 5.6. Fase 6: área de cliente y reportes

Objetivo:

- permitir que el cliente consulte información visible
- generar reportes de tareas y tiempos

Funcionalidades previstas:

- área básica de cliente
- visualización de proyectos/tareas visibles
- consulta de reportes
- generación de reporte por periodo

Criterio de finalización:

- el cliente puede consultar información relevante
- el sistema puede generar un reporte básico de horas y tareas

### 5.7. Fase 7: testing, seguridad y calidad

Objetivo:

- revisar la calidad del sistema
- aplicar buenas prácticas de seguridad
- validar funcionalidades críticas

Aspectos a revisar:

- pruebas unitarias
- pruebas E2E si procede
- validaciones de datos
- control de permisos
- errores comunes
- OWASP Top Ten
- seguridad desde diseño
- revisión de código
- cobertura de pruebas en partes críticas

Criterio de finalización:

- las funcionalidades principales están validadas
- los riesgos básicos de seguridad están revisados
- existe documentación de pruebas

### 5.8. Fase 8: despliegue y preparación de entrega

Objetivo:

- desplegar una versión demostrable
- preparar la memoria y presentación del TFM

Entregables:

- aplicación desplegada o ejecutable en entorno local controlado
- instrucciones de instalación
- instrucciones de ejecución
- memoria del TFM
- presentación final
- demo preparada

Criterio de finalización:

- el proyecto puede demostrarse de forma clara
- la documentación explica qué se ha construido y por qué

## 6. Disciplina de trabajo

El desarrollo deberá organizarse en bloques concretos de trabajo, evitando sesiones improvisadas o excesivamente largas.

La IA se utilizará como apoyo para:

- analizar
- proponer
- generar borradores
- implementar partes concretas
- revisar código
- generar tests
- documentar decisiones

Pero no debe utilizarse como excusa para ir añadiendo funcionalidades sin planificación.

## 7. Trabajo en modo plan

Cuando se trabaje con agentes dentro del IDE, se priorizará el modo plan.

Antes de modificar ficheros importantes, el agente deberá indicar:

1. objetivo del cambio
2. ficheros afectados
3. pasos propuestos
4. riesgos o dudas
5. posible commit asociado

Después de revisar el plan, se podrá aprobar la ejecución.

## 8. Criterio de parada

Una fase se considerará finalizada cuando cumpla los objetivos definidos, no cuando se hayan añadido todas las ideas posibles.

Cualquier mejora no esencial se documentará como:

- pendiente
- mejora futura
- evolución del SaaS
- idea descartada para el TFM

El criterio principal será:

> Mejor un MVP pequeño, completo y defendible que un producto grande, incompleto y difícil de justificar.

## 9. Control de horarios y sostenibilidad personal

El proyecto deberá desarrollarse de forma sostenible.

Se evitará trabajar de forma descontrolada hasta altas horas sin objetivos claros.

Recomendaciones:

- trabajar por bloques concretos
- definir una tarea principal por sesión
- cerrar cada sesión con un pequeño resumen
- registrar decisiones importantes
- no abrir nuevas líneas de trabajo al final del día
- dejar las mejoras no urgentes anotadas para revisión posterior

La productividad no se medirá por la cantidad de funcionalidades generadas por IA, sino por el avance real hacia un MVP coherente.

## 10. Relación con la documentación

Cuando una decisión afecte al alcance, arquitectura, IA, seguridad o funcionalidades principales, deberá actualizarse la documentación correspondiente.

Ejemplos:

- si cambia el alcance, actualizar `docs/00-vision-y-alcance.md`
- si cambia la planificación, actualizar este documento
- si cambia una decisión técnica, crear o actualizar un ADR
- si cambia el uso de IA, actualizar `docs/05-ia.md`
- si cambia una integración futura, actualizar `docs/06-integraciones.md`

## 11. Relación con Git

Los cambios deberán agruparse en commits pequeños y descriptivos.

Ejemplos:

```text
docs: añadir plan de trabajo y control de alcance
docs: actualizar fases de desarrollo del TFM
feat: implementar gestión básica de clientes
fix: corregir validación de tiempos solapados
test: añadir pruebas para registros de tiempo
```

No se recomienda acumular grandes cambios sin commit.

## 12. Conclusión

Este documento actúa como mecanismo de control para mantener el proyecto dentro de un alcance razonable.

Su objetivo es evitar que el uso de IA derive en un desarrollo excesivamente ambicioso, disperso o difícil de finalizar.

El TFM debe demostrar capacidad de análisis, diseño, implementación, calidad, seguridad y uso responsable de IA, no la construcción completa de un SaaS comercial desde el primer día.

## Estado de avance

| Fase | Estado | Documento principal |
|---|---|---|
| Fase 1: definición y documentación inicial | Completada | `docs/00-vision-y-alcance.md` |
| Fase 2: diseño funcional | En curso | `docs/01-requisitos-funcionales.md` / `docs/02-requisitos-no-funcionales.md` |
| Fase 3: diseño técnico y arquitectura | Pendiente | `docs/03-modelo-datos.md` / `docs/04-arquitectura.md` |
| Fase 4: implementación MVP | Pendiente | `frontend/`, `backend/` |
| Fase 5: integración IA | Pendiente | `docs/05-ia.md` |
| Fase 6: área cliente y reportes | Pendiente | Pendiente |
| Fase 7: testing, seguridad y calidad | Pendiente | `docs/07-plan-pruebas.md` |
| Fase 8: despliegue y entrega | Pendiente | `docs/08-despliegue.md` |


### Punto actual

Actualmente el proyecto se encuentra en:

```text
Fase 2: diseño funcional
Punto 5.2: requisitos no funcionales
Documento en curso: docs/01-requisitos-funcionales.md
```