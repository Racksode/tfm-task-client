# Planificación de autenticación, usuarios y roles básicos

## Objetivo

Esta nota define el enfoque previsto para introducir autenticación mínima, usuarios mínimos y roles básicos dentro del MVP del TFM.

El objetivo no es implementar todavía estas capacidades, sino fijar un orden de trabajo limitado, revisable y defendible para evitar que el bloque de autenticación crezca por encima de lo necesario para el proyecto.

## Motivo de la separación en fases

La autenticación, la gestión de usuarios y los roles están relacionados, pero no conviene abordarlos en un único cambio grande.

Se separan en tres fases por los siguientes motivos:

- Reducir el riesgo técnico y funcional.
- Facilitar la revisión de cada bloque.
- Evitar mezclar infraestructura de autenticación con gestión funcional de usuarios.
- Mantener trazabilidad clara para la memoria y defensa del TFM.
- Limitar el alcance del MVP y evitar incorporar funcionalidades propias de una evolución SaaS posterior.

## Fase 1: autenticación mínima

La primera fase debe centrarse en preparar la autenticación base de la aplicación.

Alcance previsto:

- Configuración base de Auth.js / NextAuth.
- Sesión básica de usuario.
- Proveedor de credenciales si procede para el MVP.
- Conexión con Prisma si procede según el enfoque elegido.
- Protección mínima preparada para futuras rutas o pantallas privadas.

Queda fuera de esta fase:

- CRUD de usuarios.
- Roles.
- Permisos complejos.
- Área privada completa.
- Recuperación de contraseña.
- Invitaciones.

El resultado esperado de esta fase debe ser una base de login y sesión suficiente para continuar el MVP, sin convertirla en un sistema completo de identidad.

## Fase 2: usuarios mínimos

La segunda fase debe añadir la gestión mínima de usuarios necesaria para operar el MVP.

Alcance previsto:

- Listado de usuarios.
- Creación de usuarios.
- Edición básica de datos de usuario.
- Posible activación o desactivación de usuarios.
- Validaciones mínimas para evitar datos inconsistentes.

Queda fuera de esta fase:

- Permisos avanzados.
- Multi-tenant complejo.
- Auditoría avanzada.

Esta fase debe mantenerse orientada a la administración básica del MVP, no a una consola completa de gestión de cuentas.

## Fase 3: roles básicos

La tercera fase debe introducir roles simples para distinguir responsabilidades principales dentro del MVP.

Roles previstos:

- `ADMIN`: usuario con capacidad de administración básica.
- `MEMBER`: usuario interno estándar.
- `CLIENT`: usuario cliente o perfil externo limitado, si encaja con el flujo funcional del MVP.

En esta fase no se debe implementar una matriz avanzada de permisos. La finalidad es disponer de una distinción simple y defendible entre tipos de usuario, suficiente para proteger funcionalidades básicas y explicar el modelo del MVP.

## Criterio para el MVP

Forman parte del MVP:

- Login.
- Sesión.
- Usuarios mínimos.
- Roles básicos.

Quedan fuera del MVP o se reservan para fases posteriores:

- Permisos avanzados.
- Invitaciones.
- Recuperación avanzada de contraseña.
- Multi-tenant complejo.
- Auditoría avanzada.

El criterio principal es mantener una base pequeña, funcional y justificable, evitando adelantar funcionalidades propias de un SaaS más maduro.

## Orden recomendado de implementación

El orden recomendado es:

1. Auth mínima.
2. Usuarios mínimos.
3. Roles básicos.
4. Primer módulo funcional `Client`.

Este orden permite construir primero la base de acceso, después la gestión mínima de usuarios, luego la diferenciación básica por rol y finalmente el primer módulo funcional apoyado en esa estructura.

## Estado final de esta nota

Esta nota no implementa Auth, usuarios ni roles.

Su función es definir alcance, fases, límites y orden recomendado de trabajo para próximos cambios del TFM.
