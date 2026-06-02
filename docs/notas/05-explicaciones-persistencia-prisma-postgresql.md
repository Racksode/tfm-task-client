# Explicacion formativa de persistencia con Prisma y PostgreSQL

## 1. Que es la persistencia de datos

La persistencia de datos es la capacidad de una aplicacion para conservar informacion aunque el programa se cierre, el navegador se recargue o el servidor se reinicie.

Sin persistencia, los datos solo existirian en memoria durante la ejecucion. Por ejemplo, un cliente creado en una pantalla podria desaparecer al reiniciar la aplicacion.

En este TFM, la persistencia permite que el MVP pueda guardar informacion operativa como clientes, proyectos, tareas, tiempos registrados, tarifas, reportes estructurales y trazabilidad minima.

## 2. Por que el proyecto necesita una base de datos

El proyecto no es solo una pagina estatica. El objetivo del MVP es representar un CRM operativo con datos que deben mantenerse en el tiempo.

La base de datos permite:

- guardar clientes y proyectos
- relacionar tareas con proyectos
- asociar tiempos de trabajo a tareas y usuarios
- conservar tarifas aplicadas
- preparar reportes a partir de datos almacenados
- diferenciar informacion interna e informacion visible para cliente
- registrar trazabilidad minima de acciones relevantes

Por eso la persistencia es una parte necesaria del nucleo tecnico del proyecto, aunque en esta fase todavia no se hayan implementado pantallas ni CRUDs.

## 3. Papel de PostgreSQL

PostgreSQL es el motor de base de datos elegido para el MVP.

Su funcion es almacenar los datos reales del sistema en tablas relacionales. Esto encaja bien con el modelo del proyecto, porque las entidades estan claramente relacionadas:

- un cliente tiene proyectos
- un proyecto tiene tareas
- una tarea tiene registros de tiempo
- un usuario puede registrar tiempos
- un reporte pertenece a un cliente y puede pertenecer a un proyecto

PostgreSQL es adecuado para este caso porque ofrece integridad entre entidades, soporte para relaciones y consultas por cliente, proyecto, tarea o periodo.

## 4. Papel de Docker Compose

Docker Compose se usa para preparar PostgreSQL en local de forma reproducible.

Esto significa que no hace falta instalar PostgreSQL como servicio del sistema operativo. En su lugar, el proyecto define un contenedor con la configuracion necesaria:

- imagen `postgres:16`
- base de datos `tfm_task_client`
- usuario `postgres`
- contrasena `postgres`
- puerto local `5432`
- volumen persistente para conservar datos

El comando principal seria:

```bash
docker compose up -d
```

Esto levanta PostgreSQL en segundo plano. Cuando se quiera detener el entorno local:

```bash
docker compose down
```

Docker Compose ayuda a que el entorno sea mas facil de reproducir y explicar durante el TFM.

## 5. Papel de Prisma

Prisma es el ORM elegido para el proyecto.

Un ORM permite trabajar con la base de datos desde el codigo de la aplicacion usando modelos y tipos, en lugar de escribir SQL manualmente en cada operacion.

En este MVP, Prisma cumple tres funciones principales:

- definir el modelo fisico inicial en `prisma/schema.prisma`
- generar un cliente tipado para TypeScript
- preparar migraciones para crear o modificar tablas en PostgreSQL

Prisma no sustituye a la base de datos. PostgreSQL sigue siendo donde se guardan los datos. Prisma actua como una capa intermedia entre la aplicacion y PostgreSQL.

## 6. Relacion entre Next.js, Prisma y PostgreSQL

La relacion se puede resumir asi:

```text
Next.js -> Prisma -> PostgreSQL
```

Next.js es la aplicacion web.

Prisma es la herramienta que permite a la aplicacion comunicarse con la base de datos de forma tipada y organizada.

PostgreSQL es la base de datos donde se almacenan los datos.

En fases posteriores, cuando se implementen funcionalidades, una accion como crear una tarea seguiria esta idea general:

```text
Formulario o accion de servidor -> Prisma -> Tabla de tareas en PostgreSQL
```

En la fase actual no se han creado todavia formularios, endpoints ni casos de uso. Solo se ha preparado la infraestructura de persistencia.

## 7. Funcion de `.env.example`

El archivo `.env.example` sirve como plantilla de variables de entorno.

