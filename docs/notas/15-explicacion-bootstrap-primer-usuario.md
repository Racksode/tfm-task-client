# Explicación del bootstrap controlado del primer usuario

## Objetivo

Esta nota explica la Fase 2A del bloque de usuarios: crear un mecanismo local y controlado para generar el primer usuario autenticable del sistema.

El objetivo es poder obtener un primer usuario `INTERNAL` y `ACTIVE` con `passwordHash`, sin abrir `/users` públicamente y sin crear todavía un CRUD de usuarios.

## Por qué es necesario

La Fase 1 dejó preparada la autenticación mínima con Auth.js / NextAuth y Credentials Provider.

La futura gestión de usuarios de la Fase 2B estará protegida por sesión. Para poder acceder a esa pantalla protegida hace falta disponer antes de un primer usuario autenticable.

Este bootstrap resuelve solo ese arranque inicial en entorno local o de desarrollo controlado.

## Qué se ha implementado

Se ha añadido un script local:

```text
scripts/bootstrap-first-user.mjs
```

y un comando npm:

```text
npm run bootstrap:first-user
```

El script crea un único usuario:

- rol `INTERNAL`;
- estado `ACTIVE`;
- sin asociación a cliente;
- con `passwordHash` generado a partir de la contraseña indicada.

## Cómo se usa en local

El script lee estas variables de entorno:

```text
BOOTSTRAP_USER_EMAIL
BOOTSTRAP_USER_NAME
BOOTSTRAP_USER_PASSWORD
DATABASE_URL
```

Ejemplo en PowerShell:

```powershell
$env:BOOTSTRAP_USER_EMAIL="admin.local@example.com"
$env:BOOTSTRAP_USER_NAME="Usuario Interno"
$env:BOOTSTRAP_USER_PASSWORD="cambiar-esta-password"
npm run bootstrap:first-user
```

El script carga también `.env` mediante `dotenv/config`, por lo que `DATABASE_URL` puede venir del entorno local ya configurado.

## Seguridad

La contraseña no se guarda en claro.

El script usa `bcryptjs.hash` para generar `passwordHash` y almacena únicamente el hash en la base de datos.

El script no imprime la contraseña ni imprime el hash.

Si ya existe cualquier usuario `INTERNAL`, el script aborta sin crear nada. Esto evita que el bootstrap se convierta en un mecanismo repetido de administración.

## Límites

Esta fase no implementa:

- `/users`;
- endpoint público;
- pantalla pública de bootstrap;
- seeds automáticos;
- CRUD de usuarios;
- roles `ADMIN` o `MEMBER`;
- permisos avanzados;
- recuperación de contraseña;
- invitaciones;
- área cliente;
- multi-tenant avanzado.

Se mantienen los roles del MVP:

- `INTERNAL`;
- `CLIENT`.

## Próximo paso

Después de mergear esta fase, la Fase 2B podrá implementar `/users` protegido por sesión para gestionar usuarios mínimos desde la aplicación.
