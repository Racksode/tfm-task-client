# Modelo de datos

> Modelo de datos conceptual inicial del MVP del TFM.
> Define entidades, relaciones y reglas de negocio sin concretar SQL, migraciones, ORM ni decisiones técnicas de implementación.

## 1. Introducción

Este documento describe el modelo de datos conceptual inicial del MVP del Trabajo Final de Máster.

Su objetivo es identificar las entidades principales del sistema, sus relaciones y las reglas de negocio necesarias para soportar los requisitos funcionales definidos en `docs/01-requisitos-funcionales.md` y los requisitos no funcionales definidos en `docs/02-requisitos-no-funcionales.md`.

El documento no define todavía una implementación técnica concreta. No incluye SQL, migraciones, Prisma, Drizzle, tipos concretos de base de datos, índices, restricciones físicas ni decisiones de arquitectura. Esas decisiones se documentarán posteriormente en `docs/04-arquitectura.md` y, cuando proceda, en ADRs.

El modelo se limita al alcance del MVP del TFM: clientes, proyectos, tareas, registros de tiempo, tarifas básicas, reportes, usuarios, área de cliente, uso controlado de IA y trazabilidad mínima.

## 2. Criterios de diseño conceptual

El modelo debe ser pequeño, comprensible y defendible.

Se priorizan:

- entidades necesarias para el flujo principal del MVP
- relaciones simples y fáciles de explicar
- control básico de visibilidad para el área de cliente
- coherencia de registros de tiempo
- cálculo básico de horas y costes estimados
- soporte para reportes en pantalla
- soporte mínimo para resumen asistido por IA
- trazabilidad mínima de acciones relevantes

Se evita incorporar al modelo del MVP:

- facturacion propia
- integración completa con Holded
- documentos o adjuntos avanzados
- chat cliente-proveedor
- multiempresa SaaS avanzado
- sistema complejo de permisos
- automatizaciones avanzadas
- auditoría avanzada
- dashboards financieros complejos

## 3. Entidades principales del MVP

### 3.1. Usuario

Representa a una persona que accede al sistema.

En el MVP se contemplan dos tipos básicos:

- usuario interno
- cliente

Campos conceptuales:

- identificador
- nombre
- email
- rol básico
- cliente asociado, solo si el usuario representa a un cliente
- estado
- fecha de creación
- fecha de actualización

Notas:

- El usuario interno puede gestionar clientes, proyectos, tareas, tiempos y reportes.
- El usuario cliente solo puede acceder a información asociada a su cliente y marcada como visible.
- No se modela una matriz avanzada de permisos en el MVP.

### 3.2. Cliente

Representa a la organizacion o persona para la que se realizan trabajos.

Campos conceptuales:

- identificador
- nombre
- email
- teléfono
- empresa
- observaciones internas
- estado
- tarifa base opcional
- fecha de creación
- fecha de actualización

Notas:

- El cliente agrupa proyectos, tareas por derivacion, registros de tiempo por derivacion y reportes.
- Las observaciones internas no deben mostrarse en el área de cliente salvo decisión explícita posterior.
- Un cliente puede estar activo o inactivo.

### 3.3. Proyecto

Representa una agrupacion de trabajo asociada a un cliente.

Campos conceptuales:

- identificador
- cliente asociado
- nombre
- descripción
- estado
- visible para cliente
- fecha de inicio
- fecha prevista de finalizacion
- tarifa base opcional
- fecha de creación
- fecha de actualización

Notas:

- Un proyecto pertenece a un unico cliente.
- Un proyecto puede contener varias tareas.
- El proyecto permite agrupar tiempos y reportes por contexto funcional.

### 3.4. Tarea

Representa la unidad principal de trabajo dentro del sistema.

Campos conceptuales:

- identificador
- proyecto asociado
- titulo
- descripción
- estado
- prioridad básica
- visible para cliente
- usuario interno responsable opcional
- fecha de creación funcional
- fecha de finalizacion funcional
- fecha de creación del registro
- fecha de actualización del registro

Estados conceptuales para el MVP:

- pendiente
- en curso
- pausada
- finalizada
- descartada

Notas:

- La tarea pertenece a un proyecto.
- El cliente asociado a una tarea se obtiene a traves de su proyecto.
- La visibilidad para cliente debe controlarse de forma explícita.
- No se incluyen comentarios avanzados, adjuntos ni flujos complejos de revisión.

