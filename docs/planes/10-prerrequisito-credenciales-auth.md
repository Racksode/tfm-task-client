# Plan 10 - Prerrequisito de credenciales para Auth

## Objetivo

Preparar el modelo de datos para una futura autenticación con credenciales, sin implementar todavía Auth.js / NextAuth ni login.

## Alcance aplicado

Este bloque incluye:

- campo opcional `passwordHash` en el modelo `User`;
- migración versionada `add-user-password-hash`;
- nota formativa sobre el prerrequisito de credenciales;
- registro histórico del trabajo con IA.

## Límites

No se instalan dependencias.

No se implementan Auth.js / NextAuth, proveedor de credenciales, login, sesión, route handler, CRUD de usuarios, seeds, pantallas, recuperación de contraseña, invitaciones, área cliente, permisos complejos ni multi-tenant avanzado.

No se modifican `.env`, `.env.example`, workflows, README, ADRs, Docker Compose ni módulos funcionales.

Se mantiene intacto el enum `UserRole` con los roles `INTERNAL` y `CLIENT`.

## Validación prevista

```text
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

## Resultado esperado

El modelo `User` dispondrá de un campo opcional para almacenar hashes de contraseña en una fase posterior, sin cambiar todavía el comportamiento visible de la aplicación.

## Commit previsto

```text
feat: preparar credenciales de usuario para auth
```
