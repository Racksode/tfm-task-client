# Casos de uso

> Documento funcional del MVP del TFM.
> Detalla los casos de uso del sistema en formato formal, ampliando los casos resumidos de `docs/01-requisitos-funcionales.md`.

## 1. Introducción

Este documento describe los casos de uso del MVP en formato formal, con actores, precondiciones, flujo principal, flujos alternativos, excepciones y postcondiciones.

Su objetivo es servir de puente entre los requisitos funcionales (`docs/01-requisitos-funcionales.md`) y la definición de pantallas (`docs/11-pantallas-y-navegacion.md`), manteniendo el alcance del MVP sin introducir funcionalidades nuevas.

No sustituye al modelo de datos (`docs/03-modelo-datos.md`) ni a la arquitectura técnica (`docs/04-arquitectura.md`). Cuando un caso de uso depende de una entidad o regla, se referencia el documento correspondiente.

## 2. Convención de documentación

Cada caso de uso utiliza la siguiente plantilla:

- **ID y nombre**: identificador `CU-XX` y título.
- **Actor principal**: rol que inicia el caso de uso.
- **Estado**: situación de implementación en el repositorio.
- **RF relacionados**: requisitos funcionales que cubre.
- **Precondiciones**: lo que debe cumplirse antes de iniciar.
- **Flujo principal**: secuencia de pasos del camino feliz.
- **Flujos alternativos y excepciones**: desvíos y errores controlados.
- **Postcondiciones**: estado del sistema al finalizar con éxito.
- **Reglas asociadas**: reglas de negocio aplicables (ver sección 5).

El campo **Estado** puede tomar los valores: `Implementado`, `Parcial` o `Pendiente`. Refleja el estado real del repositorio y no debe presentar como hecho lo que no existe.

## 3. Actores

Los actores del MVP se definen en `docs/01-requisitos-funcionales.md`:

- **Usuario interno** (`INTERNAL`): gestiona clientes, proyectos, tareas, tiempos y reportes.
- **Cliente** (`CLIENT`): consulta únicamente información asociada a su cliente y marcada como visible.
- **Sistema**: actor de apoyo para acciones automáticas (cálculos, trazabilidad mínima).
- **Servicio de IA**: actor externo de apoyo, invocado de forma controlada y siempre revisable por el usuario interno.

## 4. Casos de uso

### CU-01. Iniciar sesión

- **Actor principal**: Usuario interno o Cliente.
- **Estado**: Parcial. Implementado: autenticación por credenciales y resolución del rol en sesión (`src/auth.ts`). Pendiente: pantalla `/login` propia, redirección por rol y área de cliente (ver `docs/adr/0008`).
- **RF relacionados**: RF-01.
- **Precondiciones**: El usuario existe en el sistema y está activo.

**Flujo principal**

1. El actor accede a la pantalla de inicio de sesión (`/login`).
2. Introduce email y contraseña.
3. El sistema valida las credenciales.
4. El sistema crea la sesión y resuelve el rol del usuario.
5. El sistema redirige según el rol: `INTERNAL` → `/dashboard`, `CLIENT` → `/portal` (pendiente de implementación; ver `docs/11-pantallas-y-navegacion.md`, 5.2).

**Flujos alternativos y excepciones**

- 3a. Credenciales inválidas: el sistema muestra un mensaje de error genérico y no crea sesión.
- 1a. Usuario inactivo: el sistema impide el acceso aunque las credenciales sean correctas.

**Postcondiciones**: El actor dispone de una sesión autenticada con un rol asociado.

**Reglas asociadas**: RN-01, RN-02.

### CU-02. Gestionar usuarios

- **Actor principal**: Usuario interno.
- **Estado**: Parcial. Existe gestión en una sola página `/users` (ver `docs/planes/13-usuarios-minimos.md`); se reestructura en rutas CRUD separadas (`/users`, `/users/new`, `/users/[id]/edit`) según `docs/adr/0008`.
- **RF relacionados**: RF-01.
- **Precondiciones**: El usuario interno tiene sesión activa con rol `INTERNAL`.

**Flujo principal**

