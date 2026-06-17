# Diagnóstico y replanteo de login y usuarios

> Nota de trabajo del TFM.
> Compara la implementación actual de login y gestión de usuarios con la documentación funcional (`docs/10`–`docs/13`), lista los desajustes y define el alcance del rework. De aquí saldrán las actualizaciones de documentación y el plan de implementación.

## 1. Motivación

La gestión de usuarios actual no se considera correcta y el acceso no cumple el comportamiento deseado: al entrar en la aplicación debe aparecer el login, no una pantalla de bienvenida. Se decide rehacer login y usuarios alineándolos con los casos de uso, pantallas y reglas ya definidos.

## 2. Estado actual

### 2.1. Login y acceso

- No existe pantalla de login propia: se usa la pantalla por defecto de Auth.js/NextAuth en `/api/auth/signin`. La configuración de `src/auth.ts` no define `pages.signIn`.
- `/` (`src/app/page.tsx`) es un panel de bienvenida **estático y público**: no llama a `auth()`, no redirige y no monta el shell.
- Tras autenticar **no hay redirección por rol** (CU-01, paso 5, queda pendiente). No existe `/portal`.
- No hay acción de **logout** en la interfaz.
- La protección es **página a página**: `/users` comprueba sesión y rol; no hay layout protegido ni middleware global. La raíz no está protegida.

### 2.2. Gestión de usuarios

- Toda la gestión vive en **una única página** `src/app/users/page.tsx`: cabecera, formulario de alta, tabla y **un formulario de edición inline por cada usuario** (todos renderizados a la vez). "Editar" es un ancla `#edit-user-<id>` que desplaza la página.
- No hay **rutas separadas** (`/users/new`, `/users/[id]`).
- No hay acción directa de **activar/desactivar**; se cambia el estado desde el formulario de edición.
- **Inconsistencia de protección**: la página usa `notFound()` para rol no `INTERNAL`, mientras que las server actions (`src/app/users/actions.ts`) lanzan `throw new Error("Unauthorized")`.
- La validación usa `redirect` con query (`?error=`/`?success=`); funciona, pero no preserva los datos introducidos.

### 2.3. Lo que funciona y debe conservarse

- Hash de contraseñas con bcrypt (12 rounds).
- Email único y validación de formato.
- Contraseña mínima de 8 caracteres.
- Regla "usuario `CLIENT` requiere un cliente asociado".
- Bootstrap controlado del primer usuario `INTERNAL` (`scripts/bootstrap-first-user.mjs`).
- Resolución de rol y estado en la sesión (`src/auth.ts`).

## 3. Desajustes respecto a la documentación

- **`docs/11` §5.3 documenta el diseño de página única con edición inline**: el problema no es solo de implementación, también de definición. La documentación de pantallas debe corregirse.
- **CU-01 (paso 5)**: la redirección por rol está documentada como comportamiento, pero no implementada. El rework la abordará.
- **`docs/11` §5.1 / §5.2**: el login no es propio y `/` no cumple el rol de entrada autenticada. Deben redefinirse.
- El resto de reglas de negocio (RN-01, RN-02, RN-03) siguen siendo válidas y se mantienen.

## 4. Decisiones adoptadas

1. **Login propio en `/login`**: se crea una pantalla de login propia y se configura NextAuth (`pages.signIn = "/login"`). La raíz redirige a `/login` cuando no hay sesión.
2. **Usuarios en rutas CRUD separadas**:
   - `/users`: listado.
   - `/users/new`: alta.
   - `/users/[id]/edit`: edición.
   Este patrón servirá de referencia reutilizable para `Client`, `Project` y `Task`.

## 5. Alcance del rework

### 5.1. Acceso y login (objetivo)

- Pantalla `/login` propia que invoca `signIn` con credenciales.
- `/` protegida: sin sesión → `/login`; con sesión → redirección por rol (`INTERNAL` → `/dashboard`; `CLIENT` → `/portal`). De momento ambos destinos serán páginas simples "en construcción".
- Redirección por rol tras autenticar (cierra CU-01 paso 5).
- Acción de **logout** en el shell (`AppShell`).
- Unificar la protección en un helper común (`requireInternal`) con comportamiento coherente en página y server actions.

### 5.2. Usuarios (objetivo)

- `/users`: tabla con acciones (editar, activar/desactivar) y acceso a alta.
- `/users/new`: formulario de alta.
- `/users/[id]/edit`: formulario de edición (estado y contraseña opcional).
- Reutilizar y, si procede, dividir las server actions por operación, manteniendo las validaciones actuales.

### 5.3. Fuera de alcance

- Área de cliente `/portal` completa (sigue pendiente; solo se define el destino de redirección).
- Recuperación de contraseña, OAuth, SSO, permisos avanzados, multiempresa.
- Filtros, búsqueda y paginación avanzada.

## 6. Orden de trabajo propuesto

Documentación primero, implementación después; cada paso en su rama y PR:

1. **Actualizar documentación** al nuevo diseño:
   - `docs/11`: §5.1 (`/login`), §5.2 (`/` con redirección por rol), §5.3 (desglose `/users`, `/users/new`, `/users/[id]/edit`), inventario, sitemap y logout.
   - `docs/10`: CU-01 (redirección por rol) y CU-02 (gestión con rutas).
   - `docs/13`: referencias de pantalla en HU-01/HU-02 y matriz.
2. **Plan de implementación** en `docs/planes/`.
3. **Implementar login** (`/login`, redirección por rol, logout, helper de protección).
4. **Implementar usuarios** en rutas CRUD separadas.

## 7. Cuestiones abiertas (resueltas)

- Destino de `INTERNAL` tras login → **`/dashboard`**, página simple "dashboard en construcción".
- Destino de `CLIENT` tras login → **`/portal`**, página simple "área de cliente en construcción / acceso restringido".
- La decisión de login propio y estructura CRUD se documenta en un ADR (`docs/adr/0008-login-y-estructura-usuarios.md`).
