# Trabajo desde el IDE/ADE con agentes IA

> Documento interno de trabajo.  
> Este documento recoge las recomendaciones para trabajar el TFM desde un entorno de desarrollo asistido por IA, utilizando herramientas como Codex, Claude Code, Cursor u otros agentes similares.

---

## 1. Objetivo del documento

El objetivo de este documento es definir cómo trabajar el proyecto desde el IDE/ADE con agentes de inteligencia artificial, manteniendo el control del alcance, la calidad del código, la documentación y la trazabilidad mediante Git.

A partir de este punto, el proyecto puede empezar a trabajarse dentro del entorno de desarrollo, pero evitando comenzar a programar sin una estructura previa.

La idea principal es utilizar los agentes IA como apoyo operativo, no como sustitutos de la planificación técnica.

---

## 2. Enfoque general

Se recomienda trabajar desde el IDE/ADE con agentes como Codex, Claude Code, Cursor u otros asistentes similares, pero siempre bajo una metodología controlada.

El objetivo no es pedir al agente que construya todo el proyecto de golpe, sino avanzar por fases pequeñas, revisables y trazables.

El flujo recomendado es:

```text
1. Analizar
2. Planificar
3. Validar
4. Implementar
5. Revisar
6. Documentar
7. Commit
```

---

## 3. Reparto de responsabilidades entre herramientas

### 3.1 ChatGPT

ChatGPT se utilizará principalmente como apoyo de dirección, análisis y documentación del proyecto.

Uso recomendado:

- Definir alcance del TFM.
- Revisar si una funcionalidad es demasiado grande.
- Preparar documentación formal.
- Redactar secciones de la memoria.
- Definir requisitos.
- Diseñar módulos.
- Validar decisiones técnicas.
- Preparar textos para la presentación.
- Revisar coherencia entre MVP y evolución futura.

Rol principal:

```text
Dirección técnica, análisis funcional y documentación del TFM.
```

---

### 3.2 Codex

Codex se utilizará preferentemente dentro del IDE para tareas concretas de desarrollo sobre el repositorio.

Uso recomendado:

- Crear estructura inicial del proyecto.
- Generar componentes.
- Crear modelos o entidades.
- Implementar funcionalidades concretas.
- Escribir tests.
- Revisar errores.
- Refactorizar código.
- Ejecutar tareas controladas.
- Actualizar documentación técnica relacionada con cambios de código.

Rol principal:

```text
Agente operativo de desarrollo dentro del repositorio.
```

Ejemplo de prompt:

```text
Lee AGENTS.md y docs/00-vision-y-alcance.md.
Propón una estructura inicial para una aplicación Next.js + TypeScript + PostgreSQL.
No crees ficheros todavía. Primero dame el plan.
```

---

### 3.3 Claude Code

Claude Code puede utilizarse para análisis más amplio del codebase, cambios multiarchivo, revisión de arquitectura y refactorizaciones.

Uso recomendado:

- Analizar varios ficheros del proyecto.
- Revisar consistencia entre código y documentación.
- Proponer estructuras de módulos.
- Refactorizar lógica compleja.
- Revisar nombres, responsabilidades y separación de capas.
- Ayudar a mantener documentación técnica.

Rol principal:

```text
Agente de análisis de codebase, refactorización y revisión técnica.
```

Ejemplo de prompt:

```text
Lee AGENTS.md, README.md y docs/00-vision-y-alcance.md.
Propón las entidades iniciales para clientes, proyectos, tareas y registros de tiempo.
No implementes todavía. Devuelve solo el análisis y el plan.
```

---

### 3.4 Cursor

Cursor puede utilizarse como IDE asistido para trabajar de forma interactiva con el código.

Uso recomendado:

- Navegar por el proyecto.
- Modificar ficheros con contexto.
- Revisar errores en tiempo real.
- Generar código bajo supervisión.
- Consultar partes concretas del codebase.

Rol principal:

```text
Entorno de desarrollo asistido con contexto del proyecto.
```

---

### 3.5 Perplexity

Perplexity se recomienda únicamente como herramienta de investigación externa.

Uso recomendado:

- Consultar documentación actualizada.
- Comparar herramientas.
- Revisar APIs externas.
- Validar tecnologías.
- Buscar referencias sobre OWASP, testing, accesibilidad, despliegue, etc.

No se recomienda usar Perplexity para modificar directamente el repositorio.

Rol principal:

```text
Investigación y contraste de información externa.
```

---

### 3.6 LM Studio

LM Studio puede utilizarse como parte de la experimentación con modelos locales.

Uso recomendado:

- Probar LLMs en local.
- Evaluar privacidad y ejecución offline.
- Comparar resultados entre modelos locales y modelos cloud.
- Documentar pruebas como parte experimental del TFM.

No se recomienda convertir LM Studio en una dependencia principal del SaaS en el MVP inicial, salvo que se decida explícitamente más adelante.

Rol principal:

```text
Experimentación con LLM local y análisis comparativo.
```

---

## 4. Trabajar siempre en modo plan

