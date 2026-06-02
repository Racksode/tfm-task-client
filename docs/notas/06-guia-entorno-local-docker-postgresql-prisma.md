# Guia de entorno local con Docker, PostgreSQL y Prisma

## 1. Objetivo de esta guia

Esta guia explica como preparar una maquina desde cero para trabajar con la persistencia del proyecto usando:

- Docker Desktop
- Docker Compose
- PostgreSQL en contenedor
- Prisma
- un archivo `.env` local

Sirve para este TFM y tambien como referencia reutilizable para proyectos futuros que usen PostgreSQL y Prisma en desarrollo local.

La idea principal es evitar instalar PostgreSQL como servicio del sistema operativo. En su lugar, se levanta PostgreSQL dentro de Docker usando el `docker-compose.yml` del proyecto.

## 2. Que se necesita instalar

En una maquina nueva se necesita:

- Docker Desktop.
- Docker Compose, incluido con Docker Desktop.
- Node.js y npm.
- Las dependencias del proyecto instaladas con:

```bash
npm install
```

Esta guia se centra en Docker, PostgreSQL y Prisma. Node.js y npm se asumen como parte del entorno general de desarrollo del proyecto.

## 3. Que es Docker Desktop

Docker Desktop es una aplicacion que permite ejecutar contenedores en local.

Un contenedor es un entorno aislado donde puede ejecutarse una herramienta o servicio. En este caso, PostgreSQL se ejecuta dentro de un contenedor en lugar de instalarse directamente en Windows o macOS.

Esto ayuda a que el entorno sea mas facil de reproducir:

- misma version de PostgreSQL para todos
- menos configuracion manual
- arranque y parada con comandos simples
- eliminacion sencilla del entorno local si hace falta

## 4. Que es Docker Compose

Docker Compose es una herramienta para definir y arrancar varios servicios con un archivo de configuracion.

En este proyecto se usa para levantar un servicio PostgreSQL definido en:

```text
docker-compose.yml
```

El servicio usa PostgreSQL 16, crea la base de datos `tfm_task_client` y expone el puerto `5432` en local.

## 5. Por que no instalar PostgreSQL como servicio local

Instalar PostgreSQL directamente como servicio del sistema operativo tambien seria posible, pero para este TFM se prefiere Docker Compose porque:

- evita instalaciones manuales distintas en cada maquina
- reduce problemas de configuracion local
- facilita trabajar igual en Windows y macOS
- permite borrar el entorno local sin afectar al sistema
- hace mas facil explicar y reproducir el proyecto

PostgreSQL sigue siendo la base de datos real del proyecto. Docker solo proporciona una forma practica de ejecutarla en local.

## 6. Instalar Docker Desktop en Windows

Pasos recomendados:

1. Descargar Docker Desktop desde la web oficial de Docker.
2. Instalar Docker Desktop.
3. Reiniciar el equipo si el instalador lo solicita.
4. Abrir Docker Desktop.
5. Esperar a que Docker indique que esta arrancado.

En Windows, Docker Desktop suele usar WSL 2 para ejecutar contenedores Linux. Si aparece un error relacionado con el motor Linux, hay que revisar que Docker Desktop este abierto y que WSL 2 este correctamente habilitado.

## 7. Instalar Docker Desktop en macOS

Pasos recomendados:

1. Descargar Docker Desktop desde la web oficial de Docker.
2. Elegir la version correcta para el procesador del Mac:
   - Apple Silicon, para chips M1, M2, M3 o posteriores.
   - Intel, para Macs antiguos con procesador Intel.
3. Instalar Docker Desktop.
4. Abrir Docker Desktop.
5. Esperar a que Docker indique que esta arrancado.

En macOS no hace falta instalar Docker Compose por separado si se usa Docker Desktop actual.

## 8. Comprobar la instalacion

Desde la terminal, comprobar Docker:

```bash
docker --version
```

Comprobar Docker Compose:

```bash
docker compose version
```

Si ambos comandos responden con una version, Docker esta disponible desde la terminal.

Si los comandos no funcionan, revisar que Docker Desktop este instalado, abierto y correctamente iniciado.

## 9. Levantar PostgreSQL desde el proyecto

Desde la raiz del repositorio, ejecutar:

```bash
docker compose up -d
```

Este comando levanta PostgreSQL en segundo plano.

El contenedor esperado es:

```text
tfm-task-client-postgres
```

La base de datos local configurada es:

```text
tfm_task_client
```

## 10. Comprobar que el contenedor funciona

Ejecutar:

```bash
docker ps
```

Debe aparecer un contenedor basado en `postgres:16` y asociado al puerto `5432`.

Si no aparece, PostgreSQL no esta levantado. En ese caso, revisar Docker Desktop y volver a ejecutar:

```bash
docker compose up -d
```

## 11. Crear el archivo `.env` local

El proyecto incluye una plantilla:

```text
.env.example
```

Esa plantilla contiene la variable `DATABASE_URL`, que Prisma usa para conectarse a PostgreSQL.

El archivo real debe llamarse:

