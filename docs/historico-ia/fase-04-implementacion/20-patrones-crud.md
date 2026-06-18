# Histórico IA - PR4: patrones de listado / detalle / edición

## Estado

`Resumen reconstruido a partir de la trazabilidad disponible`.

Cuarto PR del roadmap `docs/planes/22-roadmap-estructura-ui-permisos.md`. Implementado de forma autónoma sobre `users` como referencia a clonar.

## Resultado

- **Badges**: de cápsula a "pastilla" (`rounded-md` en `src/components/ui/badge.tsx`).
- **Acciones por icono** (`src/components/data/icon-action.tsx`): ver=azul, editar=cian, eliminar=rojo, activar=verde, desactivar=ámbar; sin texto, con `aria-label`/`title`.
- **Listado** (`/users`): sin descripción, "Nuevo" junto al título, cabecera de tabla en gris (`bg-muted/50`), acciones por fila en iconos visibles según `canManageUser` (no a uno mismo).
- **Detalle** (`/users/[id]`, nuevo): pastillas "Información principal" y "Datos de grabación" (createdAt/updatedAt + createdBy/updatedBy) y botones de cabecera (Volver, Editar, Eliminar) según permisos.
- **Edición/Alta**: botones de cabecera (edición: Volver, Ver detalles, Eliminar; alta: Volver) y botón de guardar con label dinámica ("Grabar datos" / "Actualizar datos").
- **Borrado** (`deleteUser` + `AlertDialog` en `src/app/users/delete-user-dialog.tsx`): confirmación, sin cascada; bloquea si el usuario tiene datos vinculados (tareas, tiempos, reportes, IA, auditoría), respeta `canManageUser` y no permite auto-borrado.
- Docs `docs/11` sincronizados.

## Validación

`npm run typecheck`, `npm run lint`, `npm run build` en verde. Recomendada validación manual en navegador (iconos por permiso, detalle, confirmación de borrado, bloqueo por vínculos).

## Commit o PR previsto

```text
feat: patrones de listado, detalle y edición con permisos
```
