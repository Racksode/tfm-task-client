# Plan Documental - Fase 4A: UI Base Reutilizable v1 y Módulo Client

## Resumen

La siguiente fase iniciará el primer módulo funcional real del CRM, `Client`, y se aprovechará para introducir una UI base reutilizable v1.

La intención es evitar que cada módulo futuro tenga tablas, formularios, botones, mensajes y layout creados de forma artesanal y duplicada.

La UI base debe ser sencilla, progresiva y compatible con el alcance MVP. No se pretende crear todavía un sistema de diseño completo ni un acabado visual definitivo.

## Objetivos

- Crear una base visual y estructural mínima para la aplicación interna.
- Implementar el módulo `Client` como primer módulo funcional real.
- Reutilizar patrones ya consolidados en `/users`.
- Proteger `/clients` y sus acciones mediante rol `INTERNAL`.
- Evitar duplicación temprana entre `Users`, `Clients`, `Projects` y `Tasks`.
- Dejar preparada la evolución futura hacia listados con paginación, filtros y búsqueda.
- Mantener el alcance MVP sin introducir complejidad prematura.

## Fases propuestas

### Fase 4A.1 - UI base reutilizable v1

Objetivo: crear una primera capa UI reutilizable, pequeña y controlada.

Alcance incluido:

```text
src/components/layout/
  app-shell.tsx
  nav.tsx
  page-header.tsx

src/components/ui/
  button.tsx
  input.tsx
  select.tsx
  alert.tsx
  badge.tsx

src/components/data/
  data-table.tsx
  table-actions.tsx
  empty-state.tsx
```

La estructura exacta podrá ajustarse durante la implementación, pero el objetivo es que exista una base reutilizable.

Debe incluir:

- layout interno común;
- navegación básica entre secciones internas;
- cabeceras de página;
- botones reutilizables;
- campos de formulario básicos;
- alertas o mensajes simples;
- badges de estado;
- estado vacío para listados;
- tabla reutilizable v1;
- acciones por fila.

No debe incluir todavía:

- sistema de diseño completo;
- theming avanzado;
- dark mode;
- librería visual externa compleja;
- DataTable avanzada;
- selección múltiple;
- exportación;
- columnas dinámicas;
- filtros avanzados;
- ordenación avanzada;
- paginación compleja de servidor;
- dashboard.

### Fase 4A.2 - Módulo Client MVP

Objetivo: crear gestión básica de clientes internos en la ruta `/clients`.

Funcionalidades incluidas:

- listado de clientes;
- alta de clientes;
- edición de clientes;
- activar o desactivar clientes;
- visualización del estado activo/inactivo;
- asociación básica de usuarios con rol `CLIENT` a clientes, si el modelo actual lo permite sin ampliar el alcance;
- protección por rol `INTERNAL`.

La protección debe seguir el patrón ya consolidado en `/users`:

- usuarios sin sesión: redirección a login;
- usuarios autenticados con rol distinto de `INTERNAL`: bloqueo;
- Server Actions protegidas mediante helper equivalente a `requireInternal`.

No incluido:

- área cliente;
- portal externo;
- multi-tenant avanzado;
- facturación;
- permisos avanzados;
- roles adicionales;
- automatizaciones IA;
- reportes;
- proyectos;
- tareas;
- control horario;
- integración con Holded;
- integración con herramientas externas.

### Fase 4B - Módulo Project

Objetivo: crear el módulo `Project` reutilizando la UI base v1 creada durante `Client`.

Alcance futuro previsto:

- listado de proyectos;
- alta y edición básica;
- asociación con cliente;
- estado del proyecto;
- reutilización de `AppShell`, `PageHeader`, `DataTable`, `Badge`, formularios y acciones.

Esta fase servirá para validar si la UI creada en `Client` es suficientemente reutilizable o necesita pequeños ajustes.

### Fase 4C - Módulo Task

