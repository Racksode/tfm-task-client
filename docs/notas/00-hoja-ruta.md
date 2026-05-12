# Hoja de ruta del TFM: Desarrollo de un SaaS con IA

> Documento interno de trabajo. Idioma: Español.  
> Este documento organiza ideas, dudas, líneas de investigación, metodología y entregables relacionados con el Trabajo Final de Máster.

---

## 1. Contexto general

El proyecto se plantea como un Trabajo Final de Máster vinculado al desarrollo de una aplicación SaaS utilizando inteligencia artificial como apoyo durante el proceso de análisis, diseño, implementación, pruebas, documentación y presentación.

La idea inicial gira en torno a una aplicación de gestión de tareas, clientes, tiempos y reportes, aunque todavía se mantiene abierta la posibilidad de ajustar el tipo exacto de producto en función de su viabilidad, interés académico y potencial comercial posterior.

El proyecto no solo debe demostrar la creación de una aplicación funcional, sino también el uso de herramientas, buenas prácticas, metodologías modernas y asistentes/agentes IA durante el flujo completo de desarrollo.

---

## 2. Preguntas estratégicas iniciales

Antes de cerrar el alcance definitivo del TFM, conviene responder algunas preguntas clave:

### 2.1. Valor del título universitario

Pregunta pendiente:

> ¿Sale a cuenta el título universitario?

Esta cuestión puede abordarse desde dos perspectivas:

- Valor académico y curricular del máster.
- Valor práctico del proyecto desarrollado como producto real o demostrable.

El TFM puede tener valor adicional si se plantea no solo como un ejercicio académico, sino como la base de un SaaS potencialmente monetizable.

### 2.2. Tipo de proyecto a desarrollar

Preguntas pendientes:

- ¿Conviene desarrollar un gestor de tareas?
- ¿Sería mejor otro tipo de aplicación?
- ¿Debe ser un proyecto abierto u orientado a producto privado?
- ¿Qué tipo de producto podría tener más recorrido comercial?

Idea actual:

> SaaS de gestión de clientes, proyectos, tareas, tiempos, costes y reportes asistido por IA.

### 2.3. Proyecto abierto o privado

Si el proyecto se plantea como abierto, habrá que definir cómo se obtendrían beneficios:

- Versión open source con servicios premium.
- SaaS alojado de pago.
- Soporte, implantación o personalización.
- Plugins o módulos avanzados.
- Licencia dual.
- Marca personal y captación de clientes.

Si el proyecto se plantea como privado, el foco estaría más en:

- Modelo SaaS comercial.
- Protección del código.
- Venta de suscripciones.
- Uso interno inicial y posterior comercialización.

### 2.4. Nombre y dominio

Pendiente:

- Buscar nombre del producto.
- Comprobar disponibilidad de dominio.
- Valorar si conviene registrar dominio desde el inicio.
- Definir si el nombre será académico, comercial o ambos.

---

## 3. Objetivo del proyecto

El objetivo principal es desarrollar un MVP funcional de una aplicación SaaS que permita gestionar clientes, proyectos, tareas, tiempos de trabajo, costes y reportes, incorporando inteligencia artificial en partes concretas del flujo.

El proyecto debe permitir explicar:

- Qué problema resuelve.
- Qué solución propone.
- Cómo se ha diseñado.
- Cómo se ha desarrollado.
- Qué papel ha tenido la IA durante el proceso.
- Qué buenas prácticas se han aplicado.
- Qué posibilidades de evolución comercial tiene.

---

## 4. Problemas que debe resolver el gestor de tareas

El sistema debería resolver problemas habituales en profesionales, autónomos y pequeñas empresas de servicios:

- Falta de trazabilidad sobre tareas realizadas.
- Dificultad para justificar horas al cliente.
- Información dispersa entre correos, hojas de cálculo, documentos y mensajes.
- Ausencia de reportes claros de trabajo.
- Dificultad para calcular costes reales.
- Falta de visibilidad para el cliente.
- Falta de histórico centralizado por cliente/proyecto.

---

## 5. Alcance funcional inicial

El alcance funcional inicial puede centrarse en:

