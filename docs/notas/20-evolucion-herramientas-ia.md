# Evolución de las herramientas de IA en el desarrollo

> Nota metodológica del TFM.
> Recoge la evolución de las herramientas de IA usadas durante el desarrollo y el porqué de los cambios.

## Propósito

Esta nota documenta la IA como **herramienta de desarrollo**, no la IA del producto (que se describe en `docs/05-ia.md`). Complementa `docs/notas/01-trabajo-ide-agentes-ia.md` y `docs/notas/03-reflexion-sobrealcance-ia.md`.

El objetivo es dejar constancia, de cara a la defensa del TFM, de que el uso de IA durante el proyecto ha sido un proceso con criterio: se han elegido herramientas, se han detectado sus límites y se han cambiado cuando dejaron de dar buen resultado.

## Evolución de las herramientas

### Fase inicial: ChatGPT y Codex

El proyecto se inició apoyándose en dos herramientas con funciones distintas:

- **ChatGPT** para análisis, debate de ideas y generación de prompts. Sirvió para explorar el alcance, contrastar enfoques y preparar instrucciones claras antes de llevarlas al IDE.
- **Codex** en el IDE para la planificación técnica y el desarrollo. Se encargaba de proponer planes y de implementar el código a partir de ellos.

Este reparto funcionó razonablemente durante las primeras fases de documentación e implementación técnica base (proyecto base, persistencia con Prisma, capa de acceso a datos, CI, autenticación).

### Punto de quiebre: implementación de `users`

Al llegar a la gestión de usuarios se produjo un cambio de tendencia:

- La **definición previa** de la tarea resultó insuficiente, lo que dejó demasiado margen de interpretación.
- Con esa definición floja, **Codex implementó de forma notablemente pobre**, algo que no había ocurrido hasta ese momento.

El problema combinó dos factores: una especificación incompleta y un resultado de la herramienta por debajo de lo esperado. Sirvió para evidenciar que la calidad del resultado dependía tanto de la herramienta como de la definición de partida.

### Prueba y cambio a Claude Code

En el mismo punto del proyecto se hizo una prueba con **Claude Code**, partiendo de un contexto equivalente. El resultado fue **bastante mejor**, lo que motivó adoptarlo como herramienta principal de trabajo en el IDE a partir de ese momento.

## Trabajo de documentación con Claude Code

Tras el cambio, se utilizó Claude Code para **revisar el proyecto completo** e identificar qué faltaba a nivel de documentación, construyendo un mapa de los documentos a crear.

De esa revisión salió el bloque de **documentación funcional/UX**, desarrollado por fases cerradas, cada una en su propia rama y con su PR:

- [Casos de uso](../10-casos-de-uso.md): CU-01…CU-12 en formato formal, reglas de negocio numeradas y trazabilidad con los requisitos.
- [Pantallas y navegación](../11-pantallas-y-navegacion.md): inventario de pantallas, sitemaps, fichas por pantalla y flujos de navegación.
- [Diagramas UML](../12-diagramas-uml.md): diagrama de casos de uso y diagramas de secuencia de los flujos con lógica destacable.
- [Historias de usuario](../13-historias-de-usuario.md): catálogo con criterios de aceptación y matriz de trazabilidad RF↔CU↔HU↔pantalla↔test.

Durante este trabajo también se aplicó revisión humana sobre los resultados: por ejemplo, se corrigió el estado de algunas pantallas que se habían documentado como implementadas cuando en realidad estaban solo parcialmente presentes en el repositorio.

## Lecciones metodológicas

- **La definición previa importa tanto como la herramienta.** El peor resultado coincidió con la peor especificación. Una tarea bien acotada reduce el margen de error de cualquier agente.
- **Conviene comparar herramientas en el mismo punto.** Probar Claude Code sobre un contexto equivalente permitió decidir el cambio con criterio, no por intuición.
- **La IA no es fuente de verdad.** Los resultados se revisan y se contrastan con el estado real del repositorio antes de darlos por buenos, como exige `AGENTS.md`.
- **Trabajo por fases cerradas y verificables.** Cada bloque documental se ha tratado como una fase con rama y PR propios, facilitando la revisión y la trazabilidad.

## Estado actual

La herramienta principal de desarrollo en el IDE es Claude Code. ChatGPT se mantiene como apoyo puntual para análisis y debate. La trazabilidad del trabajo con IA se conserva en `docs/planes/` y `docs/historico-ia/`.
