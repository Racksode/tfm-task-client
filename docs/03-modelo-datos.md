# Modelo de datos

> Modelo de datos conceptual inicial del MVP del TFM.
> Define entidades, relaciones y reglas de negocio sin concretar SQL, migraciones, ORM ni decisiones tecnicas de implementacion.

## 1. Introduccion

Este documento describe el modelo de datos conceptual inicial del MVP del Trabajo Final de Master.

Su objetivo es identificar las entidades principales del sistema, sus relaciones y las reglas de negocio necesarias para soportar los requisitos funcionales definidos en `docs/01-requisitos-funcionales.md` y los requisitos no funcionales definidos en `docs/02-requisitos-no-funcionales.md`.

El documento no define todavia una implementacion tecnica concreta. No incluye SQL, migraciones, Prisma, Drizzle, tipos concretos de base de datos, indices, restricciones fisicas ni decisiones de arquitectura. Esas decisiones se documentaran posteriormente en `docs/04-arquitectura.md` y, cuando proceda, en ADRs.

El modelo se limita al alcance del MVP del TFM: clientes, proyectos, tareas, registros de tiempo, tarifas basicas, reportes, usuarios, area de cliente, uso controlado de IA y trazabilidad minima.

## 2. Criterios de diseno conceptual

El modelo debe ser pequeno, comprensible y defendible.

Se priorizan:

- entidades necesarias para el flujo principal del MVP
- relaciones simples y faciles de explicar
- control basico de visibilidad para el area de cliente
- coherencia de registros de tiempo
- calculo basico de horas y costes estimados
- soporte para reportes en pantalla
- soporte minimo para resumen asistido por IA
- trazabilidad minima de acciones relevantes

Se evita incorporar al modelo del MVP:

- facturacion propia
- integracion completa con Holded
- documentos o adjuntos avanzados
- chat cliente-proveedor
- multiempresa SaaS avanzado
- sistema complejo de permisos
- automatizaciones avanzadas
- auditoria avanzada
- dashboards financieros complejos

## 3. Entidades principales del MVP

### 3.1. Usuario

Representa a una persona que accede al sistema.

En el MVP se contemplan dos tipos basicos:

- usuario interno
- cliente

Campos conceptuales:

- identificador
- nombre
- email
- rol basico
- cliente asociado, solo si el usuario representa a un cliente
- estado
- fecha de creacion
- fecha de actualizacion

Notas:

- El usuario interno puede gestionar clientes, proyectos, tareas, tiempos y reportes.
- El usuario cliente solo puede acceder a informacion asociada a su cliente y marcada como visible.
- No se modela una matriz avanzada de permisos en el MVP.

### 3.2. Cliente

Representa a la organizacion o persona para la que se realizan trabajos.

Campos conceptuales:

- identificador
- nombre
- email
- telefono
- empresa
- observaciones internas
- estado
- tarifa base opcional
- fecha de creacion
- fecha de actualizacion

Notas:

- El cliente agrupa proyectos, tareas por derivacion, registros de tiempo por derivacion y reportes.
- Las observaciones internas no deben mostrarse en el area de cliente salvo decision explicita posterior.
- Un cliente puede estar activo o inactivo.

### 3.3. Proyecto

Representa una agrupacion de trabajo asociada a un cliente.

Campos conceptuales:

- identificador
- cliente asociado
- nombre
- descripcion
- estado
- fecha de inicio
- fecha prevista de finalizacion
- tarifa base opcional
- fecha de creacion
- fecha de actualizacion

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
- descripcion
- estado
- prioridad basica
- visible para cliente
- usuario interno responsable opcional
- fecha de creacion funcional
- fecha de finalizacion funcional
- fecha de creacion del registro
- fecha de actualizacion del registro

Estados conceptuales para el MVP:

- pendiente
- en curso
- pausada
- finalizada
- descartada

Notas:

- La tarea pertenece a un proyecto.
- El cliente asociado a una tarea se obtiene a traves de su proyecto.
- La visibilidad para cliente debe controlarse de forma explicita.
- No se incluyen comentarios avanzados, adjuntos ni flujos complejos de revision.

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
- descripcion del trabajo realizado
- tarifa aplicada
- coste estimado calculado
- estado basico del registro, si procede
- fecha de creacion
- fecha de actualizacion

Notas:

- Todo registro de tiempo debe estar asociado a una tarea.
- Los registros start/stop deben permitir calcular la duracion a partir de inicio y fin.
- Los registros manuales deben permitir indicar una duracion sin depender del temporizador.
- La tarifa aplicada al registro debe conservar el valor usado para calcular el coste estimado, aunque cambie posteriormente la tarifa base del cliente o proyecto.

