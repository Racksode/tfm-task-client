# Prompts de trabajo con IA

> Documento interno de trabajo.  
> Recoge prompts reutilizables utilizados durante el desarrollo del TFM para trabajar con agentes IA dentro del IDE de forma controlada.

## 1. Objetivo

Este documento recopila prompts plantilla que ayudan a trabajar con agentes IA como Codex, Claude Code, Cursor u otras herramientas similares.

No pretende guardar todas las conversaciones mantenidas con IA, sino únicamente los prompts que aportan valor metodológico y pueden reutilizarse durante el proyecto.

El objetivo es demostrar un uso controlado de IA basado en:

- planificación antes de editar
- revisión humana
- control de alcance
- separación entre MVP y líneas futuras
- trazabilidad mediante Git
- documentación de decisiones relevantes

## 2. Criterio de selección

Se documentan prompts que cumplen al menos uno de estos criterios:

- sirven como plantilla reutilizable
- ayudan a evitar sobrealcance
- fuerzan al agente a trabajar en modo plan
- limitan los ficheros afectados
- separan documentación, análisis y código
- ayudan a revisar calidad, seguridad o arquitectura
- pueden formar parte de la metodología defendible del TFM

No se documentan prompts puntuales de conversación, explicaciones rápidas o consultas menores.

## 3. Prompt base: trabajar en modo plan

Usar este prompt antes de permitir que un agente modifique ficheros.

```text
Lee README.md, AGENTS.md y la documentación relacionada con la tarea.

Quiero trabajar sobre [FICHERO_O_TEMA].

Primero propón un plan de secciones, cambios, riesgos y ficheros afectados.

No edites, no crees y no borres ficheros todavía. Solo devuelve el plan.
```

## 4. Prompt base: aplicar un plan aprobado

Usar este prompt después de revisar y aprobar el plan del agente.

```text
El plan es correcto. Aplícalo sobre [FICHERO] manteniendo el alcance limitado al MVP del TFM.

Restricciones:

1. Modifica únicamente [FICHERO].
2. No añadas funcionalidades fuera del alcance del MVP.
3. Separa claramente TFM, líneas futuras del SaaS y experimentación.
4. No definas detalles técnicos que correspondan a documentos posteriores.
5. Al finalizar, resume los cambios realizados y sugiere el commit correspondiente.
```

## 5. Prompt para requisitos funcionales

Usado para completar el documento:

```text
docs/01-requisitos-funcionales.md
```

Prompt:

```text
Lee README.md, AGENTS.md, docs/00-vision-y-alcance.md y docs/09-plan-trabajo-y-control-alcance.md.

Quiero completar docs/01-requisitos-funcionales.md con el alcance realista del MVP del TFM.

Primero propón un plan de secciones y requisitos.

No edites, no crees y no borres ficheros todavía. Solo devuelve el plan.
```

Ajustes aplicados antes de implementar:

```text
El plan es correcto. Aplícalo sobre docs/01-requisitos-funcionales.md con estos ajustes:

1. Sustituye el término "CRUD" por "gestión básica" siempre que sea posible, usando lenguaje funcional y no excesivamente técnico.

2. Mantén la prueba de lenguaje natural como prueba conceptual interna, sin integraciones externas y sin ejecución automática de acciones.

3. Añade una tabla de clasificación de funcionalidades con columnas:
   - funcionalidad
   - clasificación
   - entra en TFM
   - motivo
   - evolución futura

4. No definas todavía campos técnicos detallados ni modelo de datos, ya que eso se trabajará en docs/03-modelo-datos.md.

5. Mantén el documento centrado en el MVP del TFM y separa claramente las líneas futuras del SaaS.

Modifica únicamente docs/01-requisitos-funcionales.md.

Al finalizar, resume los cambios realizados y sugiere el commit correspondiente.
```

Commit asociado:

```text
docs: definir requisitos funcionales del MVP
```

## 6. Prompt para requisitos no funcionales

Usado para completar el documento:

