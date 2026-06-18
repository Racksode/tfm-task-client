# Historias de usuario

> Documento funcional del MVP del TFM.
> Recoge las historias de usuario con criterios de aceptación y una matriz de trazabilidad que enlaza requisitos, casos de uso, historias, pantallas y pruebas.

## 1. Introducción

Este documento completa la documentación funcional con las historias de usuario del MVP y su trazabilidad.

Parte de los requisitos funcionales (`docs/01-requisitos-funcionales.md`), los casos de uso (`docs/10-casos-de-uso.md`) y las pantallas (`docs/11-pantallas-y-navegacion.md`). No introduce funcionalidades nuevas fuera del alcance del MVP.

## 2. Convención

- **Formato de historia**: "Como `<rol>`, quiero `<objetivo>` para `<beneficio>`".
- **Prioridad (MoSCoW)**: `Must` (imprescindible para el MVP), `Should` (recomendable dentro del MVP), `Could` (deseable, opcional). Las funcionalidades `Won't` quedan fuera y se listan en `docs/01-requisitos-funcionales.md` (§8).
- **Criterios de aceptación**: en formato Dado / Cuando / Entonces.
- Cada historia referencia su caso de uso (`CU-XX`) y, por derivación, sus reglas de negocio.

## 3. Historias de usuario

### Autenticación

#### HU-01. Iniciar sesión

- **Como** usuario interno o cliente, **quiero** iniciar sesión con email y contraseña **para** acceder a la información que me corresponde.
- **Prioridad**: Must. **CU**: CU-01.
- **Criterios de aceptación**:
  - Dado un usuario activo con credenciales válidas, cuando inicia sesión, entonces el sistema crea la sesión y resuelve su rol.
  - Dadas credenciales inválidas, cuando intenta iniciar sesión, entonces el sistema muestra un error genérico y no crea sesión.
  - Dado un usuario inactivo, cuando intenta iniciar sesión, entonces el acceso se deniega aunque las credenciales sean correctas.

### Usuarios

#### HU-02. Administrar usuarios

- **Como** usuario interno, **quiero** crear y editar usuarios **para** administrar quién accede al sistema.
- **Prioridad**: Must. **CU**: CU-02.
- **Criterios de aceptación**:
  - Dado un usuario interno autenticado, cuando accede a `/users`, entonces ve el listado y los formularios de alta y edición.
  - Dado un email ya existente, cuando crea un usuario, entonces el sistema rechaza el alta.
  - Dado un usuario con rol `CLIENT`, cuando intenta acceder a `/users`, entonces el acceso a la página y a las acciones se bloquea.

### Clientes

#### HU-03. Gestionar clientes

- **Como** usuario interno, **quiero** crear, editar y activar/desactivar clientes **para** organizar los trabajos asociados a cada uno.
- **Prioridad**: Must. **CU**: CU-03.
- **Criterios de aceptación**:
  - Dado un usuario interno, cuando crea un cliente con nombre, entonces se guarda con estado activo.
  - Dado un cliente existente, cuando edita su ficha, entonces los cambios se reflejan.
  - Dado un cliente inactivo, entonces no se ofrece para crear nuevo trabajo (salvo decisión posterior).

### Proyectos

#### HU-04. Gestionar proyectos

- **Como** usuario interno, **quiero** gestionar proyectos asociados a un cliente **para** organizar el trabajo por contexto.
- **Prioridad**: Must. **CU**: CU-04.
- **Criterios de aceptación**:
  - Dado un cliente existente, cuando crea un proyecto asociado, entonces se guarda con su estado.
  - Dado un proyecto sin cliente, cuando intenta guardarlo, entonces el sistema lo impide.

#### HU-05. Controlar visibilidad del proyecto

- **Como** usuario interno, **quiero** marcar un proyecto como visible para el cliente **para** controlar qué aparece en su área.
- **Prioridad**: Should. **CU**: CU-04, CU-11.
- **Criterios de aceptación**:
  - Dado un proyecto no visible, cuando el cliente consulta su área, entonces no aparece.
  - Dado un proyecto marcado como visible, cuando el cliente consulta su área, entonces aparece.

### Tareas

#### HU-06. Gestionar tareas

- **Como** usuario interno, **quiero** gestionar tareas dentro de un proyecto **para** definir el trabajo a realizar.
- **Prioridad**: Must. **CU**: CU-05.
- **Criterios de aceptación**:
  - Dado un proyecto existente, cuando crea una tarea con título, estado y prioridad, entonces se guarda asociada al proyecto.
  - Dada una tarea sin proyecto, cuando intenta guardarla, entonces el sistema lo impide.
  - Dada una tarea descartada, entonces se conserva como descartada y no como eliminada.

#### HU-07. Controlar visibilidad de la tarea

- **Como** usuario interno, **quiero** marcar la visibilidad de una tarea para el cliente **para** compartir solo lo acordado.
- **Prioridad**: Should. **CU**: CU-05, CU-11.
- **Criterios de aceptación**:
  - Dada una tarea no visible, cuando el cliente consulta su área, entonces no aparece.

### Tiempos

#### HU-08. Registrar tiempo manual

- **Como** usuario interno, **quiero** registrar tiempo manual sobre una tarea **para** justificar dedicación sin usar el temporizador.
- **Prioridad**: Must. **CU**: CU-06.
- **Criterios de aceptación**:
  - Dada una tarea, cuando registra fecha, duración y descripción, entonces el tiempo se asocia a la tarea y al usuario.
  - Dada una duración no positiva, cuando intenta registrarla, entonces el sistema la rechaza.
  - Dada una tarifa vigente, cuando se guarda el registro, entonces se calcula el coste estimado.

#### HU-09. Controlar tarea con start/stop

