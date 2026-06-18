# Histórico IA - Ajustes de UI previos a Client

## Estado

`Resumen reconstruido a partir de la trazabilidad disponible`.

Tanda de ajustes de pulido sobre el patrón de `users` antes de implementar `Client`, a partir de una lista de revisiones del usuario.

## Resultado

- **Tipografía** base un punto menor (15px → 14px).
- **Menú lateral**: resaltado del ítem activo más sutil (barra izquierda + fondo tenue, sin bloque sólido).
- **Dashboard** y **listado de usuarios**: solo título; el listado se titula "Usuarios" (sin descripción).
- **Listado**: botón "Nuevo usuario" pegado al listado (sobre la tabla); filas con **doble clic → editar** (`ClickableRow`).
- **Botones**: helper `actionButtonClass` (texto+icono) y `iconActionClass` con tonos consistentes (ver/nuevo=azul, editar=cian, eliminar=rojo, volver=marengo). Cabeceras de detalle/edición/alta con los mismos iconos y colores que las acciones de fila.
- **Mensajes**: la alerta de validación del formulario auto-cierra (configurable por `.env`).
- **Versión**: `appConfig.version` pasa a constante en código (`1.1.0`) con override opcional `APP_VERSION`; se mostrará en el footer. **Convención**: incrementar la versión al cerrar cada PR relevante.
- **i18n**: documentado el enfoque en `docs/notas/22-internacionalizacion.md` (sin implementar).

## Nota

Los iconos que aparecen dentro de algunas cajas de texto del formulario provienen del navegador/SO (autocompletar de Safari/macOS), no se añadieron en el código.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde.

## Commit o PR previsto

```text
feat: ajustes de UI (menú, botones, tipografía, doble clic, versión)
```
