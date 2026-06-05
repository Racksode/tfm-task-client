# Plan 09 - CI básica con GitHub Actions

## Objetivo

Crear una integración continua básica para validar Pull Requests hacia `main` sin desplegar la aplicación ni introducir CD.

## Alcance aplicado

Este bloque incluye:

- workflow `.github/workflows/ci.yml`;
- ejecución en eventos `pull_request` hacia `main`;
- uso de Ubuntu y Node.js LTS;
- instalación con `npm ci`;
- variable `DATABASE_URL` no real para validaciones de Prisma;
- validación de Prisma, TypeScript, ESLint y build de Next.js;
- nota formativa sobre la CI básica.

## Limites

No se modifican código funcional, Prisma schema, migraciones, `package.json`, `package-lock.json`, README, ADRs, Docker Compose, configuración existente, rutas, páginas, componentes ni capa de acceso a datos.

No se crean tests, CRUDs, endpoints, autenticación, lógica de negocio, CD, despliegue ni servicios de producción.

No se levanta PostgreSQL en CI y no se ejecutan migraciones.

## Validación prevista

```text
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

## Resultado esperado

Cada Pull Request hacia `main` ejecutará una validación técnica mínima antes de integrar cambios.

## Commit previsto

```text
ci: añadir validación básica de pull requests
```
