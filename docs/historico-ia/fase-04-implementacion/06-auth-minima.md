# Histórico IA - Auth mínima con Auth.js / NextAuth

## Estado

Plan aprobado y aplicado.

## Resumen del prompt

El usuario solicitó implementar la Fase 1 de autenticación mínima con Auth.js / NextAuth usando Credentials Provider.

El prerrequisito de credenciales ya existía mediante `passwordHash String?` en el modelo `User`.

La tarea debía mantener el alcance reducido y no implementar CRUD de usuarios, roles avanzados, permisos complejos, pantallas completas ni lógica de negocio del CRM.

## Restricciones indicadas

El usuario indicó expresamente:

- usar `next-auth@beta` y `bcryptjs`, sin añadir otras dependencias;
- no añadir Prisma Adapter;
- no modificar `prisma/schema.prisma` ni migraciones;
- no crear tablas Auth.js `Account`, `Session` ni `VerificationToken`;
- no crear usuarios, seeds, CRUDs ni pantallas;
- no crear roles `ADMIN` ni `MEMBER`;
- no crear `proxy.ts`, middleware ni protección global de rutas;
- añadir solo `AUTH_SECRET` como placeholder en `.env.example`;
- usar npm como gestor.

## Plan aprobado

Se aprobó:

- instalar `next-auth@beta` y `bcryptjs`;
- crear `src/auth.ts`;
- crear el route handler `src/app/api/auth/[...nextauth]/route.ts`;
- añadir tipado mínimo para sesión y JWT;
- añadir `AUTH_SECRET` a `.env.example`;
- crear `docs/notas/14-explicacion-auth-minima.md`;
- crear `docs/planes/11-auth-minima.md`;
- crear este histórico ampliado.

## Resultado

Se configuró Auth.js / NextAuth con Credentials Provider.

La validación de credenciales consulta `prisma.user`, rechaza usuarios inexistentes, inactivos o sin `passwordHash`, y compara la contraseña recibida con `bcryptjs.compare`.

La sesión usa estrategia JWT y expone solo datos mínimos del usuario autenticado: `id`, `name`, `email`, `role`, `status` y `clientId`.

El callback `jwt` revalida el usuario contra Prisma para priorizar seguridad y consistencia en el MVP, especialmente si un usuario se desactiva o elimina después de haber iniciado sesión.

Esta decisión puede generar más consultas a base de datos. Posibles optimizaciones futuras, no implementadas en esta fase, son sesiones más cortas, versionado de sesión, `sessionVersion` o `updatedAt`, invalidación explícita, estrategia de sesión en base de datos o cache controlada.

No se añadió Prisma Adapter, no se crearon tablas Auth.js, no se modificó Prisma, no se crearon usuarios, seeds, CRUDs, pantallas, roles nuevos ni protección global de rutas.

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
feat: añadir auth mínima con nextauth
```
