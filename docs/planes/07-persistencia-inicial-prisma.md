# Plan 07 - Persistencia inicial con Prisma

## Objetivo

Preparar la persistencia inicial del MVP con PostgreSQL y Prisma, sin implementar todavia funcionalidades de negocio.

## Alcance

Este bloque incluye:

- instalacion de Prisma y Prisma Client
- configuracion minima de PostgreSQL local mediante Docker Compose
- configuracion de variables de entorno de ejemplo
- primer schema fisico Prisma basado en el modelo conceptual del MVP
- scripts npm minimos para Prisma
- validaciones tecnicas sin depender de una base de datos real

## Dependencias instaladas

```powershell
npm install @prisma/client
npm install dotenv
npm install -D prisma
```

## PostgreSQL local

Se prepara `docker-compose.yml` con un servicio PostgreSQL minimo:

- imagen `postgres:16`
- base de datos `tfm_task_client`
- usuario `postgres`
- contrasena `postgres`
- puerto local `5432`
- volumen persistente `postgres_data`

No se instala PostgreSQL como servicio del sistema operativo.

## Variables de entorno

Se crea `.env.example` con:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tfm_task_client?schema=public"
```

No se crea ni versiona un `.env` real.

## Entidades incluidas

El schema inicial incluye modelos estructurales para:

- `User`
- `Client`
- `Project`
- `Task`
- `TimeEntry`
- `Rate`
- `Report`
- `AiUsage`
- `AuditLog`

`Report`, `AiUsage` y `AuditLog` se mantienen como modelos estructurales minimos, sin endpoints, pantallas, integracion IA real ni sistema avanzado de auditoria.

La configuracion Prisma carga variables de entorno de forma explicita desde `prisma.config.ts` mediante `dotenv/config` y `env("DATABASE_URL")`, sin URL de conexion hardcodeada.

## Comandos de validacion

Validaciones obligatorias:

```powershell
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

Migracion inicial si Docker/PostgreSQL estan disponibles:

```powershell
docker compose up -d
npm run prisma:migrate:dev -- --name init
```

## Fuera de alcance

No se implementan:

- CRUDs
- pantallas
- rutas o endpoints de negocio
- login
- Auth.js / NextAuth real
- area cliente
- reportes funcionales
- integracion IA real
- seeds complejos
- Vitest
- Playwright
- dashboard
- facturacion
- adjuntos
- comentarios
- notificaciones
- multiempresa SaaS avanzado

## Migracion

La migracion queda pendiente si Docker Desktop no esta arrancado o PostgreSQL no esta disponible.

## Commit previsto

```text
chore: configurar persistencia inicial con Prisma
```
