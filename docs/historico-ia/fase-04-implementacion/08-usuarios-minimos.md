# Histórico IA - Usuarios mínimos

## Estado

Plan aprobado y aplicado.

## Resumen del prompt

El usuario solicitó implementar la Fase 2B de usuarios mínimos en `/users`, protegida por sesión y apoyada en la Auth mínima y el bootstrap del primer usuario.

La pantalla debía permitir listar, crear, editar, activar/desactivar usuarios y definir o cambiar contraseña, sin exponer `passwordHash`.

## Restricciones indicadas

El usuario indicó expresamente:

- `/users` debe requerir sesión;
- las acciones de servidor también deben comprobar sesión;
- no exponer nunca `passwordHash`;
- usar `bcryptjs.hash` para contraseñas;
- permitir solo roles `INTERNAL` y `CLIENT`;
- no crear `ADMIN` ni `MEMBER`;
- no crear clientes ni módulo de clientes;
- no crear middleware global, `proxy.ts`, seeds, endpoint público de bootstrap ni permisos avanzados;
- no modificar `prisma/schema.prisma`, migraciones, CI, Docker Compose, README ni ADRs;
- mantener una UI simple y suficiente para el MVP.

## Plan aprobado

Se aprobó:

- crear `src/app/users/page.tsx`;
- crear `src/app/users/actions.ts`;
- ajustar estilos mínimos en `src/app/globals.css`;
- crear `docs/notas/16-explicacion-usuarios-minimos.md`;
- crear `docs/planes/13-usuarios-minimos.md`;
- crear este histórico ampliado.

## Resultado

Se creó la ruta protegida `/users`.

La página redirige al login de Auth.js / NextAuth si no hay sesión y bloquea el acceso a usuarios autenticados que no tengan rol `INTERNAL`.

Las acciones de servidor de creación y edición también requieren sesión y rol `INTERNAL`, para impedir que usuarios `CLIENT` creen o modifiquen usuarios.

La vista permite listar usuarios, crear usuarios, editar datos básicos, cambiar contraseña opcionalmente y activar o desactivar usuarios.

Las contraseñas se transforman en `passwordHash` mediante `bcryptjs.hash`. No se muestra ni se devuelve `passwordHash`.

Solo se admiten roles `INTERNAL` y `CLIENT`. Los usuarios `INTERNAL` se guardan sin cliente asociado. Los usuarios `CLIENT` requieren un cliente existente; si no hay clientes, la validación bloquea la operación.

No se crearon roles nuevos, permisos avanzados, middleware, seeds, endpoint público de bootstrap, módulo de clientes ni pantallas fuera del alcance.

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
feat: añadir gestion minima de usuarios
```