1. El usuario interno accede al listado de usuarios en `/users`.
2. Consulta el listado de usuarios existentes.
3. Crea un usuario desde `/users/new` o edita uno existente desde `/users/[id]/edit`, indicando nombre, email y rol.
4. El sistema valida los datos y guarda el usuario.

**Flujos alternativos y excepciones**

- 1a. Un usuario con rol `CLIENT` intenta acceder: el sistema bloquea el acceso a la página y a las acciones de servidor.
- 3a. Email duplicado: el sistema rechaza el alta y muestra el error.

**Postcondiciones**: El usuario queda registrado o actualizado.

**Reglas asociadas**: RN-02, RN-03.

### CU-03. Gestionar cliente

- **Actor principal**: Usuario interno.
- **Estado**: Pendiente.
- **RF relacionados**: RF-02.
- **Precondiciones**: Sesión activa con rol `INTERNAL`.

**Flujo principal**

1. El usuario interno accede al listado de clientes.
2. Crea un cliente indicando nombre y datos básicos de contacto.
3. El sistema valida los datos y guarda el cliente con estado activo.
4. El usuario interno consulta o edita la ficha del cliente cuando lo necesita.
5. El usuario interno activa o desactiva el cliente cuando procede.

**Flujos alternativos y excepciones**

- 2a. Datos obligatorios incompletos: el sistema rechaza el guardado y señala los campos.
- 5a. Cliente inactivo: no debe usarse para crear nuevo trabajo, salvo decisión posterior.

**Postcondiciones**: El cliente queda registrado o actualizado y disponible para asociar proyectos.

**Reglas asociadas**: RN-04, RN-05.

### CU-04. Gestionar proyecto

- **Actor principal**: Usuario interno.
- **Estado**: Pendiente.
- **RF relacionados**: RF-03.
- **Precondiciones**: Sesión activa con rol `INTERNAL`. Existe al menos un cliente.

**Flujo principal**

1. El usuario interno selecciona un cliente.
2. Crea un proyecto asociado indicando nombre, descripción y estado.
3. Define si el proyecto es visible para el cliente.
4. El sistema valida y guarda el proyecto.
5. El usuario interno consulta, edita o cambia el estado del proyecto cuando procede.

**Flujos alternativos y excepciones**

- 1a. No existe ningún cliente: el sistema invita a crear un cliente antes de continuar.
- 2a. Proyecto sin cliente asociado: el sistema impide el guardado.

**Postcondiciones**: El proyecto queda registrado y asociado a un único cliente.

**Reglas asociadas**: RN-06, RN-07.

### CU-05. Gestionar tarea

- **Actor principal**: Usuario interno.
- **Estado**: Pendiente.
- **RF relacionados**: RF-04.
- **Precondiciones**: Sesión activa con rol `INTERNAL`. Existe al menos un proyecto.

**Flujo principal**

1. El usuario interno selecciona un proyecto.
2. Crea una tarea indicando título, descripción, estado y prioridad.
3. Indica si la tarea es visible para el cliente.
4. Opcionalmente asigna un usuario interno responsable.
5. El sistema valida y guarda la tarea.
6. El usuario interno consulta, edita o cambia el estado de la tarea cuando procede.

**Flujos alternativos y excepciones**

- 2a. Tarea sin proyecto asociado: el sistema impide el guardado.
- 6a. Tarea descartada: se conserva como descartada y no se confunde con una tarea eliminada.

**Postcondiciones**: La tarea queda registrada y asociada a un proyecto (y, por derivación, a un cliente).

**Reglas asociadas**: RN-08, RN-09.

### CU-06. Registrar tiempo manual

- **Actor principal**: Usuario interno.
- **Estado**: Pendiente.
- **RF relacionados**: RF-05, RF-08, RF-09.
- **Precondiciones**: Sesión activa con rol `INTERNAL`. Existe la tarea sobre la que se registra.

**Flujo principal**

1. El usuario interno selecciona una tarea.
2. Indica fecha de trabajo, duración y descripción del trabajo realizado.
3. El sistema aplica la tarifa vigente y calcula el coste estimado.
4. El sistema guarda el registro de tiempo asociado a la tarea y al usuario interno.

