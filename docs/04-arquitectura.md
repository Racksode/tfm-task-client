# Arquitectura

> Arquitectura inicial del MVP del TFM.
> Define la estructura tecnica prevista, las capas internas, los modulos principales y las decisiones de diseno necesarias para comenzar la implementacion sin sobredimensionar el proyecto.

## 1. Introduccion

Este documento describe la arquitectura inicial del MVP del Trabajo Final de Master.

La arquitectura se basa en los requisitos funcionales definidos en `docs/01-requisitos-funcionales.md`, los requisitos no funcionales definidos en `docs/02-requisitos-no-funcionales.md` y el modelo conceptual descrito en `docs/03-modelo-datos.md`.

El objetivo no es definir todavia codigo, migraciones, infraestructura final ni una plataforma SaaS completa. El objetivo es establecer una base tecnica suficiente para construir un MVP pequeno, coherente y defendible.

Las decisiones principales asociadas a esta arquitectura se documentan tambien en:

- `docs/adr/0001-eleccion-arquitectura.md`
- `docs/adr/0002-eleccion-base-datos.md`
- `docs/adr/0003-integracion-ia.md`

## 2. Principios de arquitectura

La arquitectura del MVP seguira estos principios:

- Mantener el alcance limitado al TFM.
- Priorizar simplicidad, mantenibilidad y claridad.
- Organizar el sistema por dominios funcionales.
- Separar responsabilidades internas sin introducir complejidad distribuida.
- Proteger la informacion interna y la informacion visible para cliente.
- Mantener la IA como apoyo revisable, no como fuente de verdad.
- Evitar decisiones prematuras propias de un SaaS comercial completo.

El criterio principal sera construir una aplicacion funcional y demostrable, no una infraestructura preparada para una escala que todavia no existe.

## 3. Decision arquitectonica inicial

La arquitectura inicial del MVP sera un **monolito modular organizado por dominios funcionales**.

Esto significa que la aplicacion se desarrollara como un unico sistema desplegable, pero con separacion interna clara entre modulos, capas y responsabilidades.

No se plantea para el MVP:

- una arquitectura distribuida
- microservicios
- dos aplicaciones completamente independientes para frontend y backend
- servicios separados por dominio
- infraestructura avanzada de orquestacion o mensajeria

La separacion sera interna. El sistema debera distinguir entre interfaz, validacion, casos de uso, reglas de negocio, acceso a datos, integracion con IA y trazabilidad, pero sin convertir cada responsabilidad en una aplicacion independiente.

Este enfoque permite reducir complejidad tecnica, facilitar la defensa del TFM y mantener abierta una evolucion futura si el producto SaaS llega a necesitarla.

## 4. Modulos funcionales principales

El monolito modular se organizara alrededor de los dominios principales del MVP.

### 4.1. Clientes

Gestionara la informacion basica de clientes, su estado, datos de contacto, observaciones internas y relacion con proyectos, tareas y reportes.

### 4.2. Proyectos

Agrupara el trabajo asociado a cada cliente. Permitira organizar tareas, tiempos y reportes dentro de un contexto funcional.

### 4.3. Tareas

Representara la unidad principal de trabajo. Incluiria estado, prioridad basica, visibilidad para cliente y relacion con registros de tiempo.

### 4.4. Tiempos

Gestionara registros manuales y registros generados mediante start/stop. Incluira la regla principal de prevencion de solapamientos: por defecto, un usuario interno solo puede tener una tarea activa.

### 4.5. Tarifas y costes

Permitira aplicar tarifas basicas para estimar costes a partir de los tiempos registrados. No sustituira a un sistema de facturacion.

### 4.6. Reportes

Permitira generar reportes basicos en pantalla por cliente, proyecto opcional y periodo, incluyendo tareas, tiempos, horas totales, coste estimado y resumen revisable.

### 4.7. Area de cliente

Permitira que el usuario cliente consulte solo la informacion asociada a su cliente y marcada explicitamente como visible.

### 4.8. IA controlada

Gestionara los usos de IA incluidos en el MVP:

- generacion de resumen profesional para reportes
- prueba conceptual interna de interpretacion de lenguaje natural

La IA no ejecutara acciones reales de forma automatica.

### 4.9. Trazabilidad minima