### 3.6. Tarifa

Representa una tarifa basica para estimar costes.

Campos conceptuales:

- identificador
- nombre
- importe por hora
- moneda
- ambito conceptual
- cliente asociado opcional
- proyecto asociado opcional
- estado
- fecha de creacion
- fecha de actualizacion

Ambitos conceptuales posibles:

- tarifa general del sistema
- tarifa asociada a cliente
- tarifa asociada a proyecto
- tarifa aplicada directamente a registro de tiempo

Notas:

- El MVP no incluye reglas avanzadas por nocturnidad, urgencia, festivos o condiciones comerciales complejas.
- Los costes calculados son estimaciones y no sustituyen a un sistema de facturacion.

### 3.7. Reporte

Representa una vista o documento basico de actividad generada para un cliente.

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
- estado basico
- fecha de generacion
- fecha de revision
- usuario interno que lo genera o revisa

Estados conceptuales:

- borrador
- generado
- revisado

Notas:

- El reporte se genera a partir de cliente, proyecto opcional y periodo.
- El reporte debe poder consultarse en pantalla.
- La exportacion a PDF queda como mejora recomendable pero aplazable.
- El reporte visible para cliente no debe incluir informacion interna no compartida.

### 3.8. UsoIA

Representa un uso controlado y minimo de IA dentro del MVP.

Su finalidad es cubrir:

- generacion de resumen asistido para reportes
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
- fecha de revision, si aplica

Tipos conceptuales:

- resumen de reporte
- interpretacion de lenguaje natural

Estados conceptuales:

- generado
- revisado
- descartado
- error

Notas:

- UsoIA es una entidad conceptual minima.
- No se decide todavia proveedor de IA, almacenamiento exacto de prompts, tokens, costes ni detalles tecnicos.
- La IA no debe ejecutar acciones reales de forma autonoma.
- Los resultados de IA deben ser revisables por el usuario interno.
- La fuente de verdad son los datos registrados en el sistema, no la salida generada por IA.

Regla de privacidad:

- No se debe almacenar informacion sensible innecesaria en UsoIA.
- No se deben conservar prompts completos si no aportan valor funcional al MVP.
- Se debe registrar solo la informacion minima util para revision, trazabilidad basica y defensa academica.

### 3.9. TrazabilidadAccion

Representa una trazabilidad minima de acciones relevantes del sistema.

No representa una auditoria avanzada, una solucion de cumplimiento normativo ni una estrategia completa de observabilidad.

Campos conceptuales:

- identificador
- tipo de accion
- usuario que realiza la accion, cuando aplique
- entidad afectada
- resultado basico
- detalle minimo opcional
- fecha y hora

Acciones relevantes:

- creacion de tareas
- modificacion de tareas
- creacion de registros de tiempo
- inicio de tarea mediante start/stop
- parada de tarea mediante start/stop
- generacion de reportes
- revision de reportes
- uso de funcionalidades de IA
- revision o descarte de resultados generados por IA

Notas:

- La trazabilidad busca facilitar revision, depuracion y defensa del MVP.
- La estrategia exacta de auditoria queda aplazada para arquitectura y posible evolucion futura.

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
- Un `UsoIA` tambien puede representar una prueba controlada de lenguaje natural sin ejecutar acciones.
- Una `TrazabilidadAccion` puede referenciar acciones relevantes sobre tareas, registros de tiempo, reportes o uso de IA.

## 5. Reglas de negocio del modelo

### 5.1. Usuarios y area de cliente

- Las zonas privadas requieren usuario autenticado.
- Un usuario interno puede gestionar entidades operativas del MVP.
- Un usuario cliente solo puede consultar informacion asociada a su cliente.
- Un usuario cliente solo debe ver proyectos, tareas y reportes marcados como visibles.
- No se incluye un sistema avanzado de roles y permisos en el MVP.

### 5.2. Clientes y proyectos

- Todo proyecto debe estar asociado a un cliente.
- Un cliente inactivo no deberia usarse para crear nuevo trabajo, salvo decision posterior.
- La informacion interna del cliente no debe mostrarse en el area de cliente.

### 5.3. Tareas

- Toda tarea debe estar asociada a un proyecto.
- Una tarea puede estar marcada como visible o no visible para cliente.
- Las tareas no visibles no deben aparecer en el area de cliente.
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
- El registro de tiempo debe conservar la tarifa aplicada en el momento del registro o calculo.
- Cambiar una tarifa base no debe alterar automaticamente los costes historicos ya calculados, salvo decision posterior explicita.
- Las reglas avanzadas de recargos quedan fuera del MVP.

### 5.6. Reportes

