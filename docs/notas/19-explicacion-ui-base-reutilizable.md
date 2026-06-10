# Explicación de UI base reutilizable v1

## Objetivo

Esta nota explica la Fase 4A.1, en la que se introduce una primera capa UI reutilizable para la aplicación interna.

El objetivo no es crear un sistema de diseño completo, sino disponer de componentes mínimos que reduzcan duplicación y puedan reutilizarse en módulos posteriores como `Client`, `Project` y `Task`.

## Componentes introducidos

La fase crea componentes sencillos en `src/components`:

- layout interno con `AppShell`, `Nav` y `PageHeader`;
- UI básica con `Button`, `Input`, `Select`, `Alert` y `Badge`;
- componentes de datos con `DataTable`, `TableActions` y `EmptyState`.

Los componentes son server-friendly, no añaden estado cliente y no dependen de librerías externas de UI.

## Reutilización en Users

La página `/users` se adapta de forma incremental para validar la base UI con una pantalla real ya existente.

Se reutiliza:

- `AppShell` para la estructura interna;
- `PageHeader` para la cabecera;
- `Alert` para mensajes de error y éxito;
- `Input`, `Select` y `Button` dentro de formularios específicos;
- `DataTable`, `TableActions` y `Badge` en el listado de usuarios.

La lógica funcional de `/users` no cambia. Se mantiene la comprobación de sesión y rol `INTERNAL`, las consultas existentes, las Server Actions y los nombres de campos de formulario.

## DataTable v1

La `DataTable v1` es deliberadamente simple.

Permite:

- recibir columnas básicas;
- recibir filas tipadas;
- renderizar contenido por columna;
- mostrar estado vacío;
- mostrar acciones por fila;
- renderizar badges u otros elementos simples.

No incluye filtros, paginación compleja, ordenación avanzada, selección múltiple, exportación ni configuración dinámica compleja de columnas.

## Formularios

Esta fase no crea una abstracción completa de formularios reutilizables.

Los formularios siguen siendo específicos por módulo. En `/users`, los formularios mantienen su estructura propia y solo pasan a usar componentes UI base como `Input`, `Select`, `Button` y `Alert`.

Después de implementar `Users`, `Client` y `Project`, se evaluará si existen patrones reales suficientes para introducir una futura capa de formularios reutilizables, por ejemplo `FormField`, `FormSection`, `FormActions` o `FormGrid`.

## Qué queda fuera

Queda fuera de esta fase:

- módulo `/clients`;
- cambios de Prisma;
- migraciones;
- cambios de Auth;
- cambios de roles;
- nuevas dependencias;
- permisos avanzados;
- dashboard;
- dark mode;
- sistema de diseño completo;
- filtros avanzados;
- paginación compleja;
- integraciones externas;
- área cliente.

## Conclusión

La Fase 4A.1 introduce una base UI reutilizable v1 pequeña, suficiente para reducir duplicación inicial y preparar el módulo `Client`, sin ampliar el MVP ni cerrar decisiones prematuras de diseño.