Se recomienda trabajar siempre con los agentes en modo plan antes de permitir modificaciones en el repositorio.

La regla general será:

```text
Primero analizar y proponer.
Después implementar.
```

### 4.1 Prompt base para análisis

```text
Analiza el contexto del proyecto leyendo README.md, AGENTS.md y la documentación relevante en /docs.
Propón un plan de trabajo para implementar esta funcionalidad.
No modifiques ningún fichero todavía.
Indica qué ficheros crearías o modificarías y por qué.
```

### 4.2 Prompt base para implementación

```text
Aplica el plan aprobado.
Haz cambios pequeños y coherentes.
No amplíes el alcance sin indicarlo antes.
Al finalizar, resume los ficheros modificados y sugiere un mensaje de commit.
```

### 4.3 Prompt base para revisión

```text
Revisa los cambios realizados.
Comprueba si cumplen con AGENTS.md, el alcance del MVP y la documentación existente.
Detecta posibles errores, riesgos de seguridad, deuda técnica o mejoras necesarias.
No modifiques ficheros todavía.
```

---

## 5. Normas para evitar descontrol del proyecto

Los agentes no deben ampliar el alcance del TFM sin justificación.

Reglas recomendadas:

- No implementar funcionalidades futuras como si fueran parte del MVP.
- No añadir dependencias sin justificar su necesidad.
- No crear módulos grandes de golpe.
- No mezclar frontend, backend, base de datos y documentación en una misma tarea salvo que sea necesario.
- No modificar muchos ficheros sin explicar el motivo.
- No generar código que no se entienda o no pueda defenderse en el TFM.
- No asumir integraciones externas reales sin haberlas documentado antes.
- No introducir complejidad innecesaria.

---

## 6. Orden recomendado de trabajo desde el IDE

Antes de empezar con el código funcional, se recomienda preparar el entorno documental y las reglas del proyecto.

Orden recomendado:

```text
1. Crear o revisar README.md
2. Crear o revisar .gitignore
3. Crear carpeta docs/
4. Crear carpeta docs/adr/
5. Crear AGENTS.md
6. Crear CLAUDE.md y/o GEMINI.md redirigiendo a AGENTS.md, si procede
7. Hacer primer commit documental
8. Definir stack definitivo
9. Crear ADR de arquitectura
10. Crear estructura base del proyecto
11. Implementar MVP por módulos pequeños
```

---

## 7. AGENTS.md

El fichero `AGENTS.md` será el documento principal de instrucciones para los agentes IA que trabajen dentro del repositorio.

Debe incluir, como mínimo:

- Idioma del proyecto.
- Alcance del MVP.
- Funcionalidades fuera del alcance inicial.
- Convención de commits.
- Normas de documentación.
- Reglas de seguridad.
- Reglas de testing.
- Criterios de calidad.
- Restricciones sobre dependencias.
- Forma de trabajar en modo plan.

Ejemplo de contenido inicial:

```md
# AGENTS.md

## Idioma

El proyecto se documenta en español.
Los comentarios principales y la documentación deben mantenerse en español.

## Alcance

El objetivo del TFM es desarrollar un MVP de una plataforma SaaS para gestión de clientes, proyectos, tareas, tiempos y reportes asistidos por IA.

No se deben implementar funcionalidades futuras sin indicarlo previamente.

## Forma de trabajo

Antes de modificar ficheros, el agente debe proponer un plan.
Los cambios deben ser pequeños, revisables y coherentes.

## Commits

Se utilizará una convención basada en Conventional Commits.
El tipo del commit se escribirá en inglés y la descripción en español.

Ejemplos:

- docs: añadir visión inicial del proyecto
- feat: implementar gestión básica de clientes
- fix: corregir validación de tiempos solapados
- refactor: separar lógica de cálculo de costes
```

---

## 8. CLAUDE.md, GEMINI.md y otros ficheros de agente

Si se utilizan herramientas que esperan ficheros específicos como `CLAUDE.md` o `GEMINI.md`, se recomienda no duplicar instrucciones.

En su lugar, estos ficheros pueden redirigir a `AGENTS.md`.

Ejemplo:

```md
# CLAUDE.md

Las instrucciones principales del proyecto se encuentran en:

[AGENTS.md](AGENTS.md)
```

Esto evita inconsistencias entre agentes.

---

## 9. Uso de Git durante el trabajo con agentes

Git será la herramienta principal para mantener trazabilidad del proyecto.

Se recomienda trabajar con cambios pequeños y commits frecuentes.

### 9.1 Rama principal

Para un proyecto nuevo se recomienda utilizar:

```text
main
```

### 9.2 Ramas opcionales

Para una estructura sencilla:

```text
main      -> versión estable / entregable
develop   -> integración de cambios
feature/* -> ramas de trabajo
```

Ejemplos:

```text
feature/documentacion-inicial
feature/modulo-clientes
feature/modulo-tareas
feature/control-tiempos
feature/reportes-ia
```

Para el inicio del TFM puede ser suficiente trabajar solo con `main` y añadir ramas más adelante.

