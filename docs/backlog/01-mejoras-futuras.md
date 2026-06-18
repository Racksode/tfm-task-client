# Backlog de mejoras futuras

## Objetivo

Registrar mejoras detectadas durante la implementación y validación del MVP que no bloquean el avance actual, pero que conviene conservar para fases posteriores.

Este documento evita mezclar mejoras de experiencia de usuario, componentes reutilizables o arquitectura futura con cambios funcionales prioritarios del MVP.

## Criterio de decisión

Cuando aparezca una mejora durante el desarrollo:

```text
¿Bloquea funcionalmente el MVP?
  Sí  -> se corrige en la fase actual.
  No  -> se registra en este backlog.
```

---

## UI / UX

- Revisar el comportamiento inicial del formulario de usuarios.
  - Estado actual: puede mostrar el usuario conectado para edición.
  - Alternativa futura: formulario vacío hasta seleccionar un usuario.
- Limpiar formularios después de guardar correctamente.
- Añadir mensajes de éxito/error más cómodos para el usuario.
  - Botón de cierre manual.
  - Auto-desaparición tras unos segundos.
  - Tiempo configurable según tipo de mensaje.
- Mejorar la presentación visual general de las pantallas.
- Añadir navegación principal.
- Añadir encabezados de página consistentes.
- Añadir estados vacíos cuando no existan datos.
- Añadir breadcrumbs si la navegación empieza a crecer.
- Revisar iconografía y jerarquía visual.

---

## Componentes reutilizables

Crear una base de componentes comunes para no repetir soluciones en cada módulo.

Posibles componentes:

- `PageHeader`
- `Alert`
- `Toast`
- `DataTable`
- `FormCard`
- `EmptyState`
- `ConfirmDialog`
- `Modal`
- `Pagination`
- `SearchInput`
- `FilterBar`

---

## Listados y administración

- Crear componente reutilizable de listado.
- Añadir acciones por fila.
- Añadir paginación.
- Añadir ordenación por columnas.
- Añadir filtros básicos.
- Añadir búsqueda.
- Evaluar acciones masivas en fases posteriores.

---

## Seguridad y permisos

- Mantener la separación básica entre usuarios `INTERNAL` y `CLIENT`.
- Evaluar permisos más granulares si el MVP lo requiere.
- Evaluar roles adicionales solo si se aprueban explícitamente.
- No introducir `ADMIN` ni `MEMBER` sin decisión documentada posterior.
- Registrar acciones relevantes mediante auditoría cuando se implemente esa capa.

---

## Arquitectura reutilizable

Evaluar si la base actual puede convertirse en una plantilla propia para futuros proyectos.

Elementos potencialmente reutilizables:

- Next.js con App Router.
- TypeScript.
- Prisma.
- PostgreSQL.
- Auth.js / NextAuth.
- Gestión mínima de usuarios.
- Roles básicos.
- Docker Compose para entorno local.
- CI básica.
- Estructura de documentación.
- Scripts de bootstrap controlado.

Aspectos que probablemente variarán según proyecto:

- Modelo de dominio.
- Roles y permisos específicos.
- Layout y branding.
- Módulos funcionales.
- Reglas de negocio.
- Integraciones externas.
- Nivel de multi-tenant.
- Necesidades de auditoría.

---

## Versionado y entrega

- Automatizar el versionado (`versión.subversión.revisión`) con `release-please` o `semantic-release`: bump, changelog y tag automáticos al mergear a `main`, a partir de los tipos de commit (`feat` → subversión, `fix` → revisión, `BREAKING` → versión). Implica añadir tooling de CI/CD (tarea aparte y aprobada). De momento el versionado es manual en `src/lib/config.ts` (ver "Convención de versionado" en el README).

---

## IA y automatización

- Resúmenes IA de tareas, proyectos o actividad.
- Asistente contextual para consultas internas.
- NLU controlado para acciones frecuentes.
- Automatizaciones asistidas por IA.
- Registro de uso IA en `AiUsage`.
- Límites y trazabilidad de acciones sugeridas por IA.

---

## Notas

Este backlog no implica ejecución inmediata.

Las mejoras aquí registradas deberán convertirse en planes específicos antes de implementarse, respetando el flujo habitual:

```text
rama -> plan -> revisión -> cambios -> validación -> commit -> PR -> CI -> merge
```
