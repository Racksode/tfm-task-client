# ADR 0002 - Eleccion de base de datos

## Estado

Aceptada.

## Contexto

El MVP debe almacenar y consultar informacion relacionada con usuarios, clientes, proyectos, tareas, registros de tiempo, tarifas, reportes, usos de IA y trazabilidad minima.

El modelo conceptual definido en `docs/03-modelo-datos.md` contiene relaciones claras entre entidades. Tambien existen reglas relevantes de integridad, visibilidad y calculo:

- un cliente tiene proyectos
- un proyecto tiene tareas
- una tarea tiene registros de tiempo
- un registro de tiempo pertenece a un usuario interno
- un reporte pertenece a un cliente y puede asociarse a un proyecto
- el usuario cliente solo puede ver informacion asociada a su cliente y marcada como visible
- los costes se estiman a partir de tarifas y tiempos registrados

La decision debe ser suficiente para orientar la arquitectura, pero no debe adelantar todavia detalles de implementacion como motor concreto, ORM, migraciones o tipos fisicos.

## Decision

Se decide utilizar una **base de datos relacional** para el MVP.

No se decide todavia:

- motor concreto de base de datos
- ORM
- estrategia de migraciones
- tipos fisicos de columnas
- indices
- restricciones fisicas definitivas
- estrategia exacta de borrado

Opciones como Prisma, Drizzle o acceso SQL directo se evaluaran en una fase posterior, cuando comience la implementacion tecnica.

## Alternativas valoradas

### Base de datos relacional

Encaja con el modelo del MVP porque las entidades tienen relaciones claras y reglas de integridad importantes.

Ventajas:

- facilita integridad referencial
- permite consultas por cliente, proyecto, tarea y periodo
- encaja con reportes de horas y costes
- facilita controlar visibilidad de informacion para cliente
- es una decision defendible para un sistema de gestion operativa

Inconvenientes:

- requiere disenar el esquema fisico posteriormente
- puede exigir migraciones y restricciones cuando empiece la implementacion

### Base de datos documental

Podria ser util para datos poco estructurados o documentos flexibles.

Ventajas:

- flexibilidad inicial
- posible comodidad para almacenar estructuras variables

Inconvenientes:

- peor encaje con relaciones entre clientes, proyectos, tareas y tiempos
- mayor riesgo de inconsistencias
- menos adecuada para consultas relacionales y agregaciones del MVP

No se selecciona para el MVP.

### Enfoque hibrido

Combinaria una base relacional con almacenamiento documental u otros sistemas.

Ventajas:

- podria ser util en una evolucion futura con documentos, adjuntos o analitica

Inconvenientes:

- incrementa complejidad
- anade decisiones prematuras
- no es necesario para validar el MVP

No se selecciona para el MVP.

## Consecuencias

La base de datos relacional sera la referencia para disenar la persistencia del MVP.

Esta decision permite mantener coherencia con el modelo conceptual, soportar calculos de horas y costes, y aplicar reglas de visibilidad y trazabilidad de forma clara.

La eleccion concreta de motor, ORM y migraciones queda aplazada. Esta decision evita cerrar prematuramente detalles tecnicos que deben evaluarse durante la fase de implementacion.