### 3.5. RegistroTiempo

Representa una dedicacion de tiempo asociada a una tarea.

Puede proceder de:

- registro manual
- control start/stop

Campos conceptuales:

- identificador
- tarea asociada
- usuario interno asociado
- tipo de registro
- fecha de trabajo
- hora de inicio, cuando aplique
- hora de fin, cuando aplique
- duracion
- descripción del trabajo realizado
- tarifa aplicada
- coste estimado calculado
- estado básico del registro, si procede
- fecha de creación
- fecha de actualización

Notas:

- Todo registro de tiempo debe estar asociado a una tarea.
- Los registros start/stop deben permitir calcular la duracion a partir de inicio y fin.
- Los registros manuales deben permitir indicar una duracion sin depender del temporizador.
- La tarifa aplicada al registro debe conservar el valor usado para calcular el coste estimado, aunque cambie posteriormente la tarifa base del cliente o proyecto.

### 3.6. Tarifa

Representa una tarifa básica para estimar costes.

Campos conceptuales:

- identificador
- nombre
- importe por hora
- moneda
- ambito conceptual
- cliente asociado opcional
- proyecto asociado opcional
- estado
- fecha de creación
- fecha de actualización

Ambitos conceptuales posibles:

- tarifa general del sistema
- tarifa asociada a cliente
- tarifa asociada a proyecto
- tarifa aplicada directamente a registro de tiempo

Notas:

- El MVP no incluye reglas avanzadas por nocturnidad, urgencia, festivos o condiciones comerciales complejas.
- Los costes calculados son estimaciones y no sustituyen a un sistema de facturacion.

### 3.7. Reporte

Representa una vista o documento básico de actividad generada para un cliente.

Campos conceptuales:

- identificador
- cliente asociado
- proyecto asociado opcional
- periodo de inicio
- periodo de fin
- tareas incluidas
- total de horas
- coste estimado
- resumen funcional
- resumen asistido por IA opcional
- visible para cliente
- estado básico
- fecha de generación
- fecha de revisión
- usuario interno que lo genera o revisa

Estados conceptuales:

- borrador
- generado
- revisado

Notas:

- El reporte se genera a partir de cliente, proyecto opcional y periodo.
- El reporte debe poder consultarse en pantalla.
- La exportacion a PDF queda como mejora recomendable pero aplazable.
- El reporte visible para cliente no debe incluir información interna no compartida.

### 3.8. UsoIA

Representa un uso controlado y mínimo de IA dentro del MVP.

Su finalidad es cubrir:

- generación de resumen asistido para reportes
- prueba controlada de interpretacion de instrucciones en lenguaje natural

Campos conceptuales:

- identificador
- tipo de uso
- usuario solicitante
- entidad asociada, cuando aplique
- entrada resumida o referencia conceptual
- salida generada o propuesta estructurada
- estado
- fecha de solicitud
- fecha de revisión, si aplica

Tipos conceptuales:

- resumen de reporte
- interpretacion de lenguaje natural

Estados conceptuales:

- generado
- revisado
- descartado
- error

Notas:

- UsoIA es una entidad conceptual mínima.
- No se decide todavía proveedor de IA, almacenamiento exacto de prompts, tokens, costes ni detalles técnicos.
- La IA no debe ejecutar acciones reales de forma autónoma.
- Los resultados de IA deben ser revisables por el usuario interno.
- La fuente de verdad son los datos registrados en el sistema, no la salida generada por IA.

Regla de privacidad:

- No se debe almacenar información sensible innecesaria en UsoIA.
- No se deben conservar prompts completos si no aportan valor funcional al MVP.
- Se debe registrar solo la información mínima útil para revisión, trazabilidad básica y defensa académica.

### 3.9. TrazabilidadAccion

Representa una trazabilidad mínima de acciones relevantes del sistema.

No representa una auditoría avanzada, una solucion de cumplimiento normativo ni una estrategia completa de observabilidad.

Campos conceptuales:

- identificador
- tipo de acción
- usuario que realiza la acción, cuando aplique
- entidad afectada
- resultado básico
- detalle mínimo opcional
- fecha y hora

Acciones relevantes:

