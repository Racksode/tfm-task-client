# Histórico IA - Decisiones técnicas iniciales

## Estado

Plan literal disponible

## Contexto

Tras cerrar la arquitectura inicial del MVP, el proyecto entra en una fase breve de decisiones técnicas previas al primer código ejecutable.

El objetivo es evitar comenzar la implementación a ciegas, sin generar documentación excesiva ni ampliar el alcance del TFM.

## Prompt inicial

Se solicitó leer la documentación principal del repositorio y proponer un plan para definir las decisiones técnicas iniciales necesarias antes de crear el primer código ejecutable del MVP.

El trabajo debía cubrir:

- stack tecnológico
- base de datos concreta
- ORM o estrategia de acceso a datos
- autenticación
- estructura inicial del proyecto
- patrones básicos de organización
- testing mínimo

Restricciones principales:

- no crear código
- no instalar dependencias
- no inicializar Next.js
- no crear migraciones
- no modificar requisitos, modelo de datos, arquitectura ni ADRs ya cerrados salvo propuesta explícita
- no sobrediseñar
- mantener el alcance del MVP
- separar decisiones actuales del MVP de posibles líneas futuras del SaaS

## Plan propuesto por IA

```markdown
# Plan: Decisiones Técnicas Iniciales del MVP

## 1. Objetivo Del Cambio

Definir la documentación técnica mínima necesaria para iniciar después el primer código ejecutable del MVP sin desarrollar a ciegas, manteniendo el alcance del TFM y evitando documentación extensa.

La fase no implementará código, no instalará dependencias, no inicializará Next.js y no modificará requisitos, modelo conceptual, arquitectura ni ADRs ya aceptados, salvo referencias mínimas si se aprueban explícitamente.

## 2. Ficheros Afectados

Crear:

- `docs/adr/0004-eleccion-stack-tecnologico.md`
- `docs/adr/0005-persistencia-y-acceso-datos.md`
- `docs/adr/0006-autenticacion-y-control-acceso.md`
- `docs/adr/0007-estructura-proyecto-y-testing.md`
- `docs/planes/05-decisiones-tecnicas-iniciales.md`
- `docs/historico-ia/fase-03-decisiones-tecnicas/01-decisiones-tecnicas-iniciales.md`

Opcional, solo si se aprueba:

- `README.md`, para cambiar `Documento en curso: pendiente` por el ADR o plan correspondiente.
- `docs/04-arquitectura.md`, solo con una nota breve de que las decisiones aplazadas han sido concretadas en los ADRs 0004-0007, sin reescribir arquitectura.

## 3. ADRs Y Decisiones

### ADR 0004 - Elección De Stack Tecnológico

Decisión propuesta para el MVP:

- Next.js con App Router.
- React.
- TypeScript.
- Aplicación monolítica modular en un único proyecto.
- Docker solo como apoyo para PostgreSQL local, no como infraestructura compleja.
- GitHub como repositorio y control de versiones.

Alternativas a comparar:

- Next.js frente a React + API separada.
- Next.js frente a Laravel/Rails/Django.
- TypeScript frente a JavaScript.
- Docker local mínimo frente a instalación local directa de PostgreSQL.

Riesgos:

- App Router puede añadir curva de aprendizaje.
- Next.js puede mezclar UI y backend si no se disciplina la organización interna.
- Docker puede ser una carga si se usa más allá de levantar servicios locales.

### ADR 0005 - Persistencia Y Acceso A Datos

Decisión propuesta para el MVP:

- PostgreSQL como base de datos concreta.
- Prisma como ORM y herramienta de migraciones.
- Acceso a datos encapsulado en módulos/casos de uso, evitando consultas dispersas desde la UI.
- Migraciones aplazadas a la fase de implementación.

Alternativas a comparar:

- PostgreSQL frente a SQLite.
- PostgreSQL frente a MySQL/MariaDB.
- Prisma frente a Drizzle.
- Prisma frente a SQL directo.

Riesgos:

- Prisma añade una capa adicional y dependencia concreta.
- PostgreSQL exige entorno local o contenedor.
- El esquema físico puede revelar ajustes necesarios sobre el modelo conceptual, que deberán documentarse sin reabrir el alcance funcional.

### ADR 0006 - Autenticación Y Control De Acceso

Decisión propuesta para el MVP:

- Auth.js/NextAuth integrado en Next.js.
- Autenticación básica con email y contraseña para el MVP.
- Roles mínimos: `interno` y `cliente`.
- Asociación de usuarios cliente a un cliente concreto.
- Control de visibilidad aplicado en servidor, no solo en interfaz.
- Sin OAuth, SSO, magic links, multiempresa avanzada ni matriz compleja de permisos.

Alternativas a comparar:

- Auth.js frente a autenticación propia.
- Auth.js frente a Supabase Auth.
- Auth.js frente a Clerk/Auth0.
- Email/password frente a proveedores OAuth.

Riesgos:

- La autenticación con contraseña obliga a cuidar hashing, sesiones y secretos.
- El control de acceso debe probarse bien para evitar accesos cruzados entre clientes.
- Un proveedor externo reduciría implementación, pero puede añadir dependencia comercial innecesaria para el TFM.

### ADR 0007 - Estructura Del Proyecto, Patrones Y Testing

Decisión propuesta para el MVP:

- Organización por dominios funcionales: clientes, proyectos, tareas, tiempos, reportes, IA, área cliente y trazabilidad.
- Separación básica entre UI, validación, casos de uso/reglas de negocio y acceso a datos.
- Validación con esquemas reutilizables.
- Testing mínimo con Vitest para reglas críticas.
- Pruebas de integración ligeras para flujos principales cuando exista base ejecutable.
- Playwright queda como recomendable aplazable, no requisito inicial.

Alternativas a comparar:

- Organización por dominios frente a organización por tipo técnico.
- Casos de uso explícitos frente a lógica directamente en acciones/controladores.
- Vitest frente a Jest.
- Testing unitario mínimo frente a E2E temprano.

Riesgos:

- Demasiadas capas podrían sobrediseñar el MVP.
- Muy poca separación dificultaría probar reglas críticas.
- E2E temprano puede consumir tiempo antes de tener flujos estables.

## 4. Pasos Propuestos

1. Crear los cuatro ADRs técnicos con contexto, decisión, alternativas, consecuencias y límites de alcance.
2. Mantener cada ADR breve y orientado a decisiones necesarias para empezar a implementar.
3. Crear `docs/planes/05-decisiones-tecnicas-iniciales.md` como resumen metodológico formal del plan aprobado.
4. Crear el histórico ampliado en `docs/historico-ia/fase-03-decisiones-tecnicas/01-decisiones-tecnicas-iniciales.md`.
5. No tocar código, dependencias, migraciones ni estructura ejecutable del proyecto.
6. Si se aprueba, actualizar mínimamente README y/o arquitectura solo para referenciar los nuevos ADRs.

## 5. Qué Queda Aplazado Para Implementación

- Inicializar Next.js.
- Crear `package.json`.
- Instalar dependencias.
- Crear Docker Compose.
- Definir el esquema Prisma real.
- Crear migraciones.
- Implementar autenticación.
- Crear pantallas, rutas o componentes.
- Escribir tests reales.
- Elegir proveedor concreto de IA o prompts definitivos.
- Definir despliegue final.

## 6. Clasificación De Alcance

- Imprescindible para el MVP: stack, PostgreSQL, Prisma, Auth.js, estructura modular, testing mínimo.
- Recomendable pero aplazable: Playwright, Docker más elaborado, despliegue final, documentación ampliada de patrones.
- Línea futura SaaS: multiempresa avanzada, SSO/OAuth avanzado, observabilidad completa, CI/CD completo, servicios separados.
- Descartado para el TFM inicial: microservicios, integración completa con Holded, agentes externos, WhatsApp/email, ejecución autónoma por IA.

## 7. Posible Commit Asociado

`docs: definir decisiones técnicas iniciales del MVP`
```

