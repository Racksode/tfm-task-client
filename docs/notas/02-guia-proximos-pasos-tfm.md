# Guía de próximos pasos del TFM

> Documento interno de trabajo.  
> Define el orden recomendado de trabajo a partir de la estructura documental inicial ya creada.

## 1. Objetivo de esta guía

Esta guía sirve como referencia para decidir por dónde continuar el proyecto una vez creada la estructura documental inicial del TFM.

El objetivo es evitar empezar a programar demasiado pronto y cerrar primero una base funcional y técnica mínima que permita trabajar con agentes IA dentro del IDE sin perder el control del alcance.

## 2. Enfoque general

A partir de este punto se trabajará en dos carriles:

```text
ChatGPT = dirección, revisión, decisiones y control de alcance
IDE + agentes IA = ejecución sobre el repositorio
```

ChatGPT se utilizará para:

- decidir si una funcionalidad entra o no en el MVP
- revisar decisiones importantes
- preparar argumentos para la memoria del TFM
- validar arquitectura
- detectar si el proyecto se está haciendo demasiado grande

El IDE con agentes IA se utilizará para:

- modificar documentos
- crear estructura técnica
- generar código
- crear tests
- revisar ficheros
- proponer commits
- ejecutar tareas concretas sobre el repositorio

## 3. No empezar todavía por código

Aunque ya existe una estructura inicial del proyecto, no se recomienda empezar todavía con backend o frontend.

Antes de crear la aplicación técnica, conviene cerrar una fase mínima de análisis funcional y diseño técnico.

El siguiente objetivo será:

```text
Cerrar el alcance funcional del MVP
```

## 4. Siguiente fase recomendada

La siguiente fase del proyecto será:

```text
Fase 2: diseño funcional
```

El primer documento a trabajar será:

```text
docs/01-requisitos-funcionales.md
```

Este documento debe dejar claro qué funcionalidades entran realmente en el MVP del TFM.

## 5. Orden recomendado de trabajo

## 5.1. Requisitos funcionales

Documento:

```text
docs/01-requisitos-funcionales.md
```

Objetivo:

- definir funcionalidades del MVP
- separar funcionalidades futuras
- describir actores principales
- definir casos de uso básicos
- preparar historias de usuario

Funcionalidades candidatas del MVP:

- login
- roles básicos
- gestión de clientes
- gestión de proyectos
- gestión de tareas
- registro manual de tiempos
- sistema start/stop
- prevención de solapamientos
- generación de reportes
- área básica de cliente
- resumen asistido por IA

Commit recomendado:

```text
docs: definir requisitos funcionales del MVP
```

## 5.2. Requisitos no funcionales

Documento:

```text
docs/02-requisitos-no-funcionales.md
```

Objetivo:

- definir criterios de seguridad
- definir mantenibilidad
- definir usabilidad
- definir accesibilidad básica
- definir testing
- definir rendimiento razonable
- definir privacidad y trazabilidad

Temas a incluir:

- seguridad desde diseño
- OWASP Top Ten
- control de permisos
- validación de datos
- responsive
- testing unitario
- testing E2E si procede
- cobertura en partes críticas
- auditoría básica

Commit recomendado:

```text
docs: definir requisitos no funcionales del MVP
```

## 5.3. Modelo de datos inicial

Documento:

```text
docs/03-modelo-datos.md
```

Objetivo:

- definir entidades principales
- definir relaciones
- preparar el modelo conceptual
- evitar entrar todavía en migraciones o SQL definitivo

Entidades candidatas:

- Usuario
- Cliente
- Proyecto
- Tarea
- RegistroTiempo
- Tarifa
- Reporte
- FacturaDocumento

Relaciones principales:

```text
Cliente -> Proyectos
Proyecto -> Tareas
Tarea -> Registros de tiempo
Cliente -> Usuarios cliente
Reporte -> Tareas / tiempos
```

Commit recomendado:

```text
docs: definir modelo de datos inicial
```

## 5.4. Arquitectura inicial

Documentos:

```text
docs/04-arquitectura.md
docs/adr/0001-eleccion-arquitectura.md
docs/adr/0002-eleccion-base-datos.md
docs/adr/0003-integracion-ia.md
```

Objetivo:

- definir arquitectura general
- decidir stack tecnológico
- justificar decisiones técnicas
- preparar la base antes de crear código

Stack candidato:

- Next.js
- TypeScript
- React
- PostgreSQL
- Docker
- GitHub
- proveedor IA externo para la primera versión

Decisiones pendientes:

- Prisma o Drizzle
- tipo de autenticación
- estructura del proyecto
- despliegue inicial
- estrategia de integración IA

Commit recomendado:

```text
docs: definir arquitectura inicial del proyecto
```

## 6. Trabajo desde el IDE

A partir de ahora, se recomienda trabajar desde el IDE, pero en modo controlado.

Antes de pedir cambios a Codex, Claude Code, Cursor u otro agente, se debe pedir primero un plan.

Ejemplo de prompt:

```text
Lee README.md, AGENTS.md, docs/00-vision-y-alcance.md y docs/09-plan-trabajo-y-control-alcance.md.

Quiero completar docs/01-requisitos-funcionales.md con el alcance realista del MVP del TFM.

Primero propón un plan de secciones y requisitos.
No modifiques ficheros todavía.
```

Después de revisar el plan, se podrá pedir:

```text
Aplica el plan aprobado sobre docs/01-requisitos-funcionales.md.
Mantén el alcance limitado al MVP.
Indica los cambios realizados y sugiere un commit.
```

## 7. Uso de ramas

Para esta fase puede trabajarse con ramas sencillas.

Rama recomendada para el siguiente paso:

```text
feature/requisitos-funcionales
```

Flujo recomendado:

```text
git checkout -b feature/requisitos-funcionales
```

Trabajar el documento:

```text
docs/01-requisitos-funcionales.md
```

Commit:

```text
docs: definir requisitos funcionales del MVP
```

Después, repetir el proceso con:

```text
feature/requisitos-no-funcionales
feature/modelo-datos
feature/arquitectura-inicial
```

## 8. Cuándo empezar a programar

No se recomienda empezar con backend/frontend hasta tener mínimamente cerrados estos documentos:

```text
docs/01-requisitos-funcionales.md
docs/02-requisitos-no-funcionales.md
docs/03-modelo-datos.md
docs/04-arquitectura.md
```

Una vez cerrados, se podrá iniciar la creación técnica del proyecto.

Ejemplo:

```text
npx create-next-app
```

o la estructura técnica que se decida finalmente.

## 9. Criterio principal

El criterio principal será:

```text
Primero cerrar el MVP.
Después implementar.
Después mejorar.
```

No se debe avanzar añadiendo funcionalidades porque la IA las pueda generar rápidamente.

El objetivo del TFM es construir un proyecto limitado, coherente, defendible y con una buena trazabilidad de decisiones.

## 10. Próxima acción concreta

La próxima acción recomendada es:

```text
Crear rama feature/requisitos-funcionales
Completar docs/01-requisitos-funcionales.md
Hacer commit docs: definir requisitos funcionales del MVP
```

A partir de ahí se continuará con requisitos no funcionales, modelo de datos y arquitectura.