```text
.env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

En macOS o Linux:

```bash
cp .env.example .env
```

El archivo `.env` es local y no debe subirse al repositorio.

## 12. Por que `.env` no se versiona

El archivo `.env` puede contener credenciales, claves o configuraciones privadas de cada entorno.

Por eso se versiona `.env.example`, que funciona como plantilla, pero no se versiona `.env`.

La diferencia es:

```text
.env.example -> plantilla publica
.env         -> configuracion real local
```

Si `.env` no aparece en Git, es normal. Esta ignorado para proteger configuraciones locales.

## 13. Validar Prisma

Con PostgreSQL preparado y `.env` creado, validar el schema Prisma:

```bash
npm run prisma:validate
```

Este comando comprueba que `prisma/schema.prisma` es valido.

Despues, generar el cliente Prisma:

```bash
npm run prisma:generate
```

Este comando genera el cliente tipado que la aplicacion podra usar en fases posteriores.

## 14. Ejecutar la migracion inicial

La migracion inicial solo debe ejecutarse cuando PostgreSQL este disponible.

Comprobar antes:

- Docker Desktop esta abierto.
- `docker compose up -d` se ha ejecutado correctamente.
- `docker ps` muestra el contenedor PostgreSQL.
- `.env` existe y contiene `DATABASE_URL`.

Entonces ejecutar:

```bash
npm run prisma:migrate:dev -- --name init
```

Este comando crea y aplica la migracion inicial en la base de datos local.

Si PostgreSQL no esta levantado, la migracion fallara. En ese caso, no hay que forzarla: primero se corrige el entorno Docker/PostgreSQL.

## 15. Abrir Prisma Studio

Prisma Studio permite inspeccionar la base de datos desde una interfaz visual.

Ejecutar:

```bash
npm run prisma:studio
```

Es util para revisar datos durante el desarrollo, pero no sustituye a la aplicacion ni implementa ninguna funcionalidad de negocio.

## 16. Parar el entorno local

Para detener PostgreSQL sin borrar los datos:

```bash
docker compose down
```

Esto apaga el contenedor, pero conserva el volumen de datos.

Cuando se vuelva a ejecutar:

```bash
docker compose up -d
```

la base de datos local deberia conservar su contenido.

## 17. Borrar tambien los datos locales

Si se necesita reiniciar completamente la base de datos local, se puede ejecutar:

```bash
docker compose down -v
```

Atencion: este comando elimina tambien el volumen de Docker.

Eso significa que borra la base de datos local y sus datos. Debe usarse solo cuando se quiera limpiar el entorno por completo.

## 18. Errores frecuentes

### Docker Desktop no esta arrancado

Sintoma habitual:

```text
Cannot connect to the Docker daemon
```

Solucion:

- abrir Docker Desktop
- esperar a que termine de arrancar
- repetir el comando

### Motor Linux no disponible en Windows

Sintoma habitual:

```text
dockerDesktopLinuxEngine
```

Solucion:

- abrir Docker Desktop
- revisar que WSL 2 esta habilitado
- reiniciar Docker Desktop
- reiniciar el equipo si Docker lo solicita

### `DATABASE_URL` no definida

Sintoma habitual:

```text
Cannot resolve environment variable: DATABASE_URL
```

Solucion:

- crear `.env` desde `.env.example`
- comprobar que `.env` contiene `DATABASE_URL`
- ejecutar los comandos desde la raiz del proyecto

### Puerto `5432` ocupado

Sintoma habitual:

```text
port is already allocated
```

Solucion:

- comprobar si ya hay otro PostgreSQL o contenedor usando el puerto
- detener el servicio que ocupa `5432`
- o cambiar el puerto local en `docker-compose.yml` solo si se aprueba como cambio tecnico

### `.env` no aparece en Git

Esto es correcto.

El archivo `.env` esta pensado para ser local y no versionado. La plantilla versionada es `.env.example`.

### Migracion ejecutada antes de levantar PostgreSQL

Sintoma habitual:

```text
Can't reach database server
```

Solucion:

- ejecutar `docker compose up -d`
- comprobar con `docker ps`
- verificar `.env`
- repetir la migracion

## 19. Checklist final

Antes de trabajar con Prisma y PostgreSQL, comprobar:

- Docker Desktop esta instalado.
- Docker Desktop esta arrancado.
- `docker --version` funciona.
- `docker compose version` funciona.
- Se ha ejecutado `npm install`.
- Existe `.env` creado desde `.env.example`.
- Se ha ejecutado `docker compose up -d`.
- `docker ps` muestra el contenedor PostgreSQL.
- `npm run prisma:validate` funciona.
- `npm run prisma:generate` funciona.
- La migracion inicial se ejecuta solo cuando PostgreSQL esta disponible.

## 20. Resumen

El entorno local queda organizado asi:

```text
Docker Desktop -> Docker Compose -> PostgreSQL
Next.js / TypeScript -> Prisma -> PostgreSQL
```

Docker proporciona la base de datos local.

Prisma valida el modelo, genera el cliente y prepara migraciones.

PostgreSQL conserva los datos del proyecto.

Esta configuracion permite trabajar con persistencia de forma reproducible sin instalar PostgreSQL directamente como servicio del sistema.
