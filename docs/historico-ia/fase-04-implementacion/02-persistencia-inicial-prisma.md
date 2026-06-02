# Historico IA - Persistencia inicial con Prisma

## Estado

Plan aprobado y aplicado parcialmente hasta validaciones tecnicas sin base de datos.

## Resumen del prompt

El usuario solicito aplicar la Fase 4 del TFM para preparar la persistencia inicial con PostgreSQL y Prisma.

El alcance aprobado incluia instalar Prisma, crear `docker-compose.yml`, definir `.env.example`, crear el primer `schema.prisma`, anadir scripts npm de Prisma, ejecutar validaciones y documentar el plan aplicado.

El usuario restringio explicitamente el alcance para no implementar CRUDs, pantallas, endpoints, login, Auth.js/NextAuth real, area cliente, reportes funcionales, integracion IA real, seeds complejos, Vitest, Playwright, dashboard, facturacion, adjuntos, comentarios, notificaciones ni multiempresa SaaS avanzado.

## Plan aprobado

Se aprobo configurar:

- Prisma y Prisma Client.
- PostgreSQL local mediante Docker Compose.
- Schema fisico inicial basado en `docs/03-modelo-datos.md`.
- Variables de entorno de ejemplo.
- Scripts npm minimos de Prisma.
- Documentacion en `docs/planes/` y `docs/historico-ia/`.
- Validaciones tecnicas.
- Migracion inicial solo si Docker/PostgreSQL estaban disponibles.

## Ajustes introducidos

La version instalada de Prisma es 7.8.0.

Prisma 7 no permite definir `url` dentro del bloque `datasource` de `schema.prisma`. Por ello se anadio `prisma.config.ts` en la raiz del proyecto para centralizar la URL de conexion usada por Prisma CLI.

Antes del commit se ajusto `prisma.config.ts` para cargar `.env` explicitamente con `dotenv/config` y usar `env("DATABASE_URL")`, sin URL hardcodeada por defecto.

Este ajuste no cambia el alcance funcional. Solo adapta la configuracion a la version instalada de Prisma y mantiene la conexion controlada por variables de entorno.

## Decision de Docker Compose

Se creo `docker-compose.yml` con PostgreSQL local reproducible:

- imagen `postgres:16`
- contenedor `tfm-task-client-postgres`
- base de datos `tfm_task_client`
- usuario `postgres`
- contrasena `postgres`
- puerto `5432`
- volumen `postgres_data`

No se instalo PostgreSQL como servicio del sistema operativo.

## Resultado de la aplicacion

Se instalaron:

```powershell
npm install @prisma/client
npm install dotenv
npm install -D prisma
```

Se crearon:

- `.env.example`
- `docker-compose.yml`
- `prisma/schema.prisma`
- `prisma.config.ts`
- `docs/planes/07-persistencia-inicial-prisma.md`
- `docs/historico-ia/fase-04-implementacion/02-persistencia-inicial-prisma.md`

Se modificaron:

- `package.json`
- `package-lock.json`
- `README.md`

## Correccion menor antes de commit

Se instalo `dotenv` como dependencia directa.

Se cambio `AiUsage.generatedOutput` por `AiUsage.outputSummary` para mantener el modelo como trazabilidad minima y evitar que el nombre sugiera una funcionalidad IA completa.

## Modelos Prisma incluidos

El schema inicial incluye:

- `User`
- `Client`
- `Project`
- `Task`
- `TimeEntry`
- `Rate`
- `Report`
- `AiUsage`
- `AuditLog`

`Report`, `AiUsage` y `AuditLog` quedan como modelos estructurales minimos.

## Validaciones ejecutadas

```powershell
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

Resultado: todas las validaciones finalizaron correctamente.

## Incidencias detectadas

La primera ejecucion de `npm install @prisma/client` fallo por restricciones de acceso/red del entorno. Se repitio con permisos elevados y finalizo correctamente.

La primera ejecucion de `npm run prisma:validate` fallo por permisos del entorno al acceder a `C:\Users\Racksode`. Se repitio con permisos elevados.

Prisma 7 exigio mover la URL de conexion a `prisma.config.ts`.

`npm install` informo vulnerabilidades moderadas en auditoria. No se ejecuto `npm audit fix` para evitar cambios de dependencias fuera del alcance aprobado.

## Migracion

Se comprobo Docker Compose:

```powershell
docker compose version
```

Docker Compose esta instalado, pero Docker Desktop no tenia disponible el motor Linux:

```text
open //./pipe/dockerDesktopLinuxEngine: El sistema no puede encontrar el archivo especificado.
```

Por este motivo no se ejecuto:

```powershell
npm run prisma:migrate:dev -- --name init
```

La migracion inicial queda pendiente hasta arrancar Docker Desktop y levantar PostgreSQL con:

```powershell
docker compose up -d
npm run prisma:migrate:dev -- --name init
```

## Commit sugerido

```text
chore: configurar persistencia inicial con Prisma
```
