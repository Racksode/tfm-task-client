# CRM operativo con IA para gestión de clientes, tareas y tiempos

Proyecto Final de Máster orientado al desarrollo de un MVP funcional de una plataforma SaaS para la gestión de clientes, proyectos, tareas, tiempos de trabajo y generación asistida de reportes mediante inteligencia artificial.

## Objetivo

Desarrollar una aplicación web que permita gestionar clientes, proyectos y tareas, registrar tiempos de trabajo y generar reportes profesionales para el cliente con ayuda de inteligencia artificial.

## Estado actual del proyecto

El proyecto ha completado la arquitectura inicial del MVP y pasa a una fase breve de decisiones técnicas iniciales antes de crear el primer código ejecutable.

```text
Fase actual: Fase 4 - Inicio de implementación
Punto actual: persistencia inicial materializada con Prisma, PostgreSQL y migración inicial
Documento en curso: pendiente
```

Último hito completado:

```text
Migración inicial de Prisma ejecutada y versionada sobre PostgreSQL local con Docker Compose.
```

Próximo paso:

```text
Preparar la siguiente fase técnica: definir una capa prudente de acceso a datos antes de implementar funcionalidades de negocio.
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
- Vitest para testing mínimo.
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

Pendiente de definir.
