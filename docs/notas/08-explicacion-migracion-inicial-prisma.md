# Explicacion formativa de la migracion inicial de Prisma

## 1. Objetivo de esta nota

Esta nota explica que ocurrio al ejecutar la migracion inicial de Prisma en el proyecto.

El objetivo es entender por que era necesaria, que archivos genero y que significa dentro del TFM.

No describe una funcionalidad nueva de negocio. Solo explica un paso tecnico de persistencia: convertir el modelo definido en Prisma en estructura real dentro de PostgreSQL.

## 2. Que es una migracion en Prisma

Una migracion es una version controlada de un cambio en la estructura de la base de datos.

En Prisma, el archivo `prisma/schema.prisma` define modelos, campos, relaciones y enums. Pero definir esos modelos no crea automaticamente tablas en PostgreSQL.

Para que PostgreSQL tenga tablas reales, Prisma necesita transformar el schema en SQL. Ese SQL se guarda en una migracion.

De forma sencilla:

```text
prisma/schema.prisma -> migracion SQL -> tablas reales en PostgreSQL
```

Por eso no basta con tener modelos como `User`, `Client` o `Task` en el schema. Tambien hace falta ejecutar una migracion para materializar esa estructura en la base de datos.

## 3. Que existia antes de la migracion

Antes de ejecutar la migracion inicial ya existian varias piezas preparadas:

- `prisma/schema.prisma`
- modelos iniciales del MVP
- configuracion de Prisma compatible con Prisma 7
- dependencias de Prisma
- Docker Compose preparado para levantar PostgreSQL
- `.env` local con `DATABASE_URL`

El schema incluia modelos como:

- `User`
- `Client`
- `Project`
- `Task`
- `TimeEntry`
- `Rate`
- `Report`
- `AiUsage`
- `AuditLog`

Pero todavia faltaba un paso importante: generar y aplicar la primera migracion versionada.

Sin esa migracion, el modelo existia en el codigo, pero la base de datos PostgreSQL todavia no tenia necesariamente las tablas correspondientes.

## 4. Que se hizo

El flujo seguido fue:

1. Se comprobo que Docker Desktop estaba funcionando.
2. Se levanto PostgreSQL mediante Docker Compose.
3. Se ejecuto la migracion inicial con Prisma.
4. Prisma genero una carpeta dentro de `prisma/migrations/`.
5. Dentro de esa carpeta se creo el archivo `migration.sql`.
6. PostgreSQL quedo sincronizado con lo definido en `prisma/schema.prisma`.
7. Se validaron los comandos habituales del proyecto.

La migracion generada fue:

```text
prisma/migrations/20260602182233_init/migration.sql
```

Ese archivo contiene el SQL necesario para crear enums, tablas, claves primarias, claves foraneas e indices iniciales.

## 5. Por que Docker era necesario

PostgreSQL se ejecuta en este proyecto mediante Docker Compose.

Eso significa que la base de datos no esta instalada como servicio directo del sistema operativo. En su lugar, se levanta dentro de un contenedor local.

Para que Prisma pueda aplicar una migracion, PostgreSQL debe estar disponible. Por eso Docker Desktop y el contenedor de PostgreSQL tenian que estar funcionando.

Es importante diferenciar:

- Docker CLI: el comando `docker` disponible en la terminal.
- Docker Engine: el motor que realmente ejecuta los contenedores.

Puede ocurrir que el comando `docker` exista, pero el motor no este arrancado.

El error previo:

```text
open //./pipe/dockerDesktopLinuxEngine: El sistema no puede encontrar el archivo especificado
```

indicaba un problema de Docker Desktop o del motor Linux de Docker en Windows.

No era un error de Prisma ni del proyecto. La solucion fue abrir Docker Desktop y confirmar que el motor estaba funcionando.

## 6. Que hace el comando de migracion

El comando ejecutado fue:

```bash
npm run prisma:migrate:dev -- --name init
```

Se puede desglosar asi:

```text
npm run prisma:migrate:dev
```

Ejecuta el script definido en `package.json` para lanzar Prisma Migrate en modo desarrollo.

```text
--
```

Indica a npm que los argumentos siguientes deben pasarse al comando interno.

```text
--name init
```

Indica el nombre logico de la migracion.

Prisma combina ese nombre con un timestamp y genera una carpeta como:

```text
20260602182233_init
```

Dentro queda:

```text
migration.sql
```

Ese archivo es la version SQL del cambio estructural.

## 7. Que significa que la base de datos este sincronizada con el schema

