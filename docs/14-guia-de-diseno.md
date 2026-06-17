# Guía de diseño

> Documento de referencia del MVP del TFM.
> Define la base de diseño de la interfaz: principios, design tokens, layout, componentes y patrones de pantalla. Es una base mínima y evolucionable, no un sistema de diseño cerrado.

## 1. Introducción

Esta guía fija el lenguaje visual del proyecto para que todas las pantallas se construyan de forma coherente. El enfoque de estilos (Tailwind CSS + shadcn/ui) y la dirección visual se deciden en `docs/adr/0009-enfoque-de-estilos-y-diseno.md`.

La dirección es **sobria y sistematizada**: se parte de una referencia visual tipo panel de administración (tarjetas, tablas con acciones y badges, formularios a dos columnas), pero el color se usa con disciplina. La estética se ajustará iterando en el navegador; los valores de esta guía son el punto de partida.

El proyecto aún **no tiene nombre ni logotipo**; la marca se representa con un placeholder hasta definirla.

## 2. Principios

- **Claridad antes que decoración**: jerarquía visual evidente, una acción principal por pantalla.
- **Consistencia**: mismos patrones para listar, crear, editar y ver.
- **Color con intención**: el color comunica estado o acción, no rellena.
- **Accesibilidad**: contraste suficiente (objetivo AA), foco visible, etiquetas en formularios; se apoya en los primitivos accesibles de Radix.
- **Responsive razonable**: usable en escritorio y móvil, sin perseguir una app visualmente compleja.

## 3. Design tokens

Se implementan como variables CSS (convención de shadcn), de modo que la paleta se ajusta en un solo lugar. Los valores son orientativos y afinables.

### 3.1. Color

| Rol | Uso | Valor aprox. |
|---|---|---|
| `background` | Fondo de la aplicación | `#f3f5f9` (slate-100) |
| `card` | Superficie de tarjetas/paneles | `#ffffff` |
| `border` | Bordes y separadores | `#e2e8f0` (slate-200) |
| `foreground` | Texto principal | `#1e293b` (slate-800) |
| `muted-foreground` | Texto secundario / labels | `#64748b` (slate-500) |
| `primary` | Acción principal, foco, activo | `#0d9488` (teal-600) |
| `primary-foreground` | Texto sobre primario | `#ffffff` |
| `sidebar` | Fondo de la navegación | `#1e293b` (navy/slate-800) |
| `sidebar-foreground` | Texto de navegación | `#e2e8f0` |
| `success` | Estado correcto (p. ej. Activo) | `#16a34a` (green-600) |
| `warning` | Estado de aviso (p. ej. Pausado) | `#d97706` (amber-600) |
| `destructive` | Borrar / estado negativo | `#dc2626` (red-600) |
| `info` | Estado informativo (p. ej. En proceso) | `#2563eb` (blue-600) |

Regla de uso del color:

- **Primario (teal)**: botón de acción principal, enlace activo de navegación, foco.
- **Semánticos (verde/ámbar/rojo/azul)**: solo en **badges de estado** y **alertas**, más el rojo en acciones **destructivas**.
- El resto de la interfaz es **neutra** (escala slate). Se evita el "arcoíris" de botones de colores.

### 3.2. Tipografía

- Fuente sans-serif (sistema o Inter).
- Escala: título de página ~`1.5rem` (semibold); títulos de panel ~`1.125rem`; cuerpo `0.875–1rem`; labels de campo en mayúsculas suaves o normal, color `muted-foreground`.

### 3.3. Espaciado, radios y sombra

- **Espaciado**: escala de Tailwind (base 4px); padding de tarjeta ~`1.5rem`; separación entre secciones ~`1.5rem`.
- **Radio**: `0.5rem` por defecto (`--radius`).
- **Sombra**: sutil en tarjetas (equivalente a `shadow-sm`); sin sombras fuertes.

## 4. Layout

Shell de aplicación: navegación lateral oscura + barra superior + contenido en tarjetas sobre fondo claro. La posición de la navegación es parametrizable (lateral por defecto).

```text
┌───────────┬───────────────────────────────────────────────┐
│  [logo]   │  ☰                         [avatar] Usuario ▾  │  ← topbar
│           ├───────────────────────────────────────────────┤
│  Inicio   │                                               │
│  Usuarios │   Título de página                            │
│  Clientes │   ┌─────────────────────────────────────────┐ │
│  Proyectos│   │  Panel / tarjeta                        │ │
│  Tareas   │   │                                         │ │
│  Tiempos  │   └─────────────────────────────────────────┘ │
│  Reportes │                                               │
│  Asistente│                                               │
│           │                                               │
└───────────┴───────────────────────────────────────────────┘
   sidebar                    contenido (bg claro)
```

- **Sidebar**: marca/placeholder arriba, ítems con icono y etiqueta; ítem activo resaltado con el primario. Colapsable en móvil (toggle en la topbar).
- **Topbar**: toggle de menú, y a la derecha menú de usuario (avatar + nombre + desplegable con **Cerrar sesión**).
- **Contenido**: título de página y uno o varios paneles (tarjetas).
- La navegación usa las secciones del propio proyecto (ver inventario en `docs/11-pantallas-y-navegacion.md`); no se fijan aquí secciones ajenas.

## 5. Patrones de pantalla

### 5.1. Login — `/login`

Tarjeta centrada, sin shell.

