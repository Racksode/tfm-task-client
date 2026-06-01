# ADR 0006 - Autenticacion y control de acceso

## Estado

Aceptada.

## Contexto

El MVP requiere autenticacion obligatoria en zonas privadas y una diferenciacion minima entre usuario interno y usuario cliente.

Los requisitos ya aceptados establecen que el cliente solo debe acceder a informacion asociada a su cliente y marcada como visible. No se contempla para el TFM una matriz avanzada de permisos ni un sistema SaaS multiempresa completo.

La decision debe permitir iniciar la implementacion con una estrategia concreta, sin cerrar funcionalidades avanzadas de autenticacion que no forman parte del MVP.

## Decision

Se decide utilizar Auth.js/NextAuth con Credentials Provider para la autenticacion basica del MVP.

El sistema distinguira como minimo dos roles:

- usuario interno
- usuario cliente

El usuario cliente debera estar asociado a un cliente concreto. El control de acceso y visibilidad debera aplicarse en servidor, no solo mediante ocultacion en la interfaz.

No se cierran en esta fase decisiones sobre:

- recuperacion de contrasena
- OAuth
- SSO
- magic links
- matriz avanzada de permisos
- proveedores externos de identidad

Estas capacidades quedan fuera del MVP inicial salvo decision posterior documentada.

## Alternativas valoradas

### Auth.js/NextAuth con Credentials Provider

Permite integrar autenticacion con Next.js sin delegar la identidad en un proveedor externo.

Ventajas:

- encaja con el stack elegido
- evita construir toda la gestion de sesiones desde cero
- permite mantener usuarios y roles basicos en la base de datos del MVP
- reduce dependencia de servicios comerciales externos
- suficiente para diferenciar usuario interno y cliente

Inconvenientes:

- requiere configurar correctamente sesiones, secretos y validacion de credenciales
- el Credentials Provider exige cuidar el almacenamiento seguro de contrasenas
- algunas funcionalidades habituales, como recuperacion de contrasena, no quedan resueltas por esta decision

Esta es la opcion seleccionada para el MVP.

### Autenticacion propia sencilla con sesiones y cookies

Consistiria en implementar manualmente login, sesiones, cookies, hashing y comprobaciones de usuario.

Ventajas:

- control total de la implementacion
- pocas dependencias externas
- facil de explicar si se mantiene muy acotada

Inconvenientes:

- aumenta el riesgo de errores de seguridad
- obliga a resolver manualmente detalles delicados de sesiones y cookies
- consume tiempo que deberia centrarse en el nucleo funcional del MVP
- no aporta suficiente valor frente a usar una libreria consolidada

No se selecciona para el MVP.

### Clerk, Auth0 o Supabase Auth

Delegarian parte importante de la autenticacion en un proveedor externo.

Ventajas:

- funcionalidades avanzadas disponibles rapidamente
- gestion madura de flujos habituales de autenticacion
- buena opcion para evolucion comercial futura

Inconvenientes:

- introducen dependencia externa adicional
- pueden cerrar decisiones de producto que no son necesarias para el TFM
- podrian desplazar el foco hacia configuracion de proveedor en lugar del MVP funcional
- algunas capacidades avanzadas exceden el alcance actual

No se seleccionan para el MVP. Podran reevaluarse como linea futura del SaaS si el producto evoluciona.

## Consecuencias

La implementacion posterior debera proteger las rutas y operaciones privadas, comprobar el rol del usuario y aplicar filtros de visibilidad en servidor.

Las reglas minimas seran:

- el usuario interno puede gestionar informacion operativa del MVP
- el usuario cliente solo puede consultar informacion asociada a su cliente
- la informacion debe estar marcada como visible para mostrarse al cliente
- las observaciones internas y datos no visibles no deben exponerse al area de cliente

Quedan aplazados:

- recuperacion de contrasena
- login social
- SSO
- magic links
- permisos granulares
- equipos multiempresa
- administracion avanzada de usuarios