```text
docs/02-requisitos-no-funcionales.md
```

Prompt:

```text
Lee README.md, AGENTS.md, docs/00-vision-y-alcance.md, docs/01-requisitos-funcionales.md y docs/09-plan-trabajo-y-control-alcance.md.

Quiero completar docs/02-requisitos-no-funcionales.md para este TFM, teniendo en cuenta seguridad desde diseño, OWASP Top Ten, mantenibilidad, testing, accesibilidad, usabilidad, rendimiento razonable, privacidad y control de calidad.

Primero propón un plan de secciones y requisitos.

No edites, no crees y no borres ficheros todavía. Solo devuelve el plan.
```

Ajustes aplicados antes de implementar:

```text
El plan es correcto. Aplícalo sobre docs/02-requisitos-no-funcionales.md con estos ajustes:

1. Añade el concepto de trazabilidad mínima para acciones relevantes, como creación/modificación de tareas, registros de tiempo, generación de reportes y uso de IA, sin convertirlo en una auditoría avanzada.

2. Matiza cualquier referencia a RGPD indicando que se aplicarán buenas prácticas básicas de privacidad inspiradas en RGPD, sin considerar el MVP como una solución legalmente certificada.

3. Refuerza el concepto de modo degradado para IA: el sistema debe seguir siendo usable aunque la funcionalidad de IA no esté disponible.

4. Mantén las pruebas E2E como recomendables si el tiempo lo permite, no como obligatorias.

5. No definas todavía arquitectura técnica concreta ni decisiones de stack, ya que eso se trabajará en docs/04-arquitectura.md y ADRs.

Modifica únicamente docs/02-requisitos-no-funcionales.md.

Al finalizar, resume los cambios realizados y sugiere el commit correspondiente.
```

Commit asociado:

```text
docs: definir requisitos no funcionales del MVP
```

## 7. Prompt para modelo de datos conceptual

Prompt previsto para completar el documento:

```text
docs/03-modelo-datos.md
```

Prompt:

```text
Lee README.md, AGENTS.md, docs/00-vision-y-alcance.md, docs/01-requisitos-funcionales.md, docs/02-requisitos-no-funcionales.md y docs/09-plan-trabajo-y-control-alcance.md.

Quiero completar docs/03-modelo-datos.md con el modelo de datos conceptual inicial del MVP del TFM.

El modelo debe cubrir clientes, proyectos, tareas, registros de tiempo, tarifas, reportes, usuarios y área de cliente, manteniendo el alcance limitado al MVP.

No quiero todavía migraciones, SQL, Prisma, Drizzle ni decisiones técnicas concretas de implementación. Eso se trabajará más adelante en arquitectura.

Primero propón un plan de secciones, entidades, relaciones principales y reglas de negocio que debería contener el documento.

No edites, no crees y no borres ficheros todavía. Solo devuelve el plan.
```

Commit previsto:

```text
docs: definir modelo de datos inicial
```

## 8. Prompt para arquitectura inicial

Usado para completar:

```text
docs/04-arquitectura.md
docs/adr/0001-eleccion-arquitectura.md
docs/adr/0002-eleccion-base-datos.md
docs/adr/0003-integracion-ia.md
```

Prompt:

```text
Lee README.md, AGENTS.md, docs/00-vision-y-alcance.md, docs/01-requisitos-funcionales.md, docs/02-requisitos-no-funcionales.md, docs/03-modelo-datos.md y docs/09-plan-trabajo-y-control-alcance.md.

Quiero definir la arquitectura inicial del MVP del TFM y preparar los ADRs correspondientes.

Primero propón un plan para:
1. docs/04-arquitectura.md
2. docs/adr/0001-eleccion-arquitectura.md
3. docs/adr/0002-eleccion-base-datos.md
4. docs/adr/0003-integracion-ia.md

El plan debe mantener el alcance limitado al MVP, evitar sobrediseño y separar decisiones actuales de líneas futuras.

No edites, no crees y no borres ficheros todavía. Solo devuelve el plan.
```