Incluye la variable:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tfm_task_client?schema=public"
```

Esta variable indica a Prisma como conectarse a PostgreSQL:

- protocolo: `postgresql`
- usuario: `postgres`
- contrasena: `postgres`
- host: `localhost`
- puerto: `5432`
- base de datos: `tfm_task_client`
- esquema: `public`

El archivo `.env.example` se versiona porque no contiene secretos reales del entorno personal. Sirve para que cualquier persona sepa que variables necesita configurar.

## 8. Por que no se versiona `.env`

El archivo `.env` real no debe versionarse porque puede contener credenciales, claves privadas o configuraciones especificas de cada entorno.

Aunque en desarrollo local la contrasena sea sencilla, la buena practica es no subir `.env` al repositorio.

La idea es:

- `.env.example`: plantilla publica y versionada
- `.env`: configuracion real local, no versionada

Asi se evita exponer secretos y se mantiene una separacion clara entre documentacion de configuracion y credenciales reales.

## 9. Funcion de `prisma.config.ts`

En Prisma 7, la configuracion de la conexion se gestiona desde `prisma.config.ts`.

Este archivo carga las variables de entorno con:

```ts
import "dotenv/config";
```

Y obtiene la URL de conexion con:

```ts
env("DATABASE_URL")
```

Esto evita dejar una URL hardcodeada dentro de la configuracion. La conexion depende de la variable `DATABASE_URL`, que puede cambiar segun el entorno.

Tambien indica donde esta el schema y donde se guardaran las migraciones:

```text
schema: prisma/schema.prisma
migrations: prisma/migrations
```

## 10. Funcion de `prisma/schema.prisma`

El archivo `prisma/schema.prisma` define el primer modelo fisico de datos.

Aqui se describen:

- modelos
- campos
- tipos de datos
- relaciones entre entidades
- enums de estado, rol o tipo
- configuracion del cliente Prisma
- proveedor de base de datos, en este caso PostgreSQL

Por ejemplo, el schema expresa que un `Project` pertenece a un `Client`, o que un `TimeEntry` pertenece a una `Task` y a un `User`.

Este archivo es una pieza central porque conecta el modelo conceptual del TFM con una estructura tecnica que despues podra convertirse en tablas reales de PostgreSQL.

## 11. Que son las migraciones

Una migracion es un cambio versionado en la estructura de la base de datos.

Por ejemplo, si el schema define una tabla `Client`, una migracion puede crear esa tabla en PostgreSQL. Si mas adelante se anade un campo nuevo, otra migracion puede aplicar ese cambio.

Las migraciones permiten que la estructura de la base de datos evolucione de forma controlada y reproducible.

En esta fase, la migracion inicial esta pendiente hasta tener Docker/PostgreSQL levantado correctamente.

El comando previsto es:

```bash
npm run prisma:migrate:dev -- --name init
```

## 12. Scripts Prisma anadidos

Se han anadido scripts para trabajar con Prisma desde npm:

```bash
npm run prisma:validate
```

Comprueba que el schema de Prisma es valido.

```bash
npm run prisma:generate
```

Genera el cliente Prisma tipado para TypeScript.

```bash
npm run prisma:migrate:dev
```

Crea y aplica migraciones en entorno de desarrollo.

```bash
npm run prisma:studio
```

Abre Prisma Studio, una interfaz visual para inspeccionar datos de la base de datos.

Estos scripts no implementan funcionalidad de negocio. Solo preparan y validan la infraestructura de persistencia.

## 13. Modelos iniciales definidos

El schema inicial incluye los siguientes modelos:

- `User`: representa usuarios internos y usuarios cliente.
- `Client`: representa clientes del sistema.
- `Project`: representa proyectos asociados a clientes.
- `Task`: representa tareas dentro de proyectos.
- `TimeEntry`: representa registros de tiempo asociados a tareas y usuarios.
- `Rate`: representa tarifas basicas para estimar costes.
- `Report`: representa una estructura minima de reporte.
- `AiUsage`: representa trazabilidad minima de usos de IA.
- `AuditLog`: representa trazabilidad minima de acciones relevantes.

Los modelos `Report`, `AiUsage` y `AuditLog` se han incluido de forma estructural minima. Esto no significa que ya existan reportes funcionales, integracion real con IA o auditoria avanzada.

## 14. Validaciones ejecutadas

Tras la configuracion se ejecutaron validaciones tecnicas:

```bash
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

Estas validaciones comprueban que:

- el schema Prisma es valido
- el cliente Prisma puede generarse
- TypeScript no detecta errores
- ESLint no detecta problemas relevantes
- la aplicacion Next.js sigue compilando

Esto demuestra que la incorporacion de Prisma no rompe el proyecto tecnico base.

## 15. Que queda pendiente

La migracion inicial queda pendiente hasta tener Docker/PostgreSQL levantado.

Tambien quedan pendientes, para fases posteriores y con plan aprobado:

- crear casos de uso reales
- implementar CRUDs
- conectar pantallas con datos
- configurar autenticacion real
- aplicar reglas de acceso por rol
- generar reportes funcionales
- integrar IA real
- definir pruebas automatizadas sobre reglas de negocio

Esta fase solo prepara la persistencia inicial. No convierte el proyecto en una aplicacion funcional completa todavia.

## 16. Como defender esta decision en el TFM

La decision se puede defender con estos argumentos:

- PostgreSQL encaja con un modelo relacional de clientes, proyectos, tareas y tiempos.
- Docker Compose facilita un entorno local reproducible sin instalar servicios manualmente.
- Prisma encaja con Next.js y TypeScript porque aporta modelos claros, cliente tipado y migraciones.
- `.env.example` documenta la configuracion necesaria sin exponer credenciales reales.
- `schema.prisma` conecta el modelo conceptual del TFM con una estructura fisica inicial.
- La fase mantiene el alcance controlado: prepara infraestructura, pero no implementa negocio prematuramente.

En resumen, esta fase da una base tecnica solida y defendible para que las siguientes fases puedan construir funcionalidades sobre datos persistentes sin sobredimensionar el MVP.
