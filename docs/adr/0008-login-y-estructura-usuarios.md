# ADR 0008 - Login propio y estructura CRUD de usuarios

## Estado

Aceptada.

## Contexto

La implementacion actual de acceso y gestion de usuarios no es adecuada (diagnostico en `docs/notas/21-diagnostico-login-users.md`):

- No existe pantalla de login propia; se usa la pantalla por defecto de Auth.js/NextAuth.
- La raiz es un panel de bienvenida estatico y publico, sin redireccion por rol.
- La gestion de usuarios vive en una unica pagina con un formulario de edicion inline por cada usuario, lo que resulta poco escalable y poco claro.
- La proteccion no es coherente entre pagina y server actions.

Ademas, esta es la primera gestion CRUD real del proyecto, por lo que su estructura servira de referencia para los modulos siguientes (`Client`, `Project`, `Task`).

## Decision

### Acceso y login

- Se crea una pantalla de login propia en `/login` y se configura NextAuth con `pages.signIn = "/login"`.
- La raiz queda protegida: sin sesion redirige a `/login`; con sesion redirige segun rol.
- Redireccion por rol tras autenticar:
  - `INTERNAL` -> `/dashboard`
  - `CLIENT` -> `/portal`
- `/dashboard` y `/portal` arrancan como paginas simples "en construccion"; su contenido real es trabajo futuro.
- Se anade accion de logout en el shell de la aplicacion.
- Se unifica la comprobacion de acceso en un helper comun (`requireInternal`) con comportamiento coherente en paginas y server actions.

### Gestion de usuarios

- La gestion se reestructura en rutas CRUD separadas:
  - `/users`: listado.
  - `/users/new`: alta.
  - `/users/[id]/edit`: edicion.
- Se conservan las validaciones y reglas actuales (hash de contrasena, email unico, contrasena minima, regla de cliente asociado para `CLIENT`).

## Alternativas valoradas

### Login

- **Pantalla por defecto de NextAuth**: menos trabajo, pero generica, sin estilo propio ni control sobre la experiencia. Descartada.
- **Pagina `/login` propia**: mas control y coherencia visual, y permite ubicar el login como entrada de la aplicacion. Seleccionada.

### Estructura de usuarios

- **Pagina unica mejorada** (edicion en modal o desplegable): menos cambio, pero menos escalable y peor como patron reutilizable. Descartada.
- **Rutas CRUD separadas**: patron limpio y reutilizable para los modulos siguientes. Seleccionada.

## Consecuencias

- Se actualizara la documentacion funcional al nuevo diseno: `docs/11` (login, raiz con redireccion por rol, desglose de rutas de usuarios, logout), `docs/10` (CU-01 redireccion por rol, CU-02 con rutas) y `docs/13` (referencias de pantalla y matriz).
- La redireccion por rol cierra el paso 5 de CU-01, hasta ahora pendiente.
- El patron CRUD de usuarios servira de referencia para `Client`, `Project` y `Task`.
- `/dashboard` y `/portal` quedan como placeholders; su desarrollo real es trabajo posterior y fuera del alcance de este rework.
- Quedan fuera: recuperacion de contrasena, OAuth, SSO, permisos avanzados, multiempresa, filtros y paginacion avanzada.