---

## 10. Convención de commits

Se recomienda utilizar una convención basada en Conventional Commits.

El tipo del commit se escribirá en inglés por compatibilidad con estándares y herramientas.
La descripción se escribirá en español para mantener coherencia con la documentación del TFM.

Formato:

```text
<tipo>: <descripción en español>
```

Tipos habituales:

```text
docs     -> documentación
feat     -> nueva funcionalidad
fix      -> corrección de errores
refactor -> refactorización
test     -> pruebas
chore    -> tareas de mantenimiento
style    -> formato sin cambio funcional
ci       -> integración continua
build    -> configuración de build o dependencias
```

Ejemplos:

```text
docs: crear estructura documental inicial del TFM
docs: añadir hoja de ruta interna del TFM
chore: añadir gitignore inicial del proyecto
feat: implementar alta y edición de clientes
feat: añadir registro manual de tiempos
feat: implementar inicio y parada de tareas
fix: evitar solapamiento de tareas activas
refactor: separar lógica de cálculo de tiempos
test: añadir pruebas para registros de tiempo
```

---

## 11. Primeros commits recomendados

Una posible secuencia inicial sería:

```text
docs: crear estructura documental inicial del TFM
chore: añadir gitignore inicial del proyecto
docs: añadir hoja de ruta interna del TFM
docs: añadir instrucciones para agentes IA
docs: documentar metodología de trabajo desde el IDE
```

---

## 12. Stack tecnológico candidato

El stack todavía puede ajustarse, pero como punto de partida se contempla:

```text
Node.js
React
TypeScript
Next.js
PostgreSQL
GitHub
Docker
Notebook LLM / herramientas IA
```

Antes de crear la base técnica del proyecto, se recomienda documentar la decisión mediante un ADR.

Ejemplo:

```text
docs/adr/0001-eleccion-stack-tecnologico.md
```

---

## 13. Cuándo usar agentes dentro del IDE

Se recomienda usar agentes dentro del IDE para:

- Crear estructura de carpetas.
- Implementar módulos pequeños.
- Generar código repetitivo.
- Crear pruebas.
- Revisar errores.
- Refactorizar.
- Revisar seguridad.
- Revisar accesibilidad.
- Mantener documentación técnica.
- Generar ejemplos de uso.

No se recomienda usarlos para:

- Reescribir todo el proyecto sin revisión.
- Introducir nuevas funcionalidades fuera del MVP.
- Añadir librerías sin justificación.
- Cambiar arquitectura sin ADR.
- Crear código que no pueda explicarse en la defensa del TFM.

---

## 14. Flujo recomendado por funcionalidad

Para cada funcionalidad del MVP se recomienda seguir este flujo:

```text
1. Definir requisito
2. Crear o actualizar documentación
3. Pedir plan al agente
4. Revisar plan
5. Implementar cambios
6. Ejecutar pruebas
7. Revisar seguridad y calidad
8. Actualizar documentación si procede
9. Hacer commit
```

Ejemplo para el módulo de clientes:

```text
1. Documentar requisitos básicos del módulo de clientes
2. Pedir al agente propuesta de modelo y endpoints
3. Revisar la propuesta
4. Implementar entidad cliente
5. Implementar pantalla/listado básico
6. Añadir pruebas mínimas
7. Actualizar documentación
8. Commit: feat: implementar gestión básica de clientes
```

---

## 15. Calidad, seguridad y testing desde el IDE

Los agentes IA deben ayudar a mantener la calidad del proyecto desde el inicio.

Aspectos a revisar:

- Buenas prácticas.
- Responsabilidad única.
- Reutilización de componentes.
- Separación de responsabilidades.
- Validación de datos.
- Gestión de errores.
- Seguridad desde diseño.
- OWASP Top Ten.
- Tests unitarios.
- Tests E2E cuando proceda.
- Coverage.
- Accesibilidad.
- Usabilidad.
- Debugging.
- Monitorización futura.

---

## 16. Integración con documentación

Cada cambio técnico relevante debe reflejarse en la documentación cuando afecte a:

- Alcance del MVP.
- Arquitectura.
- Modelo de datos.
- Seguridad.
- Integraciones.
- Uso de IA.
- Pruebas.
- Despliegue.

La documentación no debe quedar como un elemento final separado, sino como una parte viva del proyecto.

---

## 17. Recomendación final

Sí se recomienda trabajar desde el IDE/ADE con agentes IA, pero siguiendo una metodología controlada.

Resumen del enfoque:

```text
ChatGPT       -> dirección, alcance, memoria y documentación
Codex         -> ejecución de tareas dentro del repositorio
Claude Code   -> análisis multiarchivo y refactorización
Cursor        -> IDE asistido con contexto
Perplexity    -> investigación externa
LM Studio     -> experimentación con LLM local
Git           -> trazabilidad y control de evolución
AGENTS.md     -> reglas del juego para los agentes
```

La primera tarea recomendada dentro del IDE es crear o revisar `AGENTS.md` y hacer un primer commit documental antes de iniciar la implementación funcional.

