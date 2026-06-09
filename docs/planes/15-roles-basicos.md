# Plan 15 - Roles básicos

## Objetivo

Consolidar documentalmente el uso de los roles básicos del MVP, `INTERNAL` y `CLIENT`, como patrón de control de acceso simple y defendible.

Esta fase no crea roles desde cero ni implementa una capa nueva de permisos. Revisa y deja claras las reglas ya aplicadas tras la autenticación mínima, el bootstrap del primer usuario y la gestión mínima de usuarios.

## Contexto ya implementado

El proyecto ya dispone de:

- autenticación mínima con Auth.js / NextAuth;
- bootstrap controlado del primer usuario `INTERNAL`;
- gestión mínima de usuarios en `/users`;
- ruta `/users` protegida para usuarios `INTERNAL`;
- acciones de servidor de `/users` restringidas a usuarios `INTERNAL`;
- bloqueo de usuarios `CLIENT` en la administración de usuarios;
- roles del MVP limitados a `INTERNAL` y `CLIENT`.

## Alcance previsto

Este bloque incluye:

- revisar que la documentación de roles básicos refleje el estado real del MVP;
- consolidar la regla `INTERNAL` como rol autorizado para futuras rutas internas;
- consolidar `CLIENT` como rol cliente, sin acceso a administración interna;
- confirmar que la protección de página y acciones de servidor en `/users` sigue el mismo criterio;
- dejar registrado que futuras rutas internas deberán aplicar comprobación explícita de sesión y rol;
- separar roles básicos del MVP de permisos avanzados o roles futuros.

## Límites

No se modifica código, `prisma/schema.prisma`, migraciones, CI, dependencias, README ni configuración de Auth.

No se crean roles `ADMIN` ni `MEMBER`.

No se crea una matriz de permisos, permisos granulares, middleware global, `proxy.ts`, área cliente, módulo de clientes, auditoría avanzada ni multi-tenant avanzado.

No se cambia el comportamiento funcional actual de `/users`.

## Validación prevista

Antes de dar la fase por cerrada se espera comprobar:

- un usuario `INTERNAL` puede acceder a `/users`;
- un usuario `CLIENT` no puede acceder a `/users`;
- las server actions de `/users` exigen rol `INTERNAL`;
- no existen roles nuevos fuera de `INTERNAL` y `CLIENT`;
- no se han modificado esquema de datos, migraciones, CI ni dependencias.

## Resultado esperado

El proyecto contará con una definición clara y documentada del patrón básico de roles del MVP.

La Fase 3 quedará cerrada como consolidación documental y validación del patrón `INTERNAL` / `CLIENT`, preparando una referencia prudente para futuras rutas internas sin ampliar el alcance funcional.

## Commit previsto

```text
docs: planificar consolidacion de roles basicos
```
