# Plan 21 - Implementación: base de UI, login y usuarios

## Objetivo

Implementar el rework de acceso y gestión de usuarios sobre una base de UI nueva, según las decisiones ya documentadas:

- `docs/adr/0009-enfoque-de-estilos-y-diseno.md` (Tailwind + shadcn/ui) y `docs/14-guia-de-diseno.md`.
- `docs/adr/0008-login-y-estructura-usuarios.md` y `docs/notas/21-diagnostico-login-users.md`.

Este plan ya implica **código**. Se desarrolla por fases cerradas, cada una en su rama y PR.

## Contexto

La documentación funcional/UX y de diseño está cerrada. La gestión de usuarios actual (una sola página con edición inline) y el acceso (sin login propio, raíz pública, sin redirección por rol) se rehacen alineados con esa documentación.

## Fases

### Fase 1 - Base de UI (Tailwind + shadcn/ui)

Objetivo: montar el sistema de estilos y reconstruir la UI base.

- Instalar y configurar Tailwind CSS y shadcn/ui (con Radix).
- Materializar los **design tokens** de `docs/14` como variables CSS (color, tipografía, radio).
- Reconstruir los componentes base actuales con shadcn: `Button`, `Input`, `Select`, `Label`, `Badge`, `Alert`, `Card`, `Table`, `EmptyState`.
- Montar el `AppShell`: navegación lateral (secciones del proyecto), barra superior con menú de usuario y **logout**.
- Migrar `/users` a la nueva UI sin cambiar todavía su estructura (se reestructura en la Fase 3).

Límites: DataTable v1 (sin ordenación ni paginación); sin modo oscuro ni theming avanzado.

Validación: `typecheck`, `lint`, `build` en verde; revisión visual en navegador.

### Fase 2 - Acceso y login

Objetivo: implementar el acceso propio y la redirección por rol.

- Pantalla `/login` propia que invoca `signIn`; configurar NextAuth con `pages.signIn = "/login"`.
- Proteger la raíz `/`: sin sesión → `/login`; con sesión → `/dashboard` (`INTERNAL`) o `/portal` (`CLIENT`).
- Páginas simples "en construcción" para `/dashboard` y `/portal`.
- Acción de **logout** en el shell.
- Helper común `requireInternal` con comportamiento coherente en páginas y server actions.

Límites: sin recuperación de contraseña, OAuth, SSO ni permisos avanzados; `/dashboard` y `/portal` son placeholders.

Validación: login real con usuario `INTERNAL`; redirección por rol; bloqueo de rutas internas a `CLIENT`; `typecheck`/`lint`/`build` en verde.

### Fase 3 - Usuarios en rutas CRUD

Objetivo: reestructurar la gestión de usuarios en rutas separadas.

- `/users`: listado (tabla, badges de estado, acciones por fila, acción "Nuevo").
- `/users/new`: alta.
- `/users/[id]/edit`: edición (estado y contraseña opcional).
- Dividir/ajustar las server actions por operación; acción de activar/desactivar.
- Conservar validaciones y reglas actuales: hash bcrypt, email único, contraseña mínima, regla `CLIENT` requiere cliente.

Límites: sin filtros, búsqueda ni paginación (DataTable v1).

Validación: alta, edición y activación/desactivación; protección por rol en páginas y acciones; `typecheck`/`lint`/`build` en verde.

## Fuera de alcance

- Área de cliente `/portal` real y panel `/dashboard` real (placeholders).
- Pruebas automatizadas (sin Vitest todavía; ver `docs/07-plan-pruebas.md`).
- Módulos de negocio (`Client`, `Project`, `Task`), que vienen después.

## Documentación posterior prevista

- Actualizar el estado de las pantallas afectadas en `docs/11` y `docs/13` cuando cada fase quede implementada (de `Pendiente`/`Parcial` a `Implementado`).
- Nota formativa breve si alguna decisión técnica de la integración de Tailwind/shadcn lo justifica.

## Commits previstos

```text
docs: planificar implementación de base de UI, login y usuarios
```

Los commits de implementación de cada fase se realizarán en sus propias ramas (por ejemplo, `feat: montar base de UI con tailwind y shadcn`, `feat: implementar login propio y redirección por rol`, `feat: reestructurar usuarios en rutas crud`).
