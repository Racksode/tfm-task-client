# Explicación de autenticación mínima con Auth.js / NextAuth

## Objetivo

Esta nota explica la Fase 1 de autenticación mínima del MVP.

El cambio introduce la infraestructura base para login y sesión con Auth.js / NextAuth usando Credentials Provider, sin crear todavía CRUD de usuarios, pantallas completas, roles avanzados, permisos complejos ni lógica funcional del CRM.

## Qué es Auth.js / NextAuth

Auth.js / NextAuth es una librería de autenticación para aplicaciones Next.js.

Permite centralizar la gestión de proveedores de login, callbacks, cookies y sesiones sin implementar manualmente toda la infraestructura de autenticación.

En este proyecto se usa con App Router mediante:

- una configuración principal en `src/auth.ts`;
- un route handler en `src/app/api/auth/[...nextauth]/route.ts`;
- sesión basada en JWT.

## Qué problema resuelve

El MVP necesita una base técnica para identificar usuarios antes de proteger módulos privados.

Esta fase resuelve:

- recepción de credenciales `email` y `password`;
- comprobación del usuario en base de datos;
- rechazo de usuarios inexistentes, inactivos o sin hash de contraseña;
- creación de una sesión mínima si las credenciales son válidas;
- exposición controlada de datos mínimos del usuario autenticado.

## Qué se implementa en esta fase

Se implementa una configuración mínima de Auth.js / NextAuth con Credentials Provider.

La sesión expone únicamente:

- `id`;
- `name`;
- `email`;
- `role`;
- `status`;
- `clientId`.

No se añade Prisma Adapter en esta fase. La sesión usa estrategia JWT para evitar crear tablas específicas de Auth.js y mantener el alcance reducido.

## Cómo se valida un login

El flujo previsto es:

1. Auth.js recibe `email` y `password`.
2. La configuración normaliza el email.
3. Se consulta `prisma.user` usando la capa existente `src/lib/prisma.ts`.
4. Se rechaza el intento si el usuario no existe.
5. Se rechaza el intento si el usuario está inactivo.
6. Se rechaza el intento si el usuario no tiene `passwordHash`.
7. Se compara la contraseña recibida con el hash almacenado usando `bcryptjs.compare`.
8. Si la comparación es válida, se crea la sesión JWT con datos mínimos.

## Por qué se usa passwordHash

El sistema no debe almacenar contraseñas en claro.

El campo `passwordHash` almacena el resultado de aplicar un algoritmo de hashing a una contraseña. En esta fase solo se compara una contraseña recibida con el hash existente.

La creación o actualización de contraseñas queda para fases posteriores de gestión mínima de usuarios o tareas específicas de alta de usuarios.

## Papel de AUTH_SECRET

`AUTH_SECRET` es la variable que Auth.js utiliza para proteger los tokens y cookies de sesión.

En esta fase solo se añade un placeholder en `.env.example`. No se modifica `.env` ni se incluye ningún secreto real.

## Papel de la sesión JWT

La sesión JWT permite mantener la información mínima del usuario autenticado sin introducir tablas adicionales de sesión.

Esto encaja con el MVP porque reduce infraestructura, evita añadir modelos Auth.js en Prisma y permite avanzar hacia la protección de rutas en fases posteriores.

## Autenticación y autorización

La autenticación responde a quién es el usuario.

La autorización responde a qué puede hacer ese usuario una vez identificado.

Esta fase implementa la base de autenticación. La autorización funcional, los permisos complejos y la protección de módulos se abordarán en fases posteriores.

## Qué queda fuera

Queda fuera de esta fase:

- CRUD de usuarios.
- Pantallas completas.
- Recuperación de contraseña.
- Invitaciones.
- Permisos complejos.
- Roles avanzados.
- Área cliente.
- Multi-tenant avanzado.
- Seeds.
- Protección global de rutas.

## Próximos pasos

Los pasos posteriores previstos son:

- usuarios mínimos;
- roles básicos `INTERNAL` / `CLIENT`;
- protección de rutas o módulos funcionales;
- primer módulo funcional `Client`.
