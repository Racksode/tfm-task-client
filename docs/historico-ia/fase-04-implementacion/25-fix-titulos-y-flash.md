# Histórico IA - Fix: títulos de cabecera y auto-cierre del flash

## Prompt enviado

> vamos a proceder con el pr [...] convención de títulos [...] y además hay otro error: si se aplica una acción (eliminar por ejemplo) con un error, se vuelve al listado, se muestra el error y se cierra el error rápidamente. En un mismo PR, solucionamos los dos errores.

## Diagnóstico

- **Títulos**: el detalle mostraba solo el nombre del registro; al navegar (p. ej. a un usuario desde un cliente) se perdía en qué sección se estaba.
- **Flash que se cierra rápido**: `AlertBanner` borraba la cookie del flash **al montarse** (`onShow={clearFlash}`). `clearFlash` es una server action que, al borrar la cookie, dispara un refresh del servidor; como el aviso se renderiza condicionalmente (`{flash ? … : null}`), desaparecía casi al instante, antes del auto-cierre.

## Resultado

- **Convención de títulos** (`PageHeader`): `Sección: valor`. Detalle y edición de `users` y `clients` pasan a `Usuario: {nombre}` / `Cliente: {nombre}` (la edición ya no usa el prefijo "Editar"; se distingue por los botones de cabecera). Listado y alta ya indicaban la sección.
- **Flash** (`src/components/feedback/alert-banner.tsx`):
  - El borrado del flash se hace **al cerrar** el aviso (`onDismiss`), no al mostrarlo → ya no se oculta antes de tiempo.
  - Los avisos de tipo **`error` no se auto-cierran** (solo con la X), para poder leerlos; el resto siguen con auto-cierre configurable.
  - Los listados (`users`, `clients`) pasan `onDismiss={clearFlash}`.
- Versión bump a **1.2.1** (fix). Docs actualizadas (`README`, `estado-proyecto.md`).

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Prueba manual recomendada: provocar un borrado bloqueado y verificar que el error permanece hasta cerrarlo con la X.

## Commit o PR previsto

```text
fix: corregir títulos de cabecera y auto-cierre prematuro de avisos
```