- Gestión de clientes.
- Gestión de proyectos.
- Gestión de tareas.
- Registro manual de tiempos.
- Registro start/stop de tareas.
- Cálculo básico de horas y costes.
- Generación de reportes.
- Área básica de cliente.
- Uso de IA para resumir tareas, generar textos o interpretar instrucciones.

---

## 6. Fases del proyecto

El desarrollo del TFM puede organizarse en las siguientes etapas:

1. Análisis.
2. Diseño.
3. Implementación.
4. Buenas prácticas.
5. Testing.
6. Seguridad.
7. Accesibilidad.
8. Usabilidad.
9. Calidad.
10. Despliegue.
11. Presentación.

---

## 7. Análisis funcional

Durante la fase de análisis se deberán definir:

- Historias de usuario.
- Casos de uso.
- Requisitos funcionales.
- Requisitos no funcionales.
- Actores del sistema.
- Roles y permisos.
- Flujos principales.
- Reglas de negocio.

### 7.1. Historias de usuario

Ejemplos:

- Como administrador, quiero crear clientes para organizar los trabajos asociados a cada uno.
- Como usuario interno, quiero registrar tiempos en una tarea para poder justificar el trabajo realizado.
- Como cliente, quiero consultar el estado de mis tareas para conocer la evolución del proyecto.
- Como usuario interno, quiero generar un reporte de horas para enviarlo al cliente.
- Como usuario interno, quiero usar IA para convertir notas técnicas en un resumen claro para el cliente.

### 7.2. Casos de uso

Casos de uso iniciales:

- Alta de cliente.
- Creación de proyecto.
- Creación de tarea.
- Inicio de tarea con temporizador.
- Finalización de tarea.
- Registro manual de tiempo.
- Generación de reporte.
- Consulta de reportes por parte del cliente.
- Generación de resumen asistido por IA.

---

## 8. Diseño y arquitectura

Una de las decisiones importantes será definir qué tipo de arquitectura aplicar.

Preguntas pendientes:

- ¿Aplicar Clean Architecture?
- ¿Usar arquitectura por servicios?
- ¿Crear un modular monolith?
- ¿Separar frontend y backend?
- ¿Aplicar una arquitectura orientada a dominios?

### 8.1. Posible enfoque recomendado

Para un TFM, puede tener sentido utilizar una arquitectura modular y limpia, sin sobredimensionar el sistema.

Enfoque posible:

- Frontend separado.
- Backend API.
- Base de datos relacional.
- Módulos por dominio funcional.
- Capa de servicios.
- Capa de acceso a datos.
- Separación entre lógica de negocio e infraestructura.

### 8.2. Patrones y principios

Se recomienda contemplar:

- Principio de responsabilidad única.
- Separación de responsabilidades.
- Reutilización de código.
- Componentización.
- Servicios reutilizables.
- Validaciones centralizadas.
- Código simple y mantenible.

---

## 9. Stack tecnológico inicial

Stack propuesto inicialmente:

- Node.js.
- React.
- TypeScript.
- Next.js.
- PostgreSQL.
- GitHub.
- Docker.
- Notebook LLM para apoyo, análisis o documentación.

Pendiente de validar:

- Framework backend definitivo.
- ORM o sistema de acceso a datos.
- Sistema de autenticación.
- Proveedor de IA.
- Sistema de despliegue.
- Herramienta de testing E2E.

---

## 10. Herramientas IA y entorno de desarrollo

Se plantea experimentar con varias herramientas de apoyo al desarrollo con IA.

Herramientas a instalar o probar:

- Air.
- Perplexity.
- Antigravity.
- Cursor.
- OpenCode.
- Claude Code.
- Codex.
- LM Studio para LLM en local.
- OpenClaw.
- Hermes u otros agentes.

### 10.1. Prompts y metodología de trabajo

Se contempla trabajar con prompts estructurados, incluyendo el uso de un enfoque tipo “caveman” para reducir ambigüedad y obligar a la IA a seguir instrucciones claras, simples y verificables.

Objetivos:

- Mejorar la precisión de las respuestas.
- Reducir interpretaciones erróneas.
- Generar tareas más pequeñas.
- Facilitar revisiones y validaciones.
- Trabajar en modo plan antes de ejecutar.

