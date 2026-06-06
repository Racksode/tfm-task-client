# Histórico IA - Prerrequisito de credenciales para Auth

## Estado

Plan aprobado y aplicado.

## Resumen del prompt

El usuario solicitó dividir la implementación de autenticación en dos tareas.

La primera tarea debía preparar únicamente el prerrequisito de credenciales:

- añadir `passwordHash String?` al modelo `User`;
- crear la migración versionada `add-user-password-hash`;
- crear documentación formativa, plan e histórico;
- mantener los roles `INTERNAL` y `CLIENT`.

La autenticación mínima con Auth.js / NextAuth queda para un PR posterior.

## Restricciones indicadas

El usuario indicó expresamente:

- no instalar `next-auth`;
- no instalar `bcryptjs`;
- no crear `src/auth.ts`;
- no crear route handler;
- no implementar login;
- no implementar sesión;
- no crear CRUD de usuarios;
- no crear seeds;
- no crear pantallas;
- no modificar `.env.example`, `.env`, workflows, README, ADRs, Docker Compose ni módulos funcionales;
- no introducir roles `ADMIN` ni `MEMBER`.

## Plan aprobado

Se aprobó:

- modificar `prisma/schema.prisma` para añadir `passwordHash String?` en `User`;
- crear una migración versionada para añadir la columna nullable en PostgreSQL;
- crear `docs/notas/13-explicacion-prerrequisito-credenciales-auth.md`;
- crear `docs/planes/10-prerrequisito-credenciales-auth.md`;
- crear este histórico ampliado.

## Resultado

Se añadió el campo opcional `passwordHash` al modelo `User`.

Se creó la migración `add-user-password-hash`, que añade la columna `passwordHash` a la tabla `User`.

No se implementó autenticación, login, sesión, CRUD de usuarios, seeds, pantallas, permisos avanzados ni roles nuevos.

## Validación prevista

```text
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

## Commit o PR previsto

```text
feat: preparar credenciales de usuario para auth
```