```text
            ┌──────────────────────────────┐
            │            [logo]            │
            │      Iniciar sesión          │
            │                              │
            │  Email     [______________]  │
            │  Password  [______________]  │
            │                              │
            │  [   Iniciar sesión   ]      │  ← botón primario
            │                              │
            │  (mensaje de error)          │
            └──────────────────────────────┘
```

### 5.2. Listado — `/users`, `/clients`, …

```text
┌─────────────────────────────────────────────────────────┐
│ Título del listado                        [ + Nuevo ]    │
├─────────────────────────────────────────────────────────┤
│ Col A   │ Col B   │ Estado │            Acciones          │
│ ────────┼─────────┼────────┼───────────────────────────  │
│  dato   │  dato   │ [badge]│   [ver] [editar] [borrar]   │
│  dato   │  dato   │ [badge]│   [ver] [editar] [borrar]   │
└─────────────────────────────────────────────────────────┘
```

- **Base del MVP (DataTable v1)**: columnas básicas, badges de estado semánticos, acciones por fila como botones icono (ghost; el de borrar en rojo), estado vacío y acción principal "Nuevo" arriba a la derecha.
- **Evolución futura (no requisito del MVP)**: ordenación por columna, paginación y selector de tamaño de página (DataTable v2), conforme a `docs/planes/16-ui-base-y-modulo-client.md`.

### 5.3. Formulario — `/users/new`, `/users/[id]/edit`, …

```text
┌─────────────────────────────────────────────────────────┐
│ Título del formulario        [ Volver ]  [ Eliminar ]    │
├─────────────────────────────────────────────────────────┤
│ Nombre *      [____________]   Email *     [___________]  │
│ Rol *         [select ▾]       Estado *    [select ▾]     │
│                                                          │
│ [ Guardar ]                                              │
│ * Campo obligatorio                                      │
└─────────────────────────────────────────────────────────┘
```

- Rejilla a dos columnas; obligatorios con asterisco; botón primario de guardar; nota de campos obligatorios.

### 5.4. Detalle — `/clients/[id]`, …

```text
┌─────────────────────────────────────────────────────────┐
│ Información            [ Volver ] [ Editar ] [ Eliminar ] │
├───────────────────────────┬─────────────────────────────┤
│ LABEL        valor         │ LABEL        valor          │
│ LABEL        valor         │ ESTADO       [badge]        │
└───────────────────────────┴─────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Sección relacionada                       [ + Nuevo ]    │
│ (tabla o estado vacío)                                   │
└─────────────────────────────────────────────────────────┘
```

### 5.5. Dashboard — `/dashboard` (placeholder)

De momento, página simple "en construcción". Como patrón futuro se contempla una fila de tarjetas de indicadores (KPI) seguida de paneles de listados recientes, reutilizando los componentes de tarjeta y tabla.

## 6. Componentes (mapa a shadcn/ui)

| Componente | Uso | Notas |
|---|---|---|
| `Button` | Acciones | Variantes: `default` (primario), `secondary`, `outline`, `ghost`, `destructive`; tamaños incluido icono. |
| `Input`, `Label`, `Textarea`, `Select` | Formularios | Label con asterisco para obligatorios; mensajes de validación bajo el campo. |
| `Badge` | Estado | Mapear enums de dominio: `ACTIVE`→success, `INACTIVE`→neutral/destructive, `PAUSED`→warning, `IN_PROGRESS`→info, etc. |
| `Table` | Listados | Base MVP (DataTable v1): hover de fila y columna de acciones. La ordenación de columnas es evolución futura (DataTable v2). |
| `Card` | Paneles | Cabecera + contenido. |
| `Alert` | Mensajes | Variantes info/success/warning/destructive. |
| `AlertDialog` | Confirmaciones | Confirmar acciones destructivas (borrar) en lugar de hacerlo directo. |
| `Pagination` | Listados (evolución futura) | Controles anterior/siguiente y tamaño de página; DataTable v2, no forma parte del MVP. |
| `DropdownMenu` + `Avatar` | Menú de usuario | En la topbar; incluye cerrar sesión. |
| Sidebar/Nav | Navegación | Ítem activo con primario. |
| `EmptyState` | Estado vacío | Mensaje + llamada a la acción. |

Estos componentes sustituyen a los actuales de `src/components` (CSS propio), que se reconstruirán con shadcn durante la implementación.

## 7. Estados de interfaz

Coherentes con `docs/11-pantallas-y-navegacion.md` (sección 6): **cargando**, **vacío**, **error**, **éxito** y **sin permisos**. Cada listado y formulario debe contemplarlos.

## 8. Responsive y accesibilidad

- **Responsive**: sidebar colapsable en móvil; tablas con scroll horizontal o apilado de columnas; formularios a una columna en pantallas estrechas.
- **Accesibilidad**: componentes accesibles (Radix), foco visible, etiquetas asociadas a los campos, contraste objetivo AA, acciones por icono con texto accesible.

## 9. Relación con la implementación

- La instalación y configuración de Tailwind + shadcn es una fase de implementación previa al rework de login y usuarios (ver `docs/adr/0009`).
- Los tokens de esta guía se materializan como variables CSS de shadcn; ajustarlos (color, radio) no requiere rehacer pantallas.
- Esta guía es evolutiva: se actualizará cuando se afine el estilo en el navegador o se definan nombre y logotipo.