### 10.2. Trabajo en modo plan

Se valorará trabajar con los asistentes IA en modo plan, especialmente para:

- Análisis de requisitos.
- Diseño de arquitectura.
- División de tareas.
- Refactorizaciones.
- Revisión de seguridad.
- Generación de pruebas.
- Preparación de documentación.

El objetivo es evitar que la IA implemente directamente sin haber definido previamente el enfoque.

---

## 11. Desarrollo local, SSH y debugging

Se deben realizar pruebas trabajando en diferentes escenarios:

- Desarrollo en local.
- Desarrollo o ejecución mediante SSH.
- Debug en local.
- Debug en entorno remoto.

Objetivo:

- Validar el flujo de trabajo real de desarrollo.
- Documentar cómo ejecutar y depurar el proyecto.
- Comprobar que el entorno es reproducible.
- Preparar instrucciones claras para la memoria y la presentación.

---

## 12. Git, ramas y control de versiones

El proyecto deberá controlarse con Git desde el inicio.

Aspectos a probar y documentar:

- Rama principal `main`.
- Uso opcional de `develop`.
- Ramas `feature/*`.
- Commits descriptivos.
- Pull requests o merges simulados.
- Tags para hitos del TFM.

### 12.1. Convención de commits

Se recomienda utilizar una convención basada en Conventional Commits.

El tipo de commit se escribirá en inglés por compatibilidad con herramientas y estándares, mientras que la descripción se escribirá en español.

Ejemplos:

```text
docs: crear estructura documental inicial del TFM
feat: implementar gestión básica de clientes
feat: añadir registro start stop de tareas
fix: corregir cálculo de tiempos solapados
refactor: separar lógica de cálculo de costes
test: añadir pruebas unitarias de tareas
chore: añadir configuración inicial de Docker
```

### 12.2. Tipos de commit recomendados

- `docs`: cambios en documentación.
- `feat`: nueva funcionalidad.
- `fix`: corrección de errores.
- `refactor`: mejora interna sin cambiar comportamiento.
- `test`: pruebas.
- `chore`: tareas auxiliares, configuración o mantenimiento.
- `style`: formato o estilo sin cambios funcionales.
- `perf`: mejoras de rendimiento.
- `security`: cambios relacionados con seguridad, si se decide usar este tipo.

---

## 13. Documentación del proyecto

La documentación se organizará en ficheros Markdown.

### 13.1. README principal

El fichero `README.md` debe incluir:

- Objetivo del proyecto.
- Descripción breve.
- Stack tecnológico.
- Cómo instalar el proyecto.
- Cómo ejecutar el proyecto.
- Estructura del repositorio.
- Funcionalidades principales.
- Enlaces a la documentación ampliada.

### 13.2. Documentación en `/docs`

La carpeta `/docs` puede contener:

- Visión y alcance.
- Requisitos funcionales.
- Requisitos no funcionales.
- Arquitectura.
- Modelo de datos.
- IA.
- Integraciones.
- Seguridad.
- Testing.
- Despliegue.
- Metodología documental.

### 13.3. Documentación para agentes IA

Se contempla incluir ficheros específicos para orientar a herramientas IA:

- `AGENTS.md`.
- `CLAUDE.md`.
- `GEMINI.md`.
- Documentación de skills.

Propuesta:

- Usar `AGENTS.md` como documento principal para instrucciones de agentes.
- Redirigir `CLAUDE.md` y `GEMINI.md` hacia `AGENTS.md` para evitar duplicidad.

Ejemplo:

```md
# CLAUDE.md

Consultar las instrucciones principales del proyecto en:

@AGENTS.md
```

### 13.4. Skills y subagentes

Se valorará documentar:

- Skills del proyecto.
- Posibles subagentes.
- Reglas de uso de IA.
- Flujo de trabajo asistido.
- Base de conocimiento del proyecto.

Referencias anotadas:

- `agentskills.io`.
- `skills.sh`.
- Vídeo sobre flujo de desarrollo.
- Reglas, base de conocimiento y documentación.
- AGENTS.md.
- Skills.
- Subagentes.
- Taller finanzas.

---

## 14. Buenas prácticas de desarrollo

