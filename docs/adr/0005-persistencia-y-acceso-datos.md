# ADR 0005 - Persistencia y acceso a datos

## Estado

Aceptada.

## Contexto

El ADR 0002 establece que el MVP usara una base de datos relacional, pero deja pendiente el motor concreto, el ORM y la estrategia de migraciones.

El modelo conceptual incluye relaciones claras entre usuarios, clientes, proyectos, tareas, registros de tiempo, tarifas, reportes, usos de IA y trazabilidad minima. Tambien existen reglas relevantes de integridad, visibilidad y calculo.

Antes de iniciar el proyecto base conviene cerrar una decision concreta, manteniendo el alcance limitado al MVP.

## Decision

Se decide utilizar:

- PostgreSQL como base de datos concreta del MVP.
- Prisma como ORM y herramienta de migraciones.
- Acceso a datos encapsulado dentro de la organizacion modular del proyecto.

Las consultas y operaciones de persistencia no deberan dispersarse directamente por la interfaz de usuario. Deberan quedar coordinadas desde los casos de uso, reglas de negocio o modulos de acceso a datos que correspondan.

La definicion del esquema fisico, los tipos exactos de columnas, indices, restricciones y migraciones queda aplazada a la fase de implementacion.

## Alternativas valoradas

### PostgreSQL

Encaja con el modelo relacional del MVP y con consultas por cliente, proyecto, tarea y periodo.

Ventajas:

- motor relacional maduro
- buen soporte para integridad referencial
- adecuado para reportes y agregaciones
- defendible para un sistema operativo de gestion

Inconvenientes:

- requiere entorno local o contenedor
- exige definir migraciones y esquema fisico durante la implementacion

Esta es la opcion seleccionada.

### SQLite

Podria simplificar el arranque local del proyecto.

Ventajas:

- configuracion inicial muy sencilla
- util para prototipos locales

Inconvenientes:

- menor alineacion con una aplicacion SaaS desplegable
- puede generar diferencias con el entorno final
- menos adecuada como decision principal para el TFM si se quiere justificar una base relacional de producto

No se selecciona para el MVP.

### MySQL o MariaDB

Tambien son alternativas relacionales validas.

Ventajas:

- ecosistema conocido
- soporte amplio en hosting

Inconvenientes:

- no aportan una ventaja clara frente a PostgreSQL para este caso
- PostgreSQL encaja mejor como opcion general para consultas relacionales, integridad y evolucion futura

No se seleccionan para el MVP.

### Prisma

Proporciona modelado, cliente tipado y migraciones dentro del ecosistema TypeScript.

Ventajas:

- buen encaje con Next.js y TypeScript
- reduce SQL repetitivo
- facilita migraciones controladas
- mejora la legibilidad del acceso a datos para un MVP academico

Inconvenientes:

- anade una capa de abstraccion
- puede ocultar detalles SQL que conviene entender
- requiere disciplina para no acoplar toda la logica de negocio al ORM

Esta es la opcion seleccionada.

### Drizzle

Es una alternativa TypeScript mas cercana a SQL.

Ventajas:

- control explicito de consultas
- tipado fuerte
- menor sensacion de caja negra que otros ORM

Inconvenientes:

- puede requerir mas decisiones manuales desde el inicio
- Prisma resulta mas directo para comenzar un MVP con migraciones y cliente tipado

No se selecciona para el MVP.

### SQL directo

Permite control total sobre las consultas.

Ventajas:

- maxima transparencia
- sin dependencia de ORM

Inconvenientes:

- mas codigo repetitivo
- mayor riesgo de inconsistencias
- exige resolver manualmente tipado, validacion de consultas y migraciones

No se selecciona para el MVP.

## Consecuencias

La implementacion posterior debera crear el esquema Prisma y las migraciones de forma coherente con el modelo conceptual existente.

Si durante la implementacion aparece una diferencia entre el modelo conceptual y el esquema fisico, debera documentarse como ajuste tecnico, sin ampliar el alcance funcional del MVP.

Quedan aplazados:

- esquema Prisma
- migraciones
- datos iniciales
- indices y restricciones fisicas definitivas
- estrategia concreta de borrado o archivado
- optimizaciones de rendimiento