- Un reporte debe estar asociado a un cliente.
- Un reporte puede estar asociado a un proyecto concreto o cubrir varios proyectos del cliente, si el flujo funcional lo requiere.
- Un reporte debe generarse para un periodo definido.
- Un reporte debe recoger tareas, tiempos, total de horas y coste estimado.
- Un reporte puede incluir un resumen asistido por IA.
- El resumen asistido por IA debe ser revisable por el usuario interno.
- Un reporte visible para cliente no debe mostrar informacion interna no compartida.

### 5.7. Uso de IA

- La IA puede generar resumenes profesionales o propuestas estructuradas.
- La IA no debe ejecutar acciones reales de forma automatica.
- La prueba de lenguaje natural debe devolver una propuesta revisable.
- Si la IA no esta disponible, el sistema debe seguir siendo usable.
- UsoIA debe almacenar solo informacion minima necesaria para el MVP.

### 5.8. Trazabilidad minima

- Debe existir trazabilidad minima de acciones relevantes.
- La trazabilidad no sustituye a una auditoria avanzada.
- La trazabilidad debe permitir saber que accion se realizo, sobre que entidad, por que usuario y con que resultado basico.
- La estrategia exacta de auditoria queda fuera del modelo conceptual inicial.

## 6. Privacidad y visibilidad

El modelo debe ayudar a proteger la informacion interna y la informacion de clientes.

Reglas principales:

- Un cliente solo debe ver informacion asociada a el.
- La visibilidad de tareas y reportes debe controlarse de forma explicita.
- Las observaciones internas y datos no compartidos no deben mostrarse al cliente.
- Los datos enviados o registrados en relacion con IA deben minimizarse.
- UsoIA no debe almacenar informacion sensible innecesaria.
- No se conservaran prompts completos si no aportan valor funcional al MVP.

Estas reglas se inspiran en buenas practicas de privacidad, sin considerar el MVP una solucion legalmente certificada.

## 7. Entidades fuera del alcance del MVP

No se incluiran en el modelo inicial:

- facturas
- documentos adjuntos
- integracion con Holded
- pagos o suscripciones
- planes comerciales SaaS
- organizaciones multiempresa avanzadas
- equipos con permisos complejos
- comentarios o chat cliente-proveedor
- notificaciones avanzadas
- firma digital
- auditoria avanzada
- historico completo de cambios de cada campo

Estas entidades podran evaluarse como evolucion futura del producto SaaS, pero no forman parte del modelo conceptual inicial del TFM.

## 8. Decisiones aplazadas para arquitectura

Las siguientes decisiones quedan expresamente aplazadas para `docs/04-arquitectura.md` y ADRs:

- ORM o estrategia de acceso a datos.
- Tipos exactos de columnas.
- Indices.
- Claves, restricciones y estructura final de tablas.
- Borrado fisico o logico.
- Estrategia exacta de auditoria.
- Almacenamiento concreto de datos de IA.
- Proveedor IA.
- Almacenamiento exacto de prompts, respuestas, tokens o costes.
- Estructura final de repositorios, servicios o capas de persistencia.
- Estrategia de validacion tecnica.
- Estrategia de migraciones.

Este documento solo fija el modelo conceptual necesario para razonar sobre el MVP.

## 9. Validacion documental del modelo

El modelo se considerara adecuado para esta fase si permite cubrir:

1. Autenticacion basica y diferenciacion entre usuario interno y cliente.
2. Gestion de clientes.
3. Gestion de proyectos asociados a clientes.
4. Gestion de tareas asociadas a proyectos.
5. Visibilidad basica de tareas y reportes para el area de cliente.
6. Registro manual de tiempos.
7. Control start/stop de tareas.
8. Prevencion de solapamientos de tareas activas por usuario interno.
9. Calculo basico de horas.
10. Aplicacion de tarifa basica y coste estimado.
11. Generacion de reportes por cliente, proyecto opcional y periodo.
12. Resumen asistido por IA revisable.
13. Prueba controlada de lenguaje natural sin ejecucion automatica.
14. Trazabilidad minima de acciones relevantes.
15. Separacion clara entre MVP del TFM y lineas futuras del SaaS.

## 10. Conclusion

El modelo de datos conceptual del MVP se centra en las entidades necesarias para demostrar el nucleo del TFM: clientes, proyectos, tareas, tiempos, tarifas, reportes, usuarios, area de cliente, IA controlada y trazabilidad minima.

La propuesta mantiene un alcance reducido y defendible, evitando convertir el modelo inicial en una plataforma SaaS completa.

Las decisiones tecnicas de implementacion quedan aplazadas para la fase de arquitectura, donde se concretaran herramientas, estructura fisica, persistencia y detalles propios del desarrollo.