**Flujos alternativos y excepciones**

- 2a. Duración no positiva: el sistema rechaza el registro.
- 3a. No hay tarifa aplicable: el registro se guarda sin coste estimado.

**Postcondiciones**: El registro de tiempo queda asociado a la tarea y suma a los totales de tarea, proyecto y cliente.

**Reglas asociadas**: RN-10, RN-11, RN-13, RN-14.

### CU-07. Iniciar y detener tarea (start/stop)

- **Actor principal**: Usuario interno.
- **Estado**: Pendiente.
- **RF relacionados**: RF-06, RF-07, RF-08.
- **Precondiciones**: Sesión activa con rol `INTERNAL`. Existe la tarea a iniciar.

**Flujo principal**

1. El usuario interno selecciona una tarea y pulsa iniciar.
2. El sistema registra la hora de inicio y marca la tarea como activa.
3. El usuario interno trabaja en la tarea.
4. El usuario interno pulsa detener.
5. El sistema registra la hora de fin y calcula la duración.
6. El sistema crea el registro de tiempo de tipo start/stop y aplica la tarifa vigente.

**Flujos alternativos y excepciones**

- 1a. Ya existe otra tarea activa del mismo usuario: antes de iniciar la nueva, el sistema detiene la anterior y cierra su registro de tiempo (prevención de solapamiento).
- 4a. El usuario cierra sesión con una tarea activa: la estrategia exacta de cierre se define en arquitectura; el MVP debe evitar registros inconsistentes.

**Postcondiciones**: Existe un único registro de tiempo cerrado para la tarea trabajada y ninguna tarea queda activa de forma indebida.

**Reglas asociadas**: RN-10, RN-11, RN-12, RN-13.

### CU-08. Consultar horas y costes

- **Actor principal**: Usuario interno.
- **Estado**: Pendiente.
- **RF relacionados**: RF-08, RF-09.
- **Precondiciones**: Sesión activa con rol `INTERNAL`. Existen registros de tiempo.

**Flujo principal**

1. El usuario interno selecciona un ámbito (tarea, proyecto, cliente o periodo).
2. El sistema agrega las horas registradas del ámbito.
3. El sistema muestra el total de horas y el coste estimado.

**Flujos alternativos y excepciones**

- 2a. Sin registros en el ámbito: el sistema muestra totales en cero.

**Postcondiciones**: El usuario interno conoce el total de horas y el coste estimado del ámbito consultado.

**Reglas asociadas**: RN-13, RN-14.

### CU-09. Generar reporte

- **Actor principal**: Usuario interno.
- **Estado**: Pendiente.
- **RF relacionados**: RF-10.
- **Precondiciones**: Sesión activa con rol `INTERNAL`. Existen tareas y tiempos en el periodo.

**Flujo principal**

1. El usuario interno selecciona cliente, proyecto opcional y periodo.
2. El sistema reúne las tareas y registros de tiempo del periodo.
3. El sistema calcula total de horas y coste estimado.
4. El sistema genera un reporte en estado borrador, consultable en pantalla.
5. El usuario interno revisa el reporte y define si será visible para el cliente.

**Flujos alternativos y excepciones**

- 1a. Sin proyecto seleccionado: el reporte se interpreta como reporte general del cliente para el periodo.
- 2a. Sin datos en el periodo: el sistema avisa y no genera un reporte vacío sin confirmación.

**Postcondiciones**: Existe un reporte consultable en pantalla asociado al cliente y al periodo.

**Reglas asociadas**: RN-15, RN-16, RN-17.

### CU-10. Generar resumen asistido por IA

- **Actor principal**: Usuario interno. **Actor de apoyo**: Servicio de IA.
- **Estado**: Pendiente.
- **RF relacionados**: RF-11.
- **Precondiciones**: Existe un reporte o conjunto de tareas sobre el que generar el resumen.

**Flujo principal**