- creación de tareas
- modificación de tareas
- creación de registros de tiempo
- inicio de tarea mediante start/stop
- parada de tarea mediante start/stop
- generación de reportes
- revisión de reportes
- uso de funcionalidades de IA
- revisión o descarte de resultados generados por IA

Notas:

- La trazabilidad busca facilitar revisión, depuración y defensa del MVP.
- La estrategia exacta de auditoría queda aplazada para arquitectura y posible evolución futura.

## 4. Relaciones principales

Las relaciones conceptuales del MVP son:

- Un `Cliente` puede tener varios `Proyectos`.
- Un `Proyecto` pertenece a un `Cliente`.
- Una `Tarea` pertenece a un `Proyecto`.
- El `Cliente` de una `Tarea` se deduce a traves del `Proyecto`.
- Una `Tarea` puede tener varios `RegistrosTiempo`.
- Un `RegistroTiempo` pertenece a una `Tarea`.
- Un `RegistroTiempo` pertenece a un `Usuario` interno.
- Un `Usuario` con rol cliente esta asociado a un `Cliente`.
- Una `Tarifa` puede asociarse conceptualmente a un `Cliente`, a un `Proyecto` o a un `RegistroTiempo`.
- Un `Reporte` pertenece a un `Cliente`.
- Un `Reporte` puede estar asociado a un `Proyecto`.
- Un `Reporte` resume tareas y registros de tiempo de un periodo.
- Un `UsoIA` puede estar asociado a un `Reporte`.
- Un `UsoIA` también puede representar una prueba controlada de lenguaje natural sin ejecutar acciones.
- Una `TrazabilidadAccion` puede referenciar acciones relevantes sobre tareas, registros de tiempo, reportes o uso de IA.

## 5. Reglas de negocio del modelo

### 5.1. Usuarios y área de cliente

- Las zonas privadas requieren usuario autenticado.
- Un usuario interno puede gestionar entidades operativas del MVP.
- Un usuario cliente solo puede consultar información asociada a su cliente.
- Un usuario cliente solo debe ver proyectos, tareas y reportes marcados como visibles.
- No se incluye un sistema avanzado de roles y permisos en el MVP.

### 5.2. Clientes y proyectos

- Todo proyecto debe estar asociado a un cliente.
- Un cliente inactivo no deberia usarse para crear nuevo trabajo, salvo decisión posterior.
- La información interna del cliente no debe mostrarse en el área de cliente.

### 5.3. Tareas

- Toda tarea debe estar asociada a un proyecto.
- Una tarea puede estar marcada como visible o no visible para cliente.
- Las tareas no visibles no deben aparecer en el área de cliente.
- Los estados de tarea deben mantenerse simples para el MVP.
- Las tareas descartadas no deben confundirse con tareas eliminadas.

### 5.4. Registros de tiempo

- Todo registro de tiempo debe estar asociado a una tarea.
- Todo registro de tiempo debe estar asociado a un usuario interno.
- La duracion debe ser positiva.
- Un registro start/stop debe tener inicio y fin para considerarse completo.
- Un registro manual debe tener una duracion indicada por el usuario.
- Por defecto, un usuario interno solo puede tener una tarea activa al mismo tiempo.
- Si un usuario inicia una nueva tarea mientras otra esta activa, la tarea anterior debe detenerse antes.

### 5.5. Tarifas y costes

- La tarifa sirve para estimar costes, no para facturar.
- Puede existir una tarifa base por cliente o por proyecto.
- El registro de tiempo debe conservar la tarifa aplicada en el momento del registro o cálculo.
- Cambiar una tarifa base no debe alterar automáticamente los costes historicos ya calculados, salvo decisión posterior explícita.
- Las reglas avanzadas de recargos quedan fuera del MVP.

### 5.6. Reportes

- Un reporte debe estar asociado a un cliente.
- Un reporte pertenece siempre a un cliente.
- Un reporte puede estar asociado opcionalmente a un proyecto concreto.
- Si el reporte no tiene proyecto asociado, se interpretará como un reporte general del cliente para el periodo seleccionado.
- No se modela en el MVP una relación muchos-a-muchos entre reportes y proyectos.
- Un reporte debe generarse para un periodo definido.
- Un reporte debe recoger tareas, tiempos, total de horas y coste estimado.
- Un reporte puede incluir un resumen asistido por IA.
- El resumen asistido por IA debe ser revisable por el usuario interno.
- Un reporte visible para cliente no debe mostrar información interna no compartida.