El proyecto debe demostrar la aplicación de buenas prácticas:

- Código limpio.
- Separación de responsabilidades.
- Reutilización de código.
- Componentes reutilizables.
- Nombres claros.
- Validaciones consistentes.
- Control de errores.
- Logging.
- Documentación actualizada.
- Revisión de seguridad.
- Testing.

---

## 15. Testing y calidad

Se deberán contemplar diferentes niveles de pruebas:

- Tests unitarios.
- Tests de integración.
- Tests E2E.
- Coverage.
- Validación manual de flujos críticos.
- Revisión de errores.
- Revisión de patrones.
- Revisión de seguridad.

### 15.1. TDD

Se valorará aplicar TDD en partes concretas del proyecto, especialmente en lógica de negocio:

- Cálculo de tiempos.
- Prevención de solapamientos.
- Cálculo de costes.
- Validación de estados de tareas.
- Generación de reportes.

No es necesario aplicar TDD a todo el proyecto, pero sí puede documentarse una aplicación práctica y razonada.

### 15.2. Calidad

Aspectos a considerar:

- Linting.
- Formateo automático.
- Tipado fuerte con TypeScript.
- Coverage mínimo razonable.
- Revisión de dependencias.
- Análisis de errores.
- Control de deuda técnica.

---

## 16. Seguridad

La seguridad debe tratarse como parte del diseño del proyecto, no como una fase final.

Conceptos a incluir:

- Seguridad desde el diseño.
- OWASP Top Ten.
- Validación de entradas.
- Control de permisos.
- Autenticación.
- Autorización.
- Protección de datos sensibles.
- Logs sin información sensible.
- Gestión segura de variables de entorno.
- Revisión de dependencias.
- Auditoría de acciones relevantes.

### 16.1. OWASP Top Ten

Se debe revisar cómo afectan al proyecto riesgos como:

- Control de acceso roto.
- Fallos criptográficos.
- Inyección.
- Diseño inseguro.
- Configuración incorrecta.
- Componentes vulnerables.
- Fallos de autenticación.
- Integridad de software y datos.
- Logging y monitorización insuficientes.
- SSRF, si aplica.

### 16.2. Monitorización y debugging

Se debe añadir como línea de trabajo:

- Monitorización básica.
- Registro de errores.
- Logs de acciones importantes.
- Debugging local y remoto.
- Trazabilidad de incidencias.

---

## 17. Spec-Driven Development

Se contempla aplicar un enfoque de Spec-Driven Development.

La idea es definir primero:

- Especificaciones.
- Requisitos.
- Casos de uso.
- Contratos esperados.
- Criterios de aceptación.

Y después implementar en base a dichas especificaciones.

Esto encaja especialmente bien con un desarrollo asistido por IA, ya que permite proporcionar contexto claro y verificable a los agentes o asistentes.

---

## 18. Accesibilidad y usabilidad

El proyecto debería contemplar aspectos básicos de:

- Accesibilidad.
- Usabilidad.
- Diseño responsive.
- Uso desde ordenador.
- Uso desde móvil.
- Claridad en formularios.
- Mensajes de error comprensibles.
- Navegación sencilla.

No se plantea como objetivo crear una aplicación visualmente compleja, sino una herramienta usable y clara.

---

## 19. Créditos, plugins y terceros

Se deberá documentar el uso de:

- Librerías externas.
- Frameworks.
- Plugins.
- Componentes de terceros.
- Servicios externos.
- Modelos IA utilizados.
- Herramientas de desarrollo con IA.

Objetivo:

- Cumplir licencias.
- Reconocer dependencias.
- Facilitar auditoría.
- Evitar problemas de atribución.

Documento posible:

```text
docs/creditos-y-terceros.md
```

---

## 20. Integraciones y agentes IA

Como línea de evolución, el SaaS podría integrarse con agentes IA y canales externos para recibir instrucciones en lenguaje natural.

Ejemplos:

- Enviar información por WhatsApp.
- Enviar información por email.
- Registrar tareas mediante mensajes.
- Registrar tiempos mediante lenguaje natural.
- Consultar costes o reportes.
- Crear tareas desde conversaciones.