1. El usuario interno solicita un resumen profesional del trabajo del periodo.
2. El sistema envía al servicio de IA la información mínima necesaria.
3. El servicio de IA devuelve un texto propuesto.
4. El sistema muestra el texto como propuesta revisable y registra el uso de IA.
5. El usuario interno revisa, ajusta y, si procede, incorpora el resumen al reporte.

**Flujos alternativos y excepciones**

- 3a. El servicio de IA no está disponible o falla: el sistema lo indica y el reporte sigue siendo usable sin resumen IA; el uso se registra con estado de error.
- 5a. El usuario interno descarta el texto: el uso de IA queda registrado como descartado.

**Postcondiciones**: El reporte puede incluir un resumen revisado por el usuario interno; el uso de IA queda trazado.

**Reglas asociadas**: RN-18, RN-19, RN-22.

### CU-11. Consultar área de cliente

- **Actor principal**: Cliente.
- **Estado**: Pendiente.
- **RF relacionados**: RF-12.
- **Precondiciones**: Sesión activa con rol `CLIENT` asociado a un cliente.

**Flujo principal**

1. El cliente accede a su área privada.
2. El sistema muestra únicamente proyectos, tareas y reportes asociados a su cliente y marcados como visibles.
3. El cliente consulta el estado de los trabajos compartidos y los reportes generados.

**Flujos alternativos y excepciones**

- 2a. No hay información visible: el sistema muestra un estado vacío informativo.
- 2b. El cliente intenta acceder a un recurso no visible o de otro cliente: el sistema deniega el acceso.

**Postcondiciones**: El cliente solo ha accedido a información asociada a él y marcada como visible.

**Reglas asociadas**: RN-02, RN-20, RN-21.

### CU-12. Interpretar instrucción en lenguaje natural

- **Actor principal**: Usuario interno. **Actor de apoyo**: Servicio de IA.
- **Estado**: Pendiente. Prueba conceptual controlada.
- **RF relacionados**: RF-13.
- **Precondiciones**: Sesión activa con rol `INTERNAL`.

**Flujo principal**

1. El usuario interno introduce una instrucción en lenguaje natural en la pantalla de prueba.
2. El sistema envía la instrucción al servicio de IA.
3. El servicio de IA devuelve una propuesta estructurada.
4. El sistema muestra la propuesta como resultado revisable, sin ejecutar ninguna acción.

**Flujos alternativos y excepciones**

- 3a. La instrucción no puede interpretarse: el sistema muestra que requiere revisión y no propone ninguna acción.
- 4a. El servicio de IA falla: el sistema lo indica y no ejecuta ninguna acción.

**Postcondiciones**: El sistema ha devuelto una propuesta estructurada sin ejecutar acciones reales.

**Reglas asociadas**: RN-18, RN-19, RN-22.

## 5. Reglas de negocio

Las reglas siguientes consolidan, con identificador, las reglas dispersas en `docs/01-requisitos-funcionales.md` (§6) y `docs/03-modelo-datos.md` (§5). El modelo de datos sigue siendo la fuente de verdad conceptual.

