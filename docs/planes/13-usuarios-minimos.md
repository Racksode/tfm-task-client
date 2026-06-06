# Plan 13 - Usuarios mínimos

## Objetivo

Crear una gestión mínima de usuarios en `/users`, protegida por sesión, para listar, crear y editar usuarios básicos del MVP.

## Alcance aplicado

Este bloque incluye:

- ruta protegida `src/app/users/page.tsx`, limitada a usuarios `INTERNAL`;
- acciones de servidor en `src/app/users/actions.ts`;
- listado de usuarios sin exponer `passwordHash`;
- creación de usuarios con contraseña inicial hasheada;
- edición de datos básicos y contraseña opcional;
- activación y desactivación mediante `UserStatus`;
- roles limitados a `INTERNAL` y `CLIENT`;
- validación de asociación a cliente para usuarios `CLIENT`;
- estilos mínimos para la vista;
- nota formativa;
- registro histórico del trabajo con IA.

## Límites

No se modifican `prisma/schema.prisma`, migraciones, `UserRole`, Docker Compose, CI, README, ADRs ni configuración de Auth.

No se añaden dependencias.

No se crean roles `ADMIN` ni `MEMBER`, permisos avanzados, matriz de permisos, middleware global, `proxy.ts`, endpoint público de bootstrap, seeds, recuperación de contraseña, invitaciones, emails transaccionales, área cliente, multi-tenant avanzado, auditoría avanzada, dashboard completo ni módulo de clientes.

## Validación prevista

```text
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

## Resultado esperado

`/users` permitirá una administración mínima y defendible de usuarios del MVP, siempre protegida por sesión, restringida a usuarios `INTERNAL` y sin exponer contraseñas ni hashes.

## Commit previsto

```text
feat: añadir gestion minima de usuarios
```
