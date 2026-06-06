# Plan 11 - Auth mínima con Auth.js / NextAuth

## Objetivo

Implementar la infraestructura mínima de login y sesión con Auth.js / NextAuth usando Credentials Provider.

## Alcance aplicado

Este bloque incluye:

- instalación de `next-auth@beta` y `bcryptjs`;
- configuración base en `src/auth.ts`;
- Credentials Provider con `email` y `password`;
- validación contra `prisma.user`;
- comparación de contraseña con `bcryptjs.compare`;
- sesión JWT con datos mínimos del usuario;
- revalidación del usuario actual contra Prisma en el callback `jwt`;
- route handler de App Router en `src/app/api/auth/[...nextauth]/route.ts`;
- tipado mínimo de sesión y JWT;
- placeholder `AUTH_SECRET` en `.env.example`;
- nota formativa sobre Auth mínima;
- registro histórico del trabajo con IA.

## Límites

No se añade Prisma Adapter.

No se modifican `prisma/schema.prisma`, migraciones, `UserRole`, Docker Compose, CI, README, ADRs ni módulos funcionales.

No se crean tablas Auth.js `Account`, `Session` ni `VerificationToken`.

No se crean usuarios, seeds, CRUDs, pantallas, `proxy.ts`, middleware, protección global de rutas, permisos complejos, matriz de permisos, roles nuevos, `ADMIN` ni `MEMBER`.

## Validación prevista

```text
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

## Resultado esperado

La aplicación dispondrá de una base técnica de autenticación con credenciales y sesión JWT, sin cambiar todavía el comportamiento funcional del CRM ni añadir gestión de usuarios.

## Commit previsto

```text
feat: añadir auth mínima con nextauth
```