| ID | Regla | Origen |
|---|---|---|
| RN-01 | Las zonas privadas requieren un usuario autenticado. | Modelo §5.1 |
| RN-02 | Un usuario cliente solo puede consultar información asociada a su cliente y marcada como visible. | RF §6, Modelo §5.1 |
| RN-03 | La administración de usuarios está restringida a usuarios `INTERNAL`. | Plan 13/15 |
| RN-04 | Todo proyecto debe estar asociado a un cliente. | Modelo §5.2 |
| RN-05 | Un cliente inactivo no debería usarse para crear nuevo trabajo, salvo decisión posterior. | Modelo §5.2 |
| RN-06 | Un proyecto solo es visible en el área de cliente si está marcado como visible. | Modelo §5.2 |
| RN-07 | La información interna del cliente no debe mostrarse en el área de cliente. | Modelo §5.2 |
| RN-08 | Toda tarea debe estar asociada a un proyecto; su cliente se deduce del proyecto. | Modelo §5.3 |
| RN-09 | Las tareas no visibles no deben aparecer en el área de cliente; las descartadas no equivalen a eliminadas. | Modelo §5.3 |
| RN-10 | Todo registro de tiempo debe estar asociado a una tarea y a un usuario interno. | Modelo §5.4 |
| RN-11 | La duración de un registro de tiempo debe ser positiva. | Modelo §5.4 |
| RN-12 | Por defecto, un usuario interno solo puede tener una tarea activa; al iniciar otra, la anterior se detiene antes. | RF-07, Modelo §5.4 |
| RN-13 | El registro de tiempo conserva la tarifa aplicada en el momento del cálculo. | Modelo §5.4, §5.5 |
| RN-14 | La tarifa sirve para estimar costes, no para facturar; cambiarla no altera costes históricos sin decisión explícita. | Modelo §5.5 |
| RN-15 | Un reporte pertenece siempre a un cliente y puede asociarse opcionalmente a un proyecto. | Modelo §5.6 |
| RN-16 | Sin proyecto asociado, el reporte se interpreta como reporte general del cliente para el periodo. | Modelo §5.6 |
| RN-17 | Un reporte visible para cliente no debe mostrar información interna no compartida. | Modelo §5.6 |
| RN-18 | La IA no debe ejecutar acciones reales de forma autónoma. | RF §6, Modelo §5.7 |
| RN-19 | Los resultados de IA deben ser revisables por el usuario interno antes de considerarse válidos. | RF-11, Modelo §5.7 |
| RN-20 | La visibilidad de proyectos, tareas y reportes debe controlarse de forma explícita. | Modelo §6 |
| RN-21 | Un cliente solo debe ver información asociada a él. | Modelo §6 |
| RN-22 | El uso de IA almacena solo la información mínima necesaria y no conserva prompts completos sin valor funcional. | Modelo §5.7, §6 |

## 6. Trazabilidad con requisitos funcionales

| Caso de uso | RF cubiertos | CU equivalente en requisitos |
|---|---|---|
| CU-01 Iniciar sesión | RF-01 | — |
| CU-02 Gestionar usuarios | RF-01 | — |
| CU-03 Gestionar cliente | RF-02 | CU-01 (parcial) |
| CU-04 Gestionar proyecto | RF-03 | CU-01 (parcial) |
| CU-05 Gestionar tarea | RF-04 | CU-01 (parcial) |
| CU-06 Registrar tiempo manual | RF-05, RF-08, RF-09 | CU-02 |
| CU-07 Iniciar y detener tarea | RF-06, RF-07, RF-08 | CU-03 |
| CU-08 Consultar horas y costes | RF-08, RF-09 | — |
| CU-09 Generar reporte | RF-10 | CU-04 |
| CU-10 Generar resumen IA | RF-11 | CU-05 |
| CU-11 Consultar área de cliente | RF-12 | CU-06 |
| CU-12 Interpretar lenguaje natural | RF-13 | CU-07 |

> Nota: el documento de requisitos (`docs/01-requisitos-funcionales.md`, §5) agrupa el alta de cliente, proyecto y tarea en un único CU-01 resumido. Este documento los desglosa para detallar flujos y excepciones por entidad.

## 7. Glosario del dominio

- **Usuario interno**: persona del equipo que gestiona el trabajo (`UserRole.INTERNAL`).
- **Cliente**: organización o persona para la que se realizan trabajos; también el usuario con rol `CLIENT` asociado a ese cliente.
- **Proyecto**: agrupación de trabajo asociada a un único cliente.
- **Tarea**: unidad principal de trabajo dentro de un proyecto.
- **Registro de tiempo**: dedicación asociada a una tarea, manual o start/stop.
- **Tarifa**: importe por hora usado para estimar costes; no implica facturación.
- **Coste estimado**: cálculo orientativo a partir de horas y tarifa aplicada.
- **Reporte**: vista o documento básico de actividad por cliente, proyecto opcional y periodo.
- **Resumen asistido por IA**: texto propuesto por el servicio de IA, siempre revisable.
- **Visibilidad para cliente**: marca explícita que determina qué información ve el área de cliente.
- **Trazabilidad mínima**: registro básico de acciones relevantes (ver `docs/03-modelo-datos.md`, §3.9).
