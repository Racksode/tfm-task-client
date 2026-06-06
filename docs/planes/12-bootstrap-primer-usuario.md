# Plan 12 - Bootstrap controlado del primer usuario

## Objetivo

Crear un mecanismo local y controlado para generar el primer usuario autenticable `INTERNAL` y `ACTIVE` con `passwordHash`.

## Alcance aplicado

Este bloque incluye:

- script `scripts/bootstrap-first-user.mjs`;
- comando npm `bootstrap:first-user`;
- creación de un único usuario `INTERNAL` y `ACTIVE`;
- generación de `passwordHash` con `bcryptjs.hash`;
- validaciones mínimas de email, nombre y contraseña;
- aborto si ya existe cualquier usuario `INTERNAL`;
- nota formativa;
- registro histórico del trabajo con IA.

## Límites

No se abre `/users` públicamente.

No se crea endpoint público, pantalla de bootstrap, seed automático, CRUD de usuarios, middleware, `proxy.ts`, permisos avanzados, roles `ADMIN` ni roles `MEMBER`.

No se modifican `prisma/schema.prisma`, migraciones, README, ADRs, CI, Docker Compose ni configuración de Auth.

No se añaden dependencias nuevas.

## Validación prevista

```text
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

## Resultado esperado

El proyecto dispondrá de un comando local para crear el primer usuario interno autenticable antes de implementar `/users` protegido en la Fase 2B.

## Commit previsto

```text
feat: añadir bootstrap controlado del primer usuario
```