- **Como** usuario interno, **quiero** iniciar y detener una tarea **para** medir el tiempo automáticamente.
- **Prioridad**: Must. **CU**: CU-07.
- **Criterios de aceptación**:
  - Dada una tarea, cuando la inicia, entonces el sistema registra el inicio y la marca activa.
  - Dada una tarea activa, cuando la detiene, entonces el sistema calcula la duración y crea el registro de tiempo.

#### HU-10. Evitar solapamiento de tareas activas

- **Como** usuario interno, **quiero** que al iniciar una tarea se detenga la anterior activa **para** evitar registros inconsistentes.
- **Prioridad**: Must. **CU**: CU-07.
- **Criterios de aceptación**:
  - Dada una tarea A activa, cuando inicia la tarea B, entonces A se detiene y su registro se cierra antes de activar B.

#### HU-11. Consultar horas y costes

- **Como** usuario interno, **quiero** consultar horas y coste estimado por tarea, proyecto, cliente o periodo **para** conocer el esfuerzo dedicado.
- **Prioridad**: Must. **CU**: CU-08.
- **Criterios de aceptación**:
  - Dado un ámbito con registros, cuando lo consulta, entonces ve el total de horas y el coste estimado.
  - Dado un ámbito sin registros, cuando lo consulta, entonces ve totales en cero.

### Reportes

#### HU-12. Generar reporte

- **Como** usuario interno, **quiero** generar un reporte por cliente, proyecto y periodo **para** justificar el trabajo realizado.
- **Prioridad**: Must. **CU**: CU-09.
- **Criterios de aceptación**:
  - Dados cliente y periodo, cuando genera el reporte, entonces se reúnen tareas, tiempos, total de horas y coste estimado en estado borrador.
  - Dado un periodo sin datos, cuando intenta generarlo, entonces el sistema avisa y no crea un reporte vacío sin confirmación.
  - Dado un reporte en borrador, cuando el usuario interno lo revisa y lo marca visible para el cliente, entonces queda disponible en el área de cliente; si no lo marca, no se expone.

#### HU-13. Resumen profesional con IA

- **Como** usuario interno, **quiero** generar un resumen profesional con IA revisable **para** incluirlo en el reporte sin redactarlo manualmente.
- **Prioridad**: Must. **CU**: CU-10.
- **Criterios de aceptación**:
  - Dado un reporte, cuando solicita el resumen, entonces el sistema muestra una propuesta revisable y registra el uso de IA.
  - Dada una IA no disponible, cuando solicita el resumen, entonces el reporte sigue siendo usable y el uso se registra con error.
  - Dado un texto generado, cuando el usuario lo revisa, entonces puede aceptarlo, ajustarlo o descartarlo antes de incorporarlo.

### Área de cliente

#### HU-14. Consultar área de cliente

- **Como** cliente, **quiero** consultar mis proyectos, tareas y reportes visibles **para** seguir la evolución del trabajo.
- **Prioridad**: Must. **CU**: CU-11.
- **Criterios de aceptación**:
  - Dado un cliente autenticado, cuando accede a su área, entonces solo ve recursos asociados a él y marcados como visibles.
  - Dado un recurso no visible o de otro cliente, cuando intenta acceder, entonces el sistema lo deniega.

### IA y lenguaje natural

#### HU-15. Interpretar instrucción en lenguaje natural

- **Como** usuario interno, **quiero** introducir una instrucción en lenguaje natural y obtener una propuesta estructurada **para** demostrar la interpretación controlada con IA.
- **Prioridad**: Must (prueba conceptual interna, clasificada como imprescindible en RF-13). **CU**: CU-12.
- **Criterios de aceptación**:
  - Dada una instrucción, cuando la envía, entonces el sistema devuelve una propuesta estructurada sin ejecutar ninguna acción.
  - Dada una instrucción no interpretable, cuando la envía, entonces el sistema indica que requiere revisión y no propone acción.

## 4. Matriz de trazabilidad

Relaciona requisito funcional, caso de uso, historia, pantalla principal, estado de implementación y estado de pruebas.

| RF | CU | HU | Pantalla | Estado impl. | Test |
|---|---|---|---|---|---|
| RF-01 | CU-01 | HU-01 | `/login`, `/` | Implementado | Pendiente |
| RF-01 | CU-02 | HU-02 | `/users`, `/users/new`, `/users/[id]/edit` | Implementado | Pendiente |
| RF-02 | CU-03 | HU-03 | `/clients` | Pendiente | Pendiente |
| RF-03 | CU-04 | HU-04, HU-05 | `/projects` | Pendiente | Pendiente |
| RF-04 | CU-05 | HU-06, HU-07 | `/tasks` | Pendiente | Pendiente |
| RF-05 | CU-06 | HU-08 | `/tasks/[id]` | Pendiente | Pendiente |
| RF-06, RF-07 | CU-07 | HU-09, HU-10 | `/tasks/[id]`, `/time` | Pendiente | Pendiente |
| RF-08, RF-09 | CU-08 | HU-11 | `/time` | Pendiente | Pendiente |
| RF-10 | CU-09 | HU-12 | `/reports` | Pendiente | Pendiente |
| RF-11 | CU-10 | HU-13 | `/reports/[id]` | Pendiente | Pendiente |
| RF-12 | CU-11 | HU-14 | `/portal` | Pendiente | Pendiente |
| RF-13 | CU-12 | HU-15 | `/assistant` | Pendiente | Pendiente |

> **Estado de pruebas**: todas las historias figuran como `Pendiente` porque el proyecto aún no incorpora una herramienta de testing (no hay Vitest instalado). La estrategia de pruebas se describe en `docs/07-plan-pruebas.md` y su puesta en marcha está pendiente; esta columna deberá actualizarse cuando existan pruebas asociadas.
