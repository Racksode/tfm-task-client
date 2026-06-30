# CRM operativo con IA para gestión de clientes, tareas y tiempos

Proyecto Final de Máster orientado al desarrollo de un MVP funcional de una plataforma SaaS para la gestión de clientes, proyectos, tareas, tiempos de trabajo y generación asistida de reportes mediante inteligencia artificial.

## Objetivo

Desarrollar una aplicación web que permita gestionar clientes, proyectos y tareas, registrar tiempos de trabajo y generar reportes profesionales para el cliente con ayuda de inteligencia artificial.

## Estado actual del proyecto

El estado vivo y el "handoff" para retomar desde cualquier equipo están en [docs/estado-proyecto.md](docs/estado-proyecto.md).

El proyecto tiene la documentación funcional/UX cerrada, el rework de acceso y usuarios completado (login propio con redirección por rol, roles `SUPERADMIN/ADMIN/INTERNAL/CLIENT`, auditoría y mensajes) y **seis módulos de negocio implementados**: Client (`/clients`), Project (`/projects`), Task (`/tasks`), Tiempos (`/times`, registro manual + cronómetro start/stop), Tarifas (`/rates`, solo ADMIN+) y Reportes (`/reports`, agregación de horas/coste por periodo), clonando el patrón CRUD de usuarios.

```text
Fase actual: Fase 4 - Implementación del MVP
Punto actual: módulos Client, Project, Task, Tiempos (manual + cronómetro start/stop), Tarifas y Reportes implementados
Versión: 1.10.0
```

Último hito completado:

```text
Módulo Reportes (/reports, PR1): alta por cliente/proyecto y periodo, agregación y snapshot de horas y coste a partir de los tiempos registrados, resumen interno, flujo de estado (borrador/revisado) y visibilidad para el cliente.
```

Próximo paso:

```text
Reportes PR2: resumen para el cliente asistido por IA (API de Claude) + traza AiUsage. Mejora futura anotada: tarifas automáticas por horario (Opción C).
```

Referencia de planificación:

[docs/09-plan-trabajo-y-control-alcance.md](docs/09-plan-trabajo-y-control-alcance.md)

## Alcance del TFM

El proyecto se centrará en un MVP que incluirá:

- Gestión de clientes.
- Gestión de proyectos.
- Gestión de tareas.
- Registro manual de tiempos.
- Sistema start/stop de tareas.
- Control básico de tarifas y costes.
- Generación de reportes.
- Área básica de cliente.
- Resumen asistido por IA.
- Prueba conceptual controlada para interpretar instrucciones en lenguaje natural.

## Fuera del alcance inicial

Quedan fuera del alcance principal del TFM y se plantean como evolución posterior:

- Integración completa con Holded.
- Facturación propia.
- App móvil nativa.
- Aplicación de escritorio independiente.
- Multiempresa SaaS avanzado.
- Automatizaciones complejas.
- Integración real con WhatsApp, email o agentes externos.
- Sistema comercial CRM completo.

## Documentación

La documentación del proyecto se organiza en la carpeta `/docs`.

Documentos principales:

- [Visión y alcance](docs/00-vision-y-alcance.md)
- [Requisitos funcionales](docs/01-requisitos-funcionales.md)
- [Casos de uso](docs/10-casos-de-uso.md)
- [Pantallas y navegación](docs/11-pantallas-y-navegacion.md)
- [Diagramas UML](docs/12-diagramas-uml.md)
- [Historias de usuario](docs/13-historias-de-usuario.md)
- [Guía de diseño](docs/14-guia-de-diseno.md)
- [Requisitos no funcionales](docs/02-requisitos-no-funcionales.md)
- [Modelo de datos](docs/03-modelo-datos.md)
- [Arquitectura](docs/04-arquitectura.md)
- [Uso de IA](docs/05-ia.md)
- [Integraciones previstas y futuras](docs/06-integraciones.md)
- [Plan de pruebas](docs/07-plan-pruebas.md)
- [Despliegue](docs/08-despliegue.md)
- [Plan de trabajo y control de alcance](docs/09-plan-trabajo-y-control-alcance.md)
- [Metodología de documentación](docs/99-metodologia-documentacion.md)

Documentos internos de trabajo:

- [Hoja de ruta del TFM](docs/notas/00-hoja-ruta.md)
- [Trabajo desde el IDE con agentes IA](docs/notas/01-trabajo-ide-agentes-ia.md)
- [Evolución de las herramientas de IA en el desarrollo](docs/notas/20-evolucion-herramientas-ia.md)
- [Guía de próximos pasos](docs/notas/02-guia-proximos-pasos-tfm.md)
- [Backlog de mejoras futuras](docs/backlog/01-mejoras-futuras.md)

Documentación sobre uso de IA:

- [Prompts de trabajo con IA](docs/prompts/README.md)
- [Planes revisados con IA](docs/planes/README.md)

## Metodología de trabajo

El proyecto se desarrollará por fases controladas, priorizando un MVP realista para el TFM y evitando el crecimiento descontrolado del alcance.

El uso de herramientas de inteligencia artificial se plantea como apoyo al análisis, diseño, implementación, testing y documentación, pero no como excusa para añadir funcionalidades sin planificación.

La planificación general, las fases de desarrollo y los criterios de control de alcance se describen en:

[docs/09-plan-trabajo-y-control-alcance.md](docs/09-plan-trabajo-y-control-alcance.md)

Las normas de trabajo con agentes IA se encuentran en:

- [AGENTS.md](AGENTS.md)
- [docs/notas/01-trabajo-ide-agentes-ia.md](docs/notas/01-trabajo-ide-agentes-ia.md)