## Revisión humana

El plan fue aprobado con ajustes:

- Crear solo los ADRs 0004, 0005 y 0006.
- No crear `docs/adr/0007-estructura-proyecto-y-testing.md`.
- Integrar estructura inicial, organización por dominios, separación de responsabilidades y testing mínimo dentro del ADR 0004.
- Comparar con cuidado en el ADR 0006 Auth.js/NextAuth con Credentials Provider, autenticación propia sencilla y proveedores externos.
- No cerrar decisiones sobre recuperación de contraseña, OAuth, SSO, magic links ni matriz avanzada de permisos.
- No modificar README, arquitectura, requisitos, modelo de datos ni ADRs ya cerrados.

## Resultado aplicado

Se crearon los documentos:

- `docs/adr/0004-eleccion-stack-tecnologico.md`
- `docs/adr/0005-persistencia-y-acceso-datos.md`
- `docs/adr/0006-autenticacion-y-control-acceso.md`
- `docs/planes/05-decisiones-tecnicas-iniciales.md`
- `docs/historico-ia/fase-03-decisiones-tecnicas/01-decisiones-tecnicas-iniciales.md`

Las decisiones quedaron limitadas al MVP:

- Next.js, React y TypeScript como stack inicial.
- PostgreSQL como base de datos concreta.
- Prisma como ORM y herramienta de migraciones.
- Auth.js/NextAuth con Credentials Provider como autenticación inicial.
- Organización modular por dominios funcionales.
- Separación básica entre UI, validación, casos de uso/reglas de negocio y acceso a datos.
- Vitest como testing mínimo.
- Playwright como recomendable aplazable.

## Alcance no aplicado

No se creó código ejecutable.

No se instalaron dependencias.

No se inicializó Next.js.

No se crearon migraciones.

No se modificaron documentos ya cerrados.

No se cerraron decisiones avanzadas de autenticación ni permisos.

## Commit sugerido

`docs: definir decisiones técnicas iniciales del MVP`
