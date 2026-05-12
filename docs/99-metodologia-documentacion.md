# Metodología de documentación y evolución del proyecto

**Documento interno de trabajo**  
**Idioma:** Español  
**Tipo de documento:** Metodología de documentación y control de cambios  

---

## 1. Objetivo

Este documento define cómo se organizará, mantendrá y versionará la documentación del proyecto durante el desarrollo del TFM.

El objetivo es mantener una documentación clara, trazable y actualizada, evitando que los documentos principales del proyecto queden obsoletos a medida que evoluciona el análisis, el diseño y la implementación.

La documentación se considera una parte activa del proyecto, no un entregable final aislado.

---

## 2. Estructura documental

La documentación principal del proyecto se organizará dentro de la carpeta `/docs`.

Estructura propuesta:

```text
docs/
├── 00-vision-y-alcance.md
├── 01-requisitos-funcionales.md
├── 02-requisitos-no-funcionales.md
├── 03-modelo-datos.md
├── 04-arquitectura.md
├── 05-ia.md
├── 06-integraciones.md
├── 07-plan-pruebas.md
├── 08-despliegue.md
├── 99-metodologia-documentacion.md
└── adr/
    ├── 0001-eleccion-arquitectura.md
    ├── 0002-eleccion-base-datos.md
    └── 0003-integracion-ia.md
```

---

## 3. README principal

El fichero `README.md` ubicado en la raíz del repositorio actuará como punto de entrada al proyecto.

Su función será resumir:

- Nombre del proyecto.
- Descripción breve.
- Objetivo del TFM.
- Alcance del MVP.
- Tecnologías principales, cuando estén definidas.
- Instrucciones básicas de instalación y ejecución, cuando existan.
- Enlaces a la documentación completa.

El `README.md` no debe contener toda la memoria del proyecto, sino servir como índice y presentación rápida.

---

## 4. Documentos de la carpeta `/docs`

Los documentos de `/docs` contendrán la información ampliada del proyecto.

Cada documento tendrá un propósito concreto:

- `00-vision-y-alcance.md`: visión general, problema, propuesta de valor, alcance del TFM y líneas futuras.
- `01-requisitos-funcionales.md`: funcionalidades que debe cubrir el sistema.
- `02-requisitos-no-funcionales.md`: seguridad, rendimiento, usabilidad, escalabilidad, mantenibilidad, etc.
- `03-modelo-datos.md`: entidades principales, relaciones y modelo conceptual.
- `04-arquitectura.md`: estructura técnica, capas, módulos y decisiones de diseño.
- `05-ia.md`: uso de inteligencia artificial dentro del proyecto.
- `06-integraciones.md`: integraciones previstas o futuras, como Holded, agentes IA, email o WhatsApp.
- `07-plan-pruebas.md`: estrategia de validación y pruebas.
- `08-despliegue.md`: instrucciones de despliegue y configuración.
- `99-metodologia-documentacion.md`: normas de mantenimiento documental.

---

## 5. Control de cambios

La evolución de los documentos se gestionará mediante Git.

Cada cambio relevante en la documentación deberá registrarse mediante commits descriptivos.

Ejemplos:

```text
docs: definir alcance inicial del TFM
docs: añadir visión futura de integración con agentes IA
docs: actualizar requisitos funcionales de tareas y tiempos
docs: documentar estructura inicial del modelo de datos
docs: revisar metodología de documentación
```

---

## 6. Convención de commits

El proyecto utilizará una convención basada en Conventional Commits.

El tipo del commit se escribirá en inglés por compatibilidad con herramientas, automatizaciones y estándares habituales.

La descripción se escribirá en español para mantener la coherencia con la documentación del TFM.

Formato recomendado:

```text
<tipo>: <descripción en español>
```

Ejemplos:

```text
docs: añadir visión inicial del proyecto
docs: documentar alcance del MVP
feat: crear modelo inicial de clientes
feat: crear modelo inicial de tareas
feat: implementar inicio y parada de tareas
fix: evitar solapamiento de tareas activas
refactor: extraer servicio de cálculo de tiempos
test: añadir pruebas para registros de tiempo
chore: crear estructura base de carpetas
```

### 6.1. Tipos de commit recomendados

- `feat`: nueva funcionalidad.
- `fix`: corrección de error.
- `docs`: cambios en documentación.
- `refactor`: reorganización o mejora interna sin cambio funcional.
- `test`: creación o modificación de pruebas.
- `chore`: tareas auxiliares, configuración o mantenimiento.
- `style`: cambios de formato sin impacto funcional.
- `build`: cambios relacionados con compilación, dependencias o empaquetado.
- `ci`: cambios en integración continua.

### 6.2. Criterios de redacción

Los commits deberán ser claros, breves y orientados a la acción realizada.

Se recomienda usar infinitivo o una descripción directa:

```text
feat: implementar alta y edición de clientes
fix: corregir cálculo de horas registradas
docs: añadir metodología de documentación
```

Se evitarán mensajes genéricos como:

```text
update
changes
cosas
arreglos
final
```

---

## 7. Criterios de actualización documental

La documentación deberá actualizarse cuando:

- Se añada una nueva funcionalidad relevante.
- Se modifique el alcance del MVP.
- Se tome una decisión técnica importante.
- Se cambie el modelo de datos.
- Se redefina una integración.
- Se detecte una contradicción entre lo documentado y lo implementado.
- Se cierre una fase del proyecto.

---

## 8. Versionado de documentos

No se crearán copias manuales del tipo:

```text
README_v1.md
README_v2.md
documentacion_final_final.md
```

La evolución histórica se gestionará con Git.

Si se necesita conservar una versión concreta, se utilizarán tags o ramas.

Ejemplos de tags:

```text
v0.1-definicion-inicial
v0.2-analisis-funcional
v0.3-diseno-arquitectura
v1.0-entrega-tfm
```

---

## 9. Propuesta de ramas

Durante el desarrollo se podrá trabajar con una estructura sencilla de ramas:

```text
main
develop
feature/documentacion-inicial
feature/modulo-clientes
feature/modulo-tareas
feature/control-tiempos
feature/reportes-ia
```

La rama `main` contendrá versiones estables del proyecto.

La rama `develop` podrá utilizarse como rama de integración durante el desarrollo.

Las ramas `feature/*` se utilizarán para desarrollar funcionalidades o bloques documentales concretos.

---

## 10. Registro de decisiones

Para decisiones importantes del proyecto se podrá utilizar una carpeta de ADR.

Ruta propuesta:

```text
docs/adr/
```

ADR significa `Architecture Decision Record`.

Cada ADR documentará:

- Contexto.
- Decisión tomada.
- Alternativas valoradas.
- Consecuencias.

Ejemplos:

```text
docs/adr/0001-eleccion-arquitectura.md
docs/adr/0002-eleccion-base-datos.md
docs/adr/0003-integracion-ia.md
```

---

## 11. Revisión periódica

Antes de cada entrega importante del TFM se revisará la documentación para comprobar que:

- El README sigue representando correctamente el proyecto.
- El alcance documentado coincide con lo implementado.
- Las funcionalidades pendientes están correctamente marcadas.
- Las líneas futuras no se confunden con el MVP.
- Las decisiones técnicas están justificadas.

---

## 12. Separación entre TFM y evolución futura

La documentación deberá diferenciar siempre entre:

- Funcionalidades incluidas en el TFM.
- Funcionalidades previstas como evolución posterior.
- Ideas descartadas o aplazadas.

Esto evitará que el proyecto parezca sobredimensionado y ayudará a defender que el alcance del TFM es realista.
