# Histórico IA - Ajustes de diseño finos (pre-Client)

## Estado

`Resumen reconstruido a partir de la trazabilidad disponible`.

Segunda tanda de pulido para dejar el patrón de `users` listo para clonar en los módulos de negocio.

## Resultado

- **Colores de botones** (`src/components/data/icon-action.tsx`): ver = cian, editar/nuevo = verde turquesa (teal), eliminar = rojo, volver = marengo. Aplicado por igual a iconos de fila y botones de cabecera.
- **Pastillas de detalle**: acento izquierdo (`border-l-4`) igual que el ítem de menú activo, con color por sección configurable en `src/lib/section-config.ts` (`getSectionAccent`); `users` usa el primario.
- **Cabeceras**: solo título de sección (sin eyebrow ni descripción) en todas las páginas; título alineado verticalmente con los botones de la derecha (`PageHeader` con `items-center`).
- **Listado**: el botón "Nuevo usuario" vuelve a la cabecera (alineado con el título), en verde turquesa.
- Versión bump a 1.1.2.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde.

## Commit o PR previsto

```text
feat: ajustes finos de diseño (colores, pastillas, cabeceras)
```
