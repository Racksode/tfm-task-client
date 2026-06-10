# Decisión técnica: UI base reutilizable v1

## Objetivo

Documentar la decisión de introducir una UI base reutilizable v1 a partir del módulo `Client`.

Esta decisión busca equilibrar dos riesgos: crear pantallas aisladas difíciles de mantener o construir demasiado pronto un sistema de diseño completo que exceda el alcance del TFM.

## Por qué no dejar toda la UI para el final

El módulo `Client` será el primer módulo funcional real del CRM. Si se implementa como una pantalla aislada, es probable que los módulos posteriores repitan soluciones para layout, cabeceras, botones, formularios, tablas, acciones, estados vacíos y mensajes.

Esa duplicación aumentaría el coste de mantenimiento y haría más difícil defender una evolución ordenada del MVP.

Introducir una base UI mínima desde `Client` permite validar patrones reales desde el primer módulo sin esperar a que el proyecto acumule varias pantallas inconexas.

## Por qué no crear ahora un sistema de diseño completo

El objetivo del TFM es un MVP pequeño, completo y defendible, no una plataforma SaaS final.

Crear ahora un sistema de diseño completo añadiría decisiones prematuras sobre theming, variantes complejas, documentación visual, componentes avanzados y experiencia comercial. Ese esfuerzo no es imprescindible para validar el CRM operativo del MVP.

La UI base v1 debe ser suficiente para construir módulos internos con consistencia, pero mantenerse fácil de cambiar.

## Por qué Client es el punto adecuado

`Client` introduce necesidades habituales que se repetirán en otros módulos:

- listado de entidades;
- formularios de alta y edición;
- acciones por fila;
- estados activo/inactivo;
- mensajes de validación o resultado;
- protección de rutas internas;
- navegación entre secciones.

Estas necesidades son representativas para validar componentes reutilizables antes de avanzar hacia `Project` y `Task`.

## Qué se incluye ahora

La UI base v1 podrá incluir, con estructura final ajustable durante la implementación:

- layout interno común;
- navegación básica;
- cabeceras de página;
- botones reutilizables;
- campos básicos de formulario;
- alertas o mensajes simples;
- badges de estado;
- tabla reutilizable v1;
- acciones por fila;
- estado vacío para listados.

La `DataTable v1` será simple y controlada. Debe permitir columnas básicas, filas, estado vacío, acciones por fila y badges de estado.

## Qué queda para más adelante

Quedan fuera de esta decisión:

- sistema de diseño completo;
- theming avanzado;
- dark mode;
- dashboard;
- filtros avanzados;
- paginación compleja;
- ordenación avanzada;
- selección múltiple;
- exportación;
- columnas dinámicas complejas;
- integraciones externas;
- área cliente;
- permisos avanzados.

Estas capacidades podrán evaluarse más adelante, cuando existan varios módulos reales y necesidades repetidas.

## Relación con Project, Task y plantilla futura

Los módulos `Project` y `Task` deberán reutilizar la UI base creada en `Client` y servirán para validar si los componentes son suficientemente generales.

La fase también permitirá observar si algunas piezas pueden convertirse en una plantilla reutilizable futura tipo `Virtual Enjoy Starter Kit`, con Next.js, Prisma, Auth.js, Docker, CI, usuarios, roles básicos, layout interno, componentes UI base y documentación estructurada.

En esta fase no se crea una plantilla separada. Solo se prepara el proyecto para evolucionar de forma ordenada si esa reutilización acaba teniendo sentido.

## Conclusión

Se decide introducir una UI base reutilizable v1 desde el módulo `Client`, con alcance limitado y evolutivo.

La decisión pertenece al alcance del TFM porque reduce duplicación y mejora la mantenibilidad del MVP, pero no convierte la fase en un sistema de diseño completo ni en una plataforma SaaS final.
