# Evolución de las herramientas de IA en el desarrollo

> Nota metodológica del TFM. **Estado: BORRADOR.**
> Recoge la evolución de las herramientas de IA usadas durante el desarrollo y el porqué de los cambios. Se redactará en detalle al cerrar la documentación funcional.

## Propósito

Esta nota documenta la IA como **herramienta de desarrollo** (no la IA del producto, que se describe en `docs/05-ia.md`). Complementa `docs/notas/01-trabajo-ide-agentes-ia.md` y `docs/notas/03-reflexion-sobrealcance-ia.md`.

## Relato (notas en crudo, pendiente de redactar)

- **Inicio**: ChatGPT para análisis, debate y generación de prompts; Codex en el IDE para planes y desarrollo.
- **Punto de quiebre — implementación de `users`**: aquí se vio que falló la definición y Codex implementó de forma muy pobre, algo que no había ocurrido hasta entonces.
- **Prueba con Claude Code en el mismo punto**: el resultado fue bastante mejor.
- **Cambio de herramienta**: se pasó a usar Claude Code para pedir una revisión completa del proyecto y construir un mapa mental para documentar.

## Documentación producida con Claude Code (resumen breve)

A raíz de esa revisión se creó la capa de documentación funcional/UX:

- [Casos de uso](../10-casos-de-uso.md) (CU-01…CU-12, reglas de negocio, trazabilidad).
- [Pantallas y navegación](../11-pantallas-y-navegacion.md) (inventario, sitemaps, fichas, flujos).
- [Diagramas UML](../12-diagramas-uml.md) (casos de uso y secuencia).

## Pendiente de redactar

- Desarrollar cada punto del relato con contexto y ejemplos concretos.
- Valorar qué lecciones metodológicas extraer (importancia de la definición previa, revisión humana, control de alcance).
- Actualizar el resumen de documentación cuando se cierren las fases restantes.