Cuando Prisma indica que la base de datos esta sincronizada con el schema, significa que la estructura real de PostgreSQL coincide con lo definido en `prisma/schema.prisma`.

Esto quiere decir que ya existen tablas, enums y relaciones equivalentes al modelo inicial.

No significa que ya existan:

- pantallas
- CRUDs
- endpoints
- login
- area cliente
- reportes funcionales
- integracion real con IA
- logica de negocio

Solo significa que la base de datos ya tiene estructura para soportar fases posteriores.

## 8. Archivos generados o modificados automaticamente

El archivo principal generado fue:

```text
prisma/migrations/20260602182233_init/migration.sql
```

Este archivo debe versionarse porque representa la estructura inicial de la base de datos.

Tambien puede ocurrir que al ejecutar `npm run build`, Next.js actualice automaticamente `next-env.d.ts`.

Ese cambio puede modificar una referencia de tipos de desarrollo a tipos generados durante build.

Este tipo de cambio lo genera Next.js y no representa logica funcional del proyecto.

## 9. Por que es importante versionar las migraciones

Versionar migraciones es importante porque permite:

- reproducir la base de datos en otra maquina
- compartir la estructura de datos con otros desarrolladores
- saber que cambios estructurales se han aplicado
- evitar cambios manuales dificiles de rastrear
- desplegar cambios de base de datos de forma ordenada
- conectar el modelo tecnico con una evolucion controlada del proyecto

En un TFM, esto tambien ayuda a defender que la persistencia no se ha creado de forma improvisada, sino mediante una herramienta de migraciones.

## 10. Validaciones realizadas

Tras la migracion, los comandos habituales de validacion son:

```bash
npm run prisma:validate
```

Comprueba que el schema Prisma es valido.

```bash
npm run prisma:generate
```

Genera el cliente Prisma tipado para TypeScript.

```bash
npm run typecheck
```

Comprueba que TypeScript no detecta errores de tipos.

```bash
npm run lint
```

Ejecuta ESLint para detectar problemas de codigo o estilo configurados en el proyecto.

```bash
npm run build
```

Comprueba que la aplicacion Next.js puede compilar correctamente.

Estas validaciones confirman que la migracion inicial no rompe el proyecto tecnico base.

## 11. Estado final tras la migracion

Tras este paso, la persistencia inicial queda materializada.

Esto significa que:

- el modelo de datos ya existe en `prisma/schema.prisma`
- la estructura inicial ya esta versionada como migracion
- PostgreSQL puede quedar sincronizado con ese modelo
- Prisma puede generar su cliente tipado

El siguiente paso tecnico recomendado seria crear una capa prudente de acceso a datos.

Sin embargo, no se debe interpretar esta migracion como permiso para implementar automaticamente CRUD completo o logica de negocio.

Cualquier avance funcional debe planificarse de forma separada y mantenerse dentro del alcance del MVP del TFM.

## 12. Como acceder a PostgreSQL tras la migracion

PostgreSQL no esta instalado directamente como servicio del sistema operativo.

En este proyecto se ejecuta dentro de un contenedor gestionado por Docker Compose. Docker Desktop permite ver ese contenedor, comprobar si esta arrancado, consultar logs y revisar los puertos expuestos.

Para inspeccionar la base de datos desde el navegador se puede usar Prisma Studio:

```bash
npm run prisma:studio
```

Prisma Studio permite ver modelos, tablas y datos de la base de datos durante el desarrollo.

Los datos de conexion estan en `.env`, creado localmente a partir de `.env.example`. Ese archivo contiene `DATABASE_URL`, que incluye host, puerto, base de datos, usuario y contrasena.

Tambien podria usarse un cliente SQL externo como DBeaver, TablePlus, pgAdmin o DataGrip con los datos de `DATABASE_URL`.

No se deben compartir ni versionar credenciales reales del `.env`.

Prisma Studio es una herramienta util de desarrollo, pero no sustituye a las migraciones ni a una capa de acceso a datos dentro de la aplicacion.

## 13. Resumen para defensa del TFM

La migracion inicial demuestra que el proyecto paso de un modelo conceptual y tecnico a una estructura real de base de datos.

La decision es defendible porque:

- Prisma permite versionar cambios estructurales.
- PostgreSQL almacena los datos de forma relacional.
- Docker Compose facilita un entorno local reproducible.
- La migracion evita crear tablas manualmente.
- El proyecto mantiene separadas infraestructura y funcionalidad de negocio.

En resumen, este paso no implementa nuevas funcionalidades visibles, pero si consolida la base tecnica necesaria para construirlas de forma controlada en fases posteriores.