Como parte del uso responsable de IA, el proyecto contempla explícitamente el riesgo de sobrealcance, sobredefinición y falsa sensación de avance por generación rápida de documentación o funcionalidades.

La reflexión interna sobre este punto se encuentra en:

[docs/notas/03-reflexion-sobrealcance-ia.md](docs/notas/03-reflexion-sobrealcance-ia.md)

Tras cerrar la documentación conceptual principal, el proyecto no generará más documentación extensa antes del primer código ejecutable. Antes del desarrollo solo se documentarán las decisiones técnicas mínimas necesarias para comenzar con seguridad: stack, base de datos, ORM o acceso a datos, autenticación, estructura del proyecto, patrones básicos y testing mínimo.

## Convención de commits

El proyecto utiliza una convención basada en Conventional Commits.

El tipo del commit se escribe en inglés por compatibilidad con herramientas y estándares habituales, mientras que la descripción se escribe en español para mantener la coherencia con la documentación del TFM.

Ejemplos:

```text
docs: añadir visión inicial del proyecto
feat: implementar gestión básica de clientes
fix: corregir validación de tiempos solapados
refactor: separar lógica de cálculo de costes
test: añadir pruebas del registro de tiempos
chore: crear estructura base de carpetas
```

## Convención de versionado

La versión de la app sigue el formato `versión.subversión.revisión` (semver simplificado) y se define en código en `src/lib/config.ts` (constante `APP_VERSION`), pudiendo sobrescribirse por entorno con `APP_VERSION`. Se muestra en el footer.

Se incrementa al cerrar cada PR relevante, según su tipo:

- **Revisión** (`x.y.→z`): correcciones y ajustes menores de código (`fix`, `refactor`, `chore` con impacto).
- **Subversión** (`x.→y→.0`): nueva funcionalidad (`feat`), por ejemplo un módulo. Reinicia la revisión a 0.
- **Versión** (`→x→.0.0`): hitos grandes o cambios incompatibles (p. ej. cerrar una fase mayor del MVP). Reinicia subversión y revisión a 0.

Los PR exclusivamente de documentación no incrementan la versión salvo que se considere oportuno.

## Stack tecnológico decidido para el MVP

Las decisiones técnicas iniciales del MVP se han documentado en los ADRs:

- `docs/adr/0004-eleccion-stack-tecnologico.md`
- `docs/adr/0005-persistencia-y-acceso-datos.md`
- `docs/adr/0006-autenticacion-y-control-acceso.md`

Stack inicial del MVP:

- Next.js.
- React.
- TypeScript.
- PostgreSQL.
- Prisma.
- Auth.js / NextAuth.
- Vitest para testing mínimo (previsto; aún no instalado).
- Playwright como opción aplazable.
- Docker solo como apoyo local para PostgreSQL, si es necesario.
- GitHub como repositorio y control de versiones.

## Instalación y ejecución

Instalar dependencias:

```bash
npm install
```

Arrancar en local:

```bash
npm run dev
```

Validaciones principales:

```bash
npm run build
npm run typecheck
npm run lint
```

Persistencia local con PostgreSQL y Prisma:

PostgreSQL se ejecuta localmente mediante Docker Compose. Docker Desktop debe estar arrancado antes de usar Docker.

El archivo `.env` se crea localmente a partir de `.env.example` y no debe versionarse.

Variables de entorno:

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí | Cadena de conexión a PostgreSQL usada por Prisma. |
| `AUTH_SECRET` | Sí | Secreto de Auth.js / NextAuth para firmar la sesión. Generar uno con `npx auth secret` o `openssl rand -base64 32`. |
| `BOOTSTRAP_USER_EMAIL` | Solo bootstrap | Email del primer usuario interno creado por `npm run bootstrap:first-user`. |
| `BOOTSTRAP_USER_PASSWORD` | Solo bootstrap | Contraseña inicial del primer usuario. |
| `BOOTSTRAP_USER_NAME` | Solo bootstrap | Nombre del primer usuario. |
| `ALERT_AUTO_DISMISS_MS` | No | Milisegundos antes de auto-cerrar las alertas (por defecto 5000; 0 = no auto-cerrar). Los avisos de error no se auto-cierran. |
| `APP_VERSION` | No | Sobrescribe la versión mostrada en el footer (por defecto, la definida en código). |

Las variables `BOOTSTRAP_USER_*` solo se utilizan al ejecutar el script de bootstrap del primer usuario y pueden retirarse después.

```bash
docker compose up -d
docker compose ps
npm run prisma:migrate:dev -- --name init
npm run prisma:studio
```

`npm run prisma:studio` abre Prisma Studio en navegador para inspeccionar modelos, tablas y datos de la base de datos.

Notas formativas relacionadas:

- [Persistencia con Prisma y PostgreSQL](docs/notas/05-explicaciones-persistencia-prisma-postgresql.md)
- [Entorno local con Docker, PostgreSQL y Prisma](docs/notas/06-guia-entorno-local-docker-postgresql-prisma.md)
- [Migración inicial de Prisma](docs/notas/08-explicacion-migracion-inicial-prisma.md)

El proyecto técnico base ha sido validado con:

```bash
npm run typecheck
npm run lint
npm run build
npm run dev
```

## Licencia

El proyecto se publica bajo **licencia dual**:

- **AGPL-3.0** como licencia open source por defecto (ver [LICENSE](LICENSE)).
- **Licencia comercial** de pago para usos que no quieran asumir las obligaciones de copyleft de la AGPL (ver [COMMERCIAL-LICENSE.md](COMMERCIAL-LICENSE.md)).

El uso bajo AGPL es gratuito. Se solicita mantener la atribución al autor y un enlace al proyecto en los créditos.

La decisión de licencia se documenta en [ADR 0007](docs/adr/0007-licencia.md).