Commit previsto:

```text
docs: definir arquitectura inicial del proyecto
```

Ajustes aplicados antes de implementar:

```text
El plan es correcto. Aplícalo con estos ajustes:

1. Mantén el alcance limitado al MVP del TFM.
2. No conviertas líneas futuras del SaaS en decisiones actuales.
3. Documenta una arquitectura inicial sencilla, defendible y suficiente.
4. Crea ADRs breves para arquitectura, base de datos e integración IA.
5. No definas todavía stack concreto, ORM, proveedor de autenticación, proveedor IA ni despliegue final.
6. Modifica únicamente los documentos de arquitectura y ADRs previstos.

Al finalizar, resume los cambios realizados y sugiere el commit correspondiente.
```

Commit asociado:

```text
docs: definir arquitectura inicial del proyecto
```

## 9. Prompt base: decisiones técnicas iniciales antes de crear código

Usar antes de inicializar el proyecto técnico o instalar dependencias.

```text
Lee README.md, AGENTS.md, docs/01-requisitos-funcionales.md, docs/02-requisitos-no-funcionales.md, docs/03-modelo-datos.md, docs/04-arquitectura.md y los ADRs existentes.

Quiero cerrar las decisiones técnicas mínimas antes de crear el primer código ejecutable del MVP.

Decisiones a cubrir:

1. Stack tecnológico inicial.
2. Motor de base de datos.
3. ORM o estrategia de acceso a datos.
4. Autenticación.
5. Estructura inicial del proyecto.
6. Patrones básicos de organización.
7. Testing mínimo para empezar.

Restricciones:

- Mantén el alcance limitado al MVP del TFM.
- No inicialices el proyecto.
- No instales dependencias.
- No crees código.
- No propongas arquitectura distribuida, microservicios ni integraciones externas completas.
- No generes documentación extensa si basta con una decisión breve y justificable.

Primero propón un plan de decisiones, ficheros afectados, riesgos y posible commit.

No edites, no crees y no borres ficheros todavía. Solo devuelve el plan.
```

## 10. Nota metodológica: cierre de documentación conceptual

Tras cerrar la documentación conceptual principal, no se generará más documentación extensa antes del primer código ejecutable.

Antes del desarrollo solo se documentarán decisiones técnicas mínimas:

- stack
- base de datos
- ORM o acceso a datos
- autenticación
- estructura del proyecto
- patrones básicos
- testing mínimo

El objetivo de esta regla es evitar sobredefinición documental y pasar de forma controlada a una implementación real del MVP.

## 11. Prompt para revisión de alcance

Usar cuando una propuesta parezca demasiado grande.

```text
Revisa la siguiente propuesta desde el punto de vista del alcance del TFM.

Clasifica cada funcionalidad como:

- imprescindible para el MVP
- recomendable pero aplazable
- línea futura del SaaS
- descartada para el TFM

Ten en cuenta que el objetivo es construir un MVP pequeño, completo y defendible, no un SaaS comercial completo.

Propuesta a revisar:

[PEGAR_PROPUESTA]
```

## 12. Prompt para revisión antes de commit

Usar antes de hacer commit de una fase importante.

```text
Revisa los cambios realizados en [FICHERO/RAMA] y comprueba:

1. Que se mantiene el alcance del MVP.
2. Que no se han añadido funcionalidades futuras como si fueran actuales.
3. Que el documento es coherente con README.md, AGENTS.md y docs/09-plan-trabajo-y-control-alcance.md.
4. Que no se han introducido decisiones técnicas que correspondan a fases posteriores.
5. Que el commit sugerido sigue la convención del proyecto.

No edites todavía. Primero devuelve observaciones y recomendación.
```

## 13. Prompt para resumen de cambios

Usar después de que el agente edite un fichero.

```text
Resume los cambios realizados indicando:

1. Ficheros modificados.
2. Secciones añadidas o modificadas.
3. Decisiones importantes incorporadas.
4. Aspectos que quedan fuera del alcance.
5. Commit recomendado.

No realices nuevos cambios.
```

