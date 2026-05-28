# ADR 0003 - Integracion de IA

## Estado

Aceptada.

## Contexto

El TFM pertenece a un master de desarrollo con IA, por lo que el proyecto debe incorporar inteligencia artificial de forma util y demostrable.

La IA debe aportar valor al flujo principal del MVP sin convertir el sistema en una plataforma de agentes, automatizaciones o integraciones externas.

Los requisitos funcionales y no funcionales establecen que:

- la IA debe actuar como apoyo a la redaccion
- los resultados deben ser revisables por el usuario interno
- la IA no debe ejecutar acciones reales de forma autonoma
- la fuente de verdad son los datos registrados en el sistema
- el sistema debe seguir siendo usable aunque la IA falle

## Decision

Se decide limitar la IA del MVP a dos usos:

1. **Generacion de resumen profesional para reportes.**
   La IA ayudara a transformar tareas, tiempos y descripciones internas en un texto profesional orientado al cliente.

2. **Prueba conceptual interna de lenguaje natural.**
   El usuario interno podra introducir una instruccion en lenguaje natural y el sistema devolvera una propuesta estructurada o revisable.

La IA no ejecutara acciones automaticamente.

Todo resultado generado por IA debera poder ser revisado, aceptado, editado o descartado por el usuario interno antes de incorporarse a un reporte o considerarse valido.

La integracion debera contemplar un modo degradado: si la IA falla, no esta configurada o no esta disponible, el nucleo del MVP debe seguir funcionando.

## Alternativas valoradas

### IA solo para resumen de reportes

Ventajas:

- alcance muy controlado
- integracion directa con el flujo principal de reportes
- bajo riesgo de sobrealcance

Inconvenientes:

- demuestra menos capacidad de interpretacion de lenguaje natural

### IA para resumen de reportes y prueba interna de lenguaje natural

Ventajas:

- mantiene la IA en un alcance acotado
- permite demostrar generacion de texto e interpretacion estructurada
- evita integraciones externas reales
- mantiene revision humana obligatoria

Inconvenientes:

- requiere disenar claramente los limites para que la prueba no se convierta en automatizacion real

Esta es la alternativa seleccionada.

### Agentes externos e integraciones reales

Incluiria canales como WhatsApp, email o agentes externos capaces de crear tareas, registrar tiempos o actualizar informacion.

Ventajas:

- mayor potencial comercial futuro
- experiencia de uso mas avanzada

Inconvenientes:

- alto riesgo de sobrealcance
- mayor complejidad de seguridad y permisos
- dependencias externas adicionales
- necesidad de confirmaciones, auditoria y control de errores mas complejos
- desvia el foco del MVP

Se descarta para el TFM inicial y queda como evolucion futura del SaaS.

## Consecuencias

La IA queda integrada en el MVP de forma limitada, util y defendible.

El sistema debera:

- enviar a IA solo el contexto necesario
- evitar almacenar informacion sensible innecesaria
- registrar un uso minimo de IA para trazabilidad
- permitir revision humana de resultados
- impedir ejecucion automatica de acciones
- seguir funcionando sin IA

Quedan fuera del MVP:

- agentes externos
- integraciones con WhatsApp o email
- automatizaciones completas
- toma de decisiones autonoma por IA
- ejecucion directa de acciones propuestas por lenguaje natural

Estas capacidades podran reevaluarse como lineas futuras del producto SaaS, pero no forman parte de la arquitectura inicial del TFM.