Objetivo: crear el módulo `Task` reutilizando y ajustando la base creada en fases anteriores.

Alcance futuro previsto:

- listado de tareas;
- alta y edición básica;
- asociación con proyecto;
- estado de tarea;
- posible prioridad o responsable si ya está en modelo;
- reutilización de tabla, acciones, badges y formularios.

Esta fase permitirá detectar necesidades comunes reales de listados y formularios antes de sobrediseñar componentes.

### Fase 4D - Mejora de listados y experiencia de uso

Objetivo: evolucionar la UI con necesidades reales después de tener `Client`, `Project` y `Task`.

Posibles mejoras:

- paginación;
- búsqueda;
- filtros;
- ordenación;
- estados de carga;
- confirmaciones;
- mensajes de éxito/error más consistentes;
- mejor experiencia visual;
- posible refactor de DataTable v1 a DataTable v2.

Estas mejoras no deben implementarse antes de conocer las necesidades reales de varios módulos.

## Decisiones técnicas

### DataTable v1

Se introducirá una `DataTable v1` desde el módulo `Client`, pero será una versión simple y controlada.

Debe permitir:

- mostrar columnas básicas;
- mostrar filas;
- mostrar estado vacío;
- mostrar acciones por fila;
- mostrar badges de estado;
- ser reutilizable en módulos posteriores.

No debe incluir todavía:

- filtros avanzados;
- paginación avanzada;
- ordenación avanzada;
- selección múltiple;
- exportación;
- configuración dinámica compleja de columnas.

### Diseño

Se introducirá una base visual mínima, coherente y reutilizable, pero no un diseño definitivo.

Debe priorizar:

- claridad;
- consistencia;
- mantenibilidad;
- bajo coste de cambio;
- facilidad para reutilizar en otros módulos.

No debe perseguir todavía:

- acabado visual final;
- diseño comercial;
- dashboard avanzado;
- personalización visual compleja.

### Relación con plantilla reutilizable

Esta fase también servirá para observar si la arquitectura puede evolucionar hacia una plantilla base reutilizable tipo `Virtual Enjoy Starter Kit`.

Posibles piezas reutilizables futuras:

- Next.js;
- Prisma;
- Auth.js;
- Docker;
- CI;
- usuarios;
- roles básicos;
- layout interno;
- componentes UI base;
- DataTable v1;
- documentación estructurada;
- flujo de PR/CI.

En esta fase solo se observa y se prepara. No se crea todavía una plantilla separada.

## Validaciones previstas

Cuando se implemente la fase, deberán ejecutarse:

```bash
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

También deberá realizarse validación manual:

- login con usuario `INTERNAL`;
- acceso a `/clients`;
- bloqueo de usuario `CLIENT`;
- listado de clientes;
- alta de cliente;
- edición de cliente;
- activación/desactivación;
- revisión visual básica;
- revisión de reutilización de componentes.

## Documentación posterior prevista

Tras implementar la fase, se deberán crear documentos explicativos. Como en esta tarea se crea `docs/notas/18-decision-ui-base-reutilizable.md`, la numeración posterior deberá evitar duplicados.

Documentación prevista:

```text
docs/notas/19-explicacion-ui-base-reutilizable.md
docs/notas/20-explicacion-modulo-client.md
docs/historico-ia/fase-04-implementacion/12-ui-base-y-modulo-client.md
```

## Criterio de cierre de la fase futura

La fase futura se considerará completada cuando:

- exista una UI base v1 reutilizable;
- `/clients` esté implementado;
- `INTERNAL` pueda gestionar clientes;
- `CLIENT` esté bloqueado;
- la DataTable v1 se use al menos en `Client`;
- no se haya ampliado el alcance fuera del MVP;
- las validaciones automáticas estén en verde;
- la validación manual en navegador sea correcta;
- exista documentación explicativa posterior.

## Commit previsto

```text
docs: planificar ui base reutilizable y modulo client
```
