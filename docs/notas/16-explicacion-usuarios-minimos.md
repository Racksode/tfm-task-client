# Explicación de usuarios mínimos

## Objetivo

Esta nota explica la Fase 2B de usuarios mínimos del MVP.

El objetivo es disponer de una pantalla protegida para listar, crear y editar usuarios básicos que puedan autenticarse con la infraestructura de Auth mínima ya creada.

## Relación con Auth mínima y bootstrap

La Fase 1 introdujo Auth.js / NextAuth con Credentials Provider y sesión JWT.

La Fase 2A añadió un bootstrap controlado para crear el primer usuario `INTERNAL` autenticable.

Esta fase usa ese primer usuario para acceder a `/users`, que queda protegida por sesión. No se abre un acceso público ni se crea un endpoint de bootstrap.

## Protección de la ruta y acciones

La página `/users` comprueba sesión con `auth()`.

Si no hay sesión, se redirige al flujo de login de Auth.js / NextAuth.

Las acciones de servidor de creación y edición también comprueban sesión. Esto evita depender solo de la protección visual de la página.

## Campos gestionados

La gestión mínima permite trabajar con:

- `name`;
- `email`;
- `role`;
- `status`;
- `clientId`;
- contraseña inicial o nueva contraseña.

No se muestra ni se devuelve `passwordHash`.

## Contraseñas y passwordHash

La aplicación no guarda contraseñas en claro.

Cuando se crea un usuario o se actualiza su contraseña, se usa `bcryptjs.hash` para generar `passwordHash`.

El hash se almacena en base de datos y la contraseña recibida desde el formulario no se imprime ni se conserva.

## Roles permitidos

El MVP mantiene únicamente estos roles:

- `INTERNAL`;
- `CLIENT`.

Un usuario `INTERNAL` no se asocia a cliente y se guarda con `clientId = null`.

Un usuario `CLIENT` debe asociarse a un `Client` existente. Si todavía no existen clientes, la creación o edición de usuarios `CLIENT` queda bloqueada por validación. Esta fase no crea clientes ni implementa el módulo de clientes.

## Qué queda fuera

Queda fuera de esta fase:

- `ADMIN`;
- `MEMBER`;
- permisos avanzados;
- matriz de permisos;
- recuperación de contraseña;
- invitaciones;
- emails transaccionales;
- área cliente;
- multi-tenant avanzado;
- auditoría avanzada;
- módulos de clientes, proyectos, tareas o tiempos;
- middleware global;
- `proxy.ts`;
- seeds.

## Próximos pasos

Los siguientes pasos previstos son:

- Fase 3: roles básicos aplicados;
- protección de módulos funcionales;
- primer módulo funcional `Client`.