## 14. Prompt para trabajo con Pull Request

Usar cuando se quiera preparar una PR en GitHub.

```text
Prepara una descripción de Pull Request para la rama [RAMA] hacia main.

Incluye:

1. Resumen.
2. Cambios realizados.
3. Alcance.
4. Qué queda fuera.
5. Checklist de revisión.

Mantén el texto en español y orientado al TFM.
```

Plantilla de descripción de PR:

```md
## Resumen

[Resumen breve de la rama]

## Cambios realizados

- [Cambio 1]
- [Cambio 2]
- [Cambio 3]

## Alcance

Estos cambios forman parte de [fase/punto del TFM].

## Fuera de alcance

No se incluyen funcionalidades ni decisiones correspondientes a fases posteriores.

## Checklist

- [ ] Se mantiene el alcance del MVP.
- [ ] No se añaden funcionalidades futuras como actuales.
- [ ] La documentación está alineada con README.md y AGENTS.md.
- [ ] El commit sigue la convención del proyecto.
```

## 15. Prompt para revisión de seguridad

Usar más adelante, cuando exista implementación.

```text
Revisa el siguiente flujo o código desde el punto de vista de seguridad para el MVP del TFM.

Ten en cuenta:

- control de acceso
- separación de datos entre clientes
- validación de entradas
- gestión de sesiones
- exposición de información interna
- riesgos OWASP Top Ten
- uso responsable de IA

No propongas una auditoría empresarial completa. Prioriza riesgos realistas para el MVP.

Contenido a revisar:

[PEGAR_CODIGO_O_DESCRIPCION]
```

## 16. Prompt para revisión de testing

Usar más adelante, cuando existan funcionalidades implementadas.

```text
Propón una estrategia de pruebas para la funcionalidad [FUNCIONALIDAD].

Incluye:

- pruebas unitarias necesarias
- pruebas de integración recomendables
- posibles pruebas E2E
- casos límite
- riesgos principales
- qué puede quedar fuera del MVP

Mantén el alcance realista para un TFM.
```

## 17. Prompt para modo caveman

Versión corta para cuando el flujo ya esté interiorizado.

```text
Lee README, AGENTS y docs relacionados.
Trabaja [FICHERO/TEMA].
MVP limitado.
Plan primero.
No edites.
```

Ejemplo:

```text
Lee README, AGENTS, docs/01 y docs/09.
Completa docs/02 no funcionales.
Incluye seguridad, OWASP, testing, accesibilidad, privacidad e IA responsable.
MVP limitado.
Plan primero.
No edites.
```

## 18. Reglas de uso de estos prompts

- Usar siempre modo plan antes de modificar ficheros importantes.
- Revisar el plan manualmente antes de aprobar cambios.
- Limitar los ficheros modificados por tarea.
- Pedir resumen de cambios antes de hacer commit.
- No convertir ideas futuras en funcionalidades actuales.
- Mantener el repositorio como fuente de verdad.
- No guardar prompts triviales o puntuales que no aporten valor metodológico.
- Registrar los planes importantes en `docs/planes/` como resumen metodológico breve y formal.
- Registrar el histórico ampliado en `docs/historico-ia/` cuando el trabajo incluya prompts, plan IA, revisión humana, aplicación, resultado y commit o PR.
- No registrar cambios menores, correcciones tipográficas simples o ajustes sin impacto.
- Evitar nueva documentación extensa antes del primer código ejecutable, salvo decisión explícita del usuario.

## 19. Relación con la memoria del TFM

Este documento puede servir como evidencia metodológica para explicar que el uso de IA durante el TFM no se ha realizado de forma improvisada, sino siguiendo un proceso controlado.

Posible frase para la memoria:

```text
Durante el desarrollo se utilizaron agentes IA dentro del IDE mediante prompts estructurados, priorizando la planificación previa, la revisión humana, el control del alcance y la trazabilidad de cambios mediante Git.
```
