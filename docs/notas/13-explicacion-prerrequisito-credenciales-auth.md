# Prerrequisito de credenciales para autenticación

## Objetivo

Esta nota explica el cambio mínimo realizado en el modelo de datos para preparar una futura autenticación con credenciales.

El cambio consiste en añadir el campo opcional `passwordHash` al modelo `User`. Esta fase no implementa Auth.js / NextAuth, login, sesión, pantallas, CRUD de usuarios ni seeds.

## Qué se ha hecho

Se ha añadido el campo:

```prisma
passwordHash String?
```

al modelo `User` de Prisma.

También se ha creado una migración versionada `add-user-password-hash` para añadir la columna correspondiente en PostgreSQL.

El campo es opcional para no bloquear usuarios existentes ni exigir datos iniciales en esta fase.

## Por qué es necesario

El ADR 0006 define que la autenticación básica del MVP se abordará con Auth.js / NextAuth y Credentials Provider.

Para validar credenciales con email y contraseña de forma segura, la aplicación no debe guardar contraseñas en claro. Debe guardar únicamente un hash de contraseña. El campo `passwordHash` prepara el modelo para esa necesidad, sin implementar todavía el flujo de autenticación.

## Relación con usuarios y roles

Este cambio afecta únicamente a la información técnica necesaria para una futura autenticación con credenciales.

Se mantiene el modelo de roles vigente del MVP:

- `INTERNAL`
- `CLIENT`

No se introducen roles `ADMIN` ni `MEMBER`, ni una matriz avanzada de permisos.

## Qué queda sin implementar

Queda fuera de esta fase:

- Auth.js / NextAuth.
- Proveedor de credenciales.
- Login.
- Sesión.
- Comparación de contraseña.
- CRUD de usuarios.
- Pantallas de gestión.
- Seeds.
- Recuperación de contraseña.
- Invitaciones.
- Área cliente.
- Permisos complejos.

La creación o actualización real de contraseñas deberá resolverse en una fase posterior, junto con la autenticación mínima o con la gestión mínima de usuarios.

## Implicaciones

El cambio no altera todavía el comportamiento visible de la aplicación.

Su función es dejar preparada la persistencia para que una fase posterior pueda implementar autenticación con credenciales sin almacenar contraseñas en claro y sin modificar el modelo de roles aceptado para el MVP.