Herramientas o conceptos relacionados:

- OpenClaw.
- Hermes.
- Agentes IA externos.
- Subagentes especializados.
- Procesamiento de instrucciones naturales.

Esta línea debe considerarse evolución futura o prueba conceptual, no núcleo obligatorio del MVP.

---

## 21. Despliegue SaaS

El proyecto debe contemplar cómo se podría desplegar como SaaS.

Aspectos a definir:

- Entorno local.
- Entorno de pruebas.
- Entorno de producción.
- Docker.
- Variables de entorno.
- Base de datos PostgreSQL.
- Migraciones.
- Backups.
- Seguridad básica.
- Configuración de dominio.
- HTTPS.

Pendiente:

- Decidir proveedor o infraestructura de despliegue.
- Definir estrategia inicial de publicación.
- Documentar pasos de despliegue.

---

## 22. Presentación del proyecto

La presentación final deberá explicar:

- Cómo se ha creado el proyecto.
- Qué problemas resuelve.
- Cómo funciona.
- Qué arquitectura aplica.
- Qué stack tecnológico utiliza.
- Qué papel ha tenido la IA.
- Qué buenas prácticas se han aplicado.
- Qué pruebas se han realizado.
- Cómo se ha tratado la seguridad.
- Qué líneas futuras tiene.
- Cómo podría evolucionar a SaaS comercial.

### 22.1. Demo sugerida

Flujo de demo posible:

1. Acceso al sistema.
2. Creación o consulta de cliente.
3. Creación de proyecto.
4. Creación de tarea.
5. Inicio de tarea con start/stop.
6. Registro de tiempo.
7. Generación de resumen IA.
8. Generación de reporte.
9. Consulta desde área de cliente.
10. Explicación de líneas futuras.

---

## 23. Pendientes y cuestiones abiertas

Cuestiones todavía abiertas:

- Confirmar el tipo exacto de producto.
- Definir nombre del proyecto.
- Decidir si se registra dominio.
- Decidir si el proyecto será abierto, privado o híbrido.
- Elegir arquitectura definitiva.
- Definir stack backend final.
- Decidir proveedor de IA.
- Definir alcance exacto del MVP.
- Seleccionar herramientas de testing.
- Definir estrategia de despliegue.
- Concretar papel de agentes IA.
- Preparar estructura final de documentación.

---

## 24. Próximos pasos recomendados

1. Cerrar nombre provisional del proyecto.
2. Confirmar alcance exacto del MVP.
3. Crear estructura inicial del repositorio.
4. Añadir `README.md`, `/docs` y `.gitignore`.
5. Crear ADR inicial de arquitectura.
6. Definir stack técnico definitivo.
7. Redactar historias de usuario principales.
8. Diseñar modelo de datos inicial.
9. Preparar entorno local con Docker.
10. Implementar primer módulo funcional.

---

## 25. Posible estructura de documentación

```text
README.md
AGENTS.md
CLAUDE.md
GEMINI.md
.gitignore

docs/
├── 00-vision-y-alcance.md
├── 01-requisitos-funcionales.md
├── 02-requisitos-no-funcionales.md
├── 03-modelo-datos.md
├── 04-arquitectura.md
├── 05-ia.md
├── 06-integraciones.md
├── 07-testing-y-calidad.md
├── 08-seguridad.md
├── 09-despliegue.md
├── 10-accesibilidad-usabilidad.md
├── 11-creditos-y-terceros.md
├── 12-presentacion.md
├── 99-metodologia-documentacion.md
└── adr/
    ├── 0001-eleccion-arquitectura.md
    ├── 0002-eleccion-stack.md
    ├── 0003-estrategia-ia.md
    └── 0004-estrategia-seguridad.md
```

---

## 26. Nota de alcance

Este documento recoge ideas de trabajo, dudas y líneas posibles. No todo lo descrito debe formar parte obligatoriamente del MVP del TFM.

La documentación final deberá diferenciar claramente entre:

- Funcionalidades incluidas en el TFM.
- Pruebas conceptuales.
- Líneas futuras.
- Ideas descartadas o aplazadas.

El objetivo es mantener un alcance realista, defendible y alineado con el tiempo disponible.
