# Módulo Task: doble relación y selectores filtrados

## Qué se ha hecho

Tercer módulo de negocio, **Task** (`/tasks`), clonando el patrón de `projects`. Cierra la cadena de CRUD cliente → proyecto → **tarea** (el siguiente paso ya es el registro de tiempos, con lógica propia).

## Novedades respecto a `projects`

1. **Dos relaciones en el formulario**:
   - `projectId` (obligatorio): **selector plano** que muestra "Proyecto — Cliente". Se eligió plano (no filtrado por estado del proyecto) para que, al **editar** una tarea cuyo proyecto está `COMPLETED/CANCELLED`, ese proyecto siga apareciendo en el desplegable.
   - `responsibleId` (opcional): selector **filtrado a usuarios staff** (`where: { role: { in: STAFF_ROLES } }`), porque un `CLIENT` no es responsable de tareas. Incluye opción "Sin asignar".
2. **Dos enums multivalor**: `TaskStatus` (5) y `TaskPriority` (3). Etiquetas y colores de badge centralizados en `src/app/tasks/status.ts`. Sin toggle rápido en el listado (se cambian por formulario).

## Archivos y conceptos

- Auditoría: `Task.createdById/updatedById` + relaciones inversas en `User` (migración `add_task_audit_fields`).
- Permisos: `requireStaff()` + `can(role, action, "tasks")`.
- Borrado sin cascada: bloqueo por `timeEntries` vinculados (mensaje sugiriendo cambiar de estado).
- Enlaces cruzados: detalle de tarea → proyecto y responsable; detalle de proyecto → tareas.

## Atención: Prisma Client tras `migrate dev`

Si tras añadir relaciones el `typecheck` marca campos como `never` (cliente desactualizado), ejecutar `npx prisma generate`. El `postinstall` cubre las instalaciones, pero un `migrate dev` puntual puede requerir regenerar manualmente. Ver [25-prisma-generate-postinstall.md](25-prisma-generate-postinstall.md).

## Qué queda sin implementar

- Registro de tiempos (`/times`): en el detalle de la tarea los tiempos se listan de forma informativa.
- Sin filtros, búsqueda ni paginación.