Registrara acciones relevantes para facilitar revision, depuracion y defensa academica del MVP. No se plantea como auditoria avanzada.

## 5. Capas internas

Aunque el MVP se implemente como un unico sistema, debera mantener separacion interna de responsabilidades.

### 5.1. Interfaz de usuario

Contendra las pantallas y formularios necesarios para los flujos principales:

- gestion de clientes, proyectos y tareas
- registro manual de tiempos
- inicio y parada de tareas
- generacion y consulta de reportes
- revision de resultados generados por IA
- consulta del area de cliente

### 5.2. Validacion

Centralizara la validacion de entradas de usuario antes de procesarlas o almacenarlas.

La validacion sera especialmente importante en formularios, registros de tiempo, filtros de reportes e instrucciones de lenguaje natural.

### 5.3. Casos de uso y logica de aplicacion

Coordinara los flujos principales del sistema, por ejemplo:

- crear cliente, proyecto o tarea
- registrar tiempo manual
- iniciar o detener una tarea
- generar reporte
- solicitar resumen asistido por IA
- obtener informacion visible para cliente

### 5.4. Reglas de negocio

Concentrara las reglas criticas del MVP:

- un cliente solo ve informacion asociada a el y marcada como visible
- una tarea pertenece a un proyecto
- un registro de tiempo pertenece a una tarea y a un usuario interno
- la duracion registrada debe ser positiva
- no debe haber solapamientos de tareas activas por usuario interno
- la IA no ejecuta acciones automaticamente

### 5.5. Acceso a datos

Encapsulara la lectura y escritura sobre la base de datos.

No se decide todavia si se usara Prisma, Drizzle, acceso SQL directo u otra estrategia. Esa decision se evaluara en una fase posterior.

### 5.6. Integracion IA

Contendra la comunicacion con el proveedor o mecanismo de IA que se decida posteriormente.

Esta capa debera limitar el contexto enviado, gestionar errores y permitir que el sistema funcione en modo degradado si la IA no esta disponible.

### 5.7. Trazabilidad y errores

Permitira registrar acciones relevantes y tratar errores sin exponer informacion sensible al usuario.

No se implementara una plataforma avanzada de observabilidad en el MVP.

## 6. Persistencia y modelo de datos

El MVP usara una **base de datos relacional**.

Esta decision encaja con el modelo conceptual existente, que incluye relaciones claras entre usuarios, clientes, proyectos, tareas, registros de tiempo, tarifas, reportes, usos de IA y trazabilidad.

La base de datos relacional facilita:

- integridad entre entidades
- consultas por cliente, proyecto, tarea y periodo
- calculo de horas y costes estimados
- control de visibilidad para el area de cliente
- trazabilidad minima de acciones relevantes

En esta fase no se decide todavia:

- motor concreto de base de datos
- ORM
- migraciones
- tipos fisicos de columnas
- indices
- restricciones fisicas definitivas
- estrategia exacta de borrado

Opciones como Prisma, Drizzle o acceso SQL directo se evaluaran posteriormente, cuando comience la fase de implementacion tecnica.

## 7. Autenticacion, autorizacion y visibilidad

El MVP debera diferenciar como minimo entre:

- usuario interno
- usuario cliente

El usuario interno podra gestionar clientes, proyectos, tareas, tiempos, tarifas basicas y reportes.

El usuario cliente solo podra consultar informacion asociada a su cliente y marcada explicitamente como visible.

La arquitectura debera proteger especialmente:

- observaciones internas
- tareas no visibles
- proyectos no visibles
- reportes no visibles
- informacion de otros clientes
- resultados de IA no revisados o descartados

No se implementara una matriz avanzada de permisos durante el MVP.

## 8. Flujos principales del MVP

La arquitectura debera soportar los siguientes flujos principales:

1. Usuario interno crea cliente, proyecto y tarea.
2. Usuario interno registra tiempo manualmente sobre una tarea.
3. Usuario interno inicia y detiene una tarea mediante start/stop.
4. El sistema detiene la tarea activa anterior si el usuario inicia una nueva.
5. El sistema calcula horas y costes estimados.
6. Usuario interno genera un reporte por cliente, proyecto opcional y periodo.
7. Usuario interno solicita un resumen profesional asistido por IA.
8. Usuario interno revisa el resultado generado por IA antes de usarlo.
9. Usuario cliente accede al area privada y consulta solo informacion visible.
10. Usuario interno prueba una instruccion en lenguaje natural y recibe una propuesta estructurada no ejecutada automaticamente.