### 5.7. Uso de IA

- La IA puede generar resumenes profesionales o propuestas estructuradas.
- La IA no debe ejecutar acciones reales de forma automática.
- La prueba de lenguaje natural debe devolver una propuesta revisable.
- Si la IA no esta disponible, el sistema debe seguir siendo usable.
- UsoIA debe almacenar solo información mínima necesaria para el MVP.

### 5.8. Trazabilidad mínima

- Debe existir trazabilidad mínima de acciones relevantes.
- La trazabilidad no sustituye a una auditoría avanzada.
- La trazabilidad debe permitir saber que acción se realizo, sobre que entidad, por qué usuario y con que resultado básico.
- La estrategia exacta de auditoría queda fuera del modelo conceptual inicial.

## 6. Privacidad y visibilidad

El modelo debe ayudar a proteger la información interna y la información de clientes.

Reglas principales:

- Un cliente solo debe ver información asociada a el.
- La visibilidad de tareas y reportes debe controlarse de forma explícita.
- Las observaciones internas y datos no compartidos no deben mostrarse al cliente.
- Los datos enviados o registrados en relación con IA deben minimizarse.
- UsoIA no debe almacenar información sensible innecesaria.
- No se conservaran prompts completos si no aportan valor funcional al MVP.

Estas reglas se inspiran en buenas prácticas de privacidad, sin considerar el MVP una solucion legalmente certificada.

## 7. Entidades fuera del alcance del MVP

No se incluiran en el modelo inicial:

- facturas
- documentos adjuntos
- integración con Holded
- pagos o suscripciones
- planes comerciales SaaS
- organizaciones multiempresa avanzadas
- equipos con permisos complejos
- comentarios o chat cliente-proveedor
- notificaciones avanzadas
- firma digital
- auditoría avanzada
- historico completo de cambios de cada campo

Estas entidades podrán evaluarse como evolución futura del producto SaaS, pero no forman parte del modelo conceptual inicial del TFM.

## 8. Decisiones aplazadas para arquitectura

Las siguientes decisiones quedan expresamente aplazadas para `docs/04-arquitectura.md` y ADRs:

- ORM o estrategia de acceso a datos.
- Tipos exactos de columnas.
- índices.
- Claves, restricciones y estructura final de tablas.
- Borrado físico o lógico.
- Estrategia exacta de auditoría.
- Almacenamiento concreto de datos de IA.
- Proveedor IA.
- Almacenamiento exacto de prompts, respuestas, tokens o costes.
- Estructura final de repositorios, servicios o capas de persistencia.
- Estrategia de validación técnica.
- Estrategia de migraciones.

Este documento solo fija el modelo conceptual necesario para razonar sobre el MVP.

## 9. Validación documental del modelo

El modelo se considerara adecuado para esta fase si permite cubrir:

1. Autenticación básica y diferenciación entre usuario interno y cliente.
2. Gestión de clientes.
3. Gestión de proyectos asociados a clientes.
4. Gestión de tareas asociadas a proyectos.
5. Visibilidad básica de tareas y reportes para el área de cliente.
6. Registro manual de tiempos.
7. Control start/stop de tareas.
8. Prevencion de solapamientos de tareas activas por usuario interno.
9. Cálculo básico de horas.
10. Aplicación de tarifa básica y coste estimado.
11. Generación de reportes por cliente, proyecto opcional y periodo.
12. Resumen asistido por IA revisable.
13. Prueba controlada de lenguaje natural sin ejecucion automática.
14. Trazabilidad mínima de acciones relevantes.
15. Separaci?n clara entre MVP del TFM y líneas futuras del SaaS.

## 10. Conclusión

El modelo de datos conceptual del MVP se centra en las entidades necesarias para demostrar el núcleo del TFM: clientes, proyectos, tareas, tiempos, tarifas, reportes, usuarios, área de cliente, IA controlada y trazabilidad mínima.

La propuesta mantiene un alcance reducido y defendible, evitando convertir el modelo inicial en una plataforma SaaS completa.

Las decisiones técnicas de implementación quedan aplazadas para la fase de arquitectura, donde se concretaran herramientas, estructura física, persistencia y detalles propios del desarrollo.