## 9. Integracion de IA

La IA del MVP queda limitada a dos usos:

- generacion de resumen profesional para reportes
- prueba conceptual interna de interpretacion de lenguaje natural

La IA no sera responsable de modificar datos por si misma.

Los resultados generados deberan ser revisables por el usuario interno antes de incorporarse a reportes o considerarse validos.

Si la IA falla, no esta configurada o no esta disponible, el sistema debera seguir permitiendo:

- gestionar clientes
- gestionar proyectos
- gestionar tareas
- registrar tiempos
- usar start/stop
- generar reportes basicos sin resumen asistido
- consultar el area de cliente

La integracion real con agentes externos, WhatsApp, email u otros canales queda fuera del MVP.

## 10. Seguridad y privacidad

La arquitectura debera aplicar buenas practicas proporcionadas al alcance del MVP.

Medidas principales:

- autenticacion obligatoria en zonas privadas
- control basico de acceso por rol
- visibilidad explicita para cliente
- validacion de entradas
- minimizacion de datos enviados a IA
- no almacenar secretos en codigo fuente
- no mostrar errores tecnicos sensibles al usuario
- trazabilidad minima de acciones relevantes

El MVP no pretende ser una solucion legalmente certificada ni una plataforma de cumplimiento avanzado, pero debe ser defendible desde el punto de vista de seguridad y privacidad.

## 11. Restricciones explicitas del MVP

Para evitar sobrealcance, quedan fuera de la arquitectura inicial:

- microservicios
- multiempresa avanzado
- integracion real con Holded
- agentes externos
- integraciones con WhatsApp o email
- ejecucion automatica de acciones por IA
- infraestructura avanzada
- orquestacion de servicios
- colas o mensajeria distribuida
- auditoria avanzada
- observabilidad avanzada
- facturacion propia
- pasarela de pago

Estas capacidades podran evaluarse como evolucion futura del SaaS, pero no forman parte de la arquitectura del MVP del TFM.

## 12. Testing previsto

La arquitectura debera facilitar pruebas sobre las reglas criticas del MVP.

Se priorizaran pruebas unitarias para:

- calculo de horas
- calculo de costes estimados
- validacion de registros de tiempo
- prevencion de solapamientos
- reglas de visibilidad
- comportamiento de IA sin ejecucion automatica

Tambien se contemplaran pruebas de integracion para:

- creacion de cliente, proyecto y tarea
- registro manual de tiempo
- inicio y parada de tarea
- generacion de reporte
- acceso de cliente solo a informacion visible
- generacion de resumen IA revisable

Las pruebas E2E son recomendables si el tiempo del TFM lo permite, pero no deben desplazar el desarrollo del nucleo del MVP.

## 13. Decisiones aplazadas

Quedan aplazadas para fases posteriores:

- framework o estructura concreta de proyecto
- proveedor de autenticacion
- motor concreto de base de datos
- ORM o estrategia de acceso a datos
- estrategia de migraciones
- proveedor concreto de IA
- formato exacto de prompts y respuestas
- despliegue final
- exportacion PDF
- monitorizacion avanzada
- auditoria avanzada
- multiempresa SaaS

Estas decisiones no deben introducirse como requisitos implicitos antes de que sean necesarias para implementar el MVP.

## 14. Evolucion futura

Si el MVP se valida y el producto evoluciona hacia un SaaS comercial, podrian reconsiderarse decisiones como:

- separacion real entre frontend y backend
- servicios independientes para dominios concretos
- multiempresa avanzado
- integraciones externas
- facturacion
- agentes IA externos
- auditoria completa
- observabilidad avanzada
- infraestructura escalable

Estas posibilidades no forman parte del TFM inicial.

## 15. Conclusion

La arquitectura inicial del MVP se basa en un monolito modular organizado por dominios funcionales.

Este enfoque permite construir una aplicacion web coherente, sencilla y defendible, manteniendo separacion interna suficiente sin asumir la complejidad de una arquitectura distribuida.

La base de datos relacional, la IA controlada y la trazabilidad minima dan soporte al nucleo funcional del TFM sin convertir el proyecto en un SaaS comercial completo antes de tiempo.
