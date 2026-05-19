# Requisitos funcionales

> Documento funcional del MVP del TFM.
> Define las funcionalidades incluidas en el alcance académico del proyecto y separa de forma explícita las líneas futuras del producto SaaS.

## 1. Introducción

Este documento recoge los requisitos funcionales del MVP del Trabajo Final de Máster.

Su objetivo es concretar qué debe permitir hacer la aplicación desde el punto de vista del usuario, manteniendo un alcance pequeño, funcional y defendible.

La visión general del producto se describe en `docs/00-vision-y-alcance.md`. Este documento no sustituye al modelo de datos ni a la arquitectura técnica. El detalle de entidades, campos, relaciones y decisiones técnicas se trabajará posteriormente en `docs/03-modelo-datos.md` y `docs/04-arquitectura.md`.

El criterio principal es desarrollar un MVP suficiente para demostrar el núcleo del sistema:

- gestión de clientes
- gestión de proyectos
- gestión de tareas
- registro de tiempos
- generación de reportes
- área básica de cliente
- uso controlado de IA para apoyar la redacción de reportes

No se pretende construir un SaaS comercial completo dentro del TFM.

## 2. Alcance funcional del MVP

El MVP del TFM se centrará en una aplicación web para gestionar trabajos realizados para clientes.

El sistema permitirá a un usuario interno registrar clientes, organizar proyectos, definir tareas, controlar tiempos de trabajo, calcular horas y costes estimados, y generar reportes básicos para el cliente.

La inteligencia artificial se incorporará de forma limitada y justificada, principalmente para generar resúmenes profesionales a partir de la información registrada. También se incluirá una prueba conceptual interna para interpretar instrucciones en lenguaje natural, sin integraciones externas ni ejecución automática de acciones.

Quedan fuera del alcance del MVP las funcionalidades propias de una plataforma SaaS comercial completa, como facturación, integraciones externas, multiempresa avanzado, automatizaciones complejas o sistemas avanzados de permisos.

## 3. Actores principales

### 3.1. Usuario interno

Representa al profesional, administrador o miembro del equipo que utiliza la aplicación para gestionar el trabajo con clientes.

Puede realizar las acciones principales del MVP:

- gestionar clientes
- gestionar proyectos
- gestionar tareas
- registrar tiempos
- iniciar y detener tareas
- revisar horas y costes estimados
- generar reportes
- revisar textos generados con IA

### 3.2. Cliente

Representa al cliente final que accede a una zona privada básica.

Su acceso estará limitado a la información que le corresponda y que haya sido marcada como visible.

Puede consultar:

- proyectos visibles
- tareas visibles
- estado de trabajos compartidos
- reportes generados para él

### 3.3. Roles fuera del MVP

El MVP no incluirá un sistema avanzado de roles y permisos.

Roles como responsable de proyecto, técnico con permisos específicos, administrador global SaaS, equipos multiempresa o usuarios del cliente con permisos diferenciados se consideran evolución futura.

## 4. Requisitos funcionales del MVP

### RF-01. Autenticación básica

El sistema debe permitir el acceso de usuarios identificados.

Debe diferenciar, como mínimo, entre usuario interno y cliente para limitar la información visible según el tipo de usuario.

### RF-02. Gestión básica de clientes

El usuario interno debe poder gestionar la información principal de los clientes.

El sistema debe permitir:

- crear clientes
- consultar clientes existentes
- actualizar su información básica
- activar o desactivar clientes cuando proceda
- acceder a la información relacionada con sus proyectos, tareas y reportes

### RF-03. Gestión básica de proyectos

El usuario interno debe poder organizar el trabajo mediante proyectos asociados a clientes.

El sistema debe permitir:

- crear proyectos asociados a un cliente
- consultar proyectos existentes
- actualizar su información básica
- cambiar su estado funcional
- consultar las tareas y tiempos asociados

### RF-04. Gestión básica de tareas

El usuario interno debe poder gestionar tareas de trabajo asociadas a proyectos.

El sistema debe permitir:

- crear tareas
- consultar tareas existentes
- actualizar su información básica
- cambiar su estado
- asociarlas a un proyecto y cliente
- indicar si una tarea será visible para el cliente

Los estados concretos de las tareas se definirán de forma sencilla para el MVP y se concretarán durante el diseño funcional y técnico posterior.

### RF-05. Registro manual de tiempos

El usuario interno debe poder registrar manualmente tiempo trabajado sobre una tarea.

El registro debe permitir indicar la dedicación realizada, la fecha de trabajo y una descripción funcional del trabajo realizado.

Este requisito permitirá justificar horas dedicadas sin depender siempre del sistema start/stop.

### RF-06. Control start/stop de tareas

El sistema debe permitir iniciar y detener el trabajo sobre una tarea.

Cuando el usuario interno inicia una tarea, el sistema debe registrar que esa tarea está activa. Al detenerla, el sistema debe calcular el tiempo trabajado y asociarlo a la tarea correspondiente.

Esta funcionalidad forma parte del núcleo demostrable del TFM.

### RF-07. Prevención de solapamientos

Por defecto, un usuario interno solo debe poder tener una tarea activa al mismo tiempo.

Si inicia una nueva tarea mientras otra está activa, el sistema debe detener la tarea anterior antes de iniciar la nueva.

Esta regla simplifica el control de tiempos y evita registros inconsistentes en el MVP.

### RF-08. Cálculo básico de horas

El sistema debe calcular las horas registradas a partir de los registros manuales y de los registros generados mediante start/stop.

Debe permitir consultar totales básicos por:

- tarea
- proyecto
- cliente
- periodo de tiempo

### RF-09. Tarifa básica y coste estimado

El sistema debe permitir aplicar una tarifa básica para estimar el coste del trabajo registrado.

El coste calculado tendrá carácter orientativo y no sustituirá a un sistema de facturación.

Las reglas avanzadas de tarifas, recargos o condiciones comerciales quedan fuera del MVP.

### RF-10. Generación de reportes básicos

El sistema debe permitir generar reportes básicos de actividad por cliente, proyecto y periodo.

El reporte debe reunir la información necesaria para justificar el trabajo realizado:

- tareas incluidas
- tiempos registrados
- total de horas
- coste estimado si procede
- resumen funcional del trabajo realizado

La exportación a PDF se considera recomendable pero aplazable. Para el MVP será suficiente una vista de reporte consultable en pantalla.

### RF-11. Resumen profesional asistido por IA

El sistema debe utilizar IA para generar un resumen profesional del trabajo realizado a partir de la información registrada.

La IA debe actuar como apoyo a la redacción, no como fuente autónoma de verdad.

El usuario interno debe poder revisar el texto generado antes de considerarlo válido para un reporte.

### RF-12. Área básica de cliente

El cliente debe poder acceder a una zona privada sencilla.

Desde esta zona podrá consultar únicamente información asociada a él y marcada como visible:

- proyectos visibles
- tareas visibles
- estado de trabajos compartidos
- reportes generados

El área de cliente del MVP será principalmente consultiva. No incluirá chat, validación formal de reportes, comentarios avanzados ni gestión documental completa.

### RF-13. Prueba conceptual interna de lenguaje natural

El sistema incluirá una prueba conceptual interna para interpretar instrucciones en lenguaje natural.

Esta funcionalidad permitirá introducir una instrucción escrita y obtener una propuesta estructurada o revisable por el usuario.

Ejemplo:

```text
Registra 1 hora y 30 minutos en la tarea "Revisión formulario contacto" del cliente Virtual Enjoy.
```

Resultado esperado a nivel conceptual:

```json
{
  "accion_propuesta": "registrar_tiempo",
  "cliente": "Virtual Enjoy",
  "tarea": "Revisión formulario contacto",
  "duracion_minutos": 90,
  "requiere_revision": true
}
```

Esta prueba no incluirá:

- integración con WhatsApp
- integración con email
- integración con agentes externos
- ejecución automática de acciones
- toma de decisiones autónoma por parte de la IA

Su objetivo es demostrar la posibilidad de transformar lenguaje natural en una propuesta estructurada dentro de un entorno controlado.

Si en una evolución futura esta funcionalidad llegase a ejecutar acciones reales, siempre deberá requerir confirmación explícita del usuario.

## 5. Casos de uso principales

### CU-01. Gestionar cliente, proyecto y tarea

El usuario interno crea o actualiza la información básica de un cliente, registra un proyecto asociado y define tareas de trabajo dentro de ese proyecto.

Este caso de uso representa el punto de partida del flujo principal del MVP.

### CU-02. Registrar tiempo manual

El usuario interno selecciona una tarea y registra manualmente una dedicación de tiempo asociada a un trabajo realizado.

El sistema incorpora ese tiempo al total de la tarea, proyecto y cliente.

### CU-03. Iniciar y detener una tarea

El usuario interno inicia el trabajo sobre una tarea mediante start/stop.

Cuando termina, detiene la tarea y el sistema calcula el tiempo dedicado.

Si el usuario inicia otra tarea mientras una está activa, la anterior se detiene automáticamente.

### CU-04. Generar reporte

El usuario interno selecciona un cliente, proyecto y periodo.

El sistema genera un reporte básico con las tareas realizadas, tiempos registrados, horas totales y coste estimado.

### CU-05. Generar resumen asistido por IA

El usuario interno solicita un resumen profesional del trabajo realizado.

La IA genera un texto orientado al cliente, que el usuario interno debe revisar antes de incorporarlo al reporte.

### CU-06. Consultar información visible como cliente

El cliente accede a su área privada y consulta proyectos, tareas o reportes visibles.

El sistema no debe mostrar información interna no marcada como visible.

### CU-07. Interpretar instrucción en lenguaje natural

El usuario interno introduce una instrucción en lenguaje natural en una pantalla o espacio interno de prueba.

El sistema devuelve una propuesta estructurada que puede ser revisada, sin ejecutar automáticamente ninguna acción.

## 6. Reglas funcionales relevantes

- La información visible para el cliente debe estar controlada explícitamente.
- El cliente solo puede consultar información asociada a él.
- Por defecto, un usuario interno solo puede tener una tarea activa al mismo tiempo.
- Si se inicia una nueva tarea, la tarea activa anterior debe detenerse antes.
- Los registros de tiempo deben quedar asociados a una tarea.
- Las horas calculadas deben poder agregarse por tarea, proyecto, cliente y periodo.
- Los costes calculados son estimaciones y no constituyen facturación.
- La IA puede proponer textos o interpretar instrucciones, pero no debe tomar decisiones autónomas.
- La prueba de lenguaje natural no ejecuta acciones reales de forma automática.
- El detalle de entidades, campos, relaciones y restricciones se definirá en `docs/03-modelo-datos.md`.

## 7. Clasificación de funcionalidades

| Funcionalidad | Clasificación | Entra en TFM | Motivo | Evolución futura |
|---|---|---|---|---|
| Autenticación básica | Imprescindible para el MVP | Sí | Permite diferenciar acceso interno y acceso de cliente. | Roles y permisos avanzados. |
| Gestión básica de clientes | Imprescindible para el MVP | Sí | Es la base del sistema de gestión de trabajos. | Segmentación, historial avanzado y datos comerciales. |
| Gestión básica de proyectos | Imprescindible para el MVP | Sí | Organiza el trabajo realizado para cada cliente. | Plantillas, presupuestos o planificación avanzada. |
| Gestión básica de tareas | Imprescindible para el MVP | Sí | Representa la unidad principal de trabajo. | Comentarios avanzados, adjuntos y flujos de revisión. |
| Registro manual de tiempos | Imprescindible para el MVP | Sí | Permite registrar dedicaciones reales de forma sencilla. | Importaciones, validaciones avanzadas o aprobaciones. |
| Control start/stop | Imprescindible para el MVP | Sí | Demuestra control operativo de tiempos. | Temporizadores múltiples o reglas por permisos. |
| Prevención de solapamientos | Imprescindible para el MVP | Sí | Evita inconsistencias en el registro de tiempos. | Excepciones configurables por rol o proyecto. |
| Cálculo básico de horas | Imprescindible para el MVP | Sí | Permite justificar el trabajo realizado. | Analítica avanzada de productividad. |
| Tarifa básica y coste estimado | Imprescindible para el MVP | Sí | Aporta valor funcional sin entrar en facturación. | Tarifas complejas, recargos y reglas comerciales. |
| Reportes básicos en pantalla | Imprescindible para el MVP | Sí | Permite entregar una justificación clara del trabajo. | Exportación PDF, plantillas y personalización visual. |
| Resumen profesional asistido por IA | Imprescindible para el MVP | Sí | Integra IA en el flujo principal del TFM. | Generación automática de reportes completos. |
| Área básica de cliente | Imprescindible para el MVP | Sí | Permite demostrar transparencia hacia el cliente. | Portal avanzado, comentarios, validaciones y documentos. |
| Prueba conceptual interna de lenguaje natural | Imprescindible para el MVP | Sí | Demuestra interpretación controlada de instrucciones con IA. | Integraciones externas y ejecución confirmada de acciones. |
| Exportación PDF de reportes | Recomendable pero aplazable | No | Mejora la presentación, pero no es necesaria para validar el núcleo. | Exportación formal y personalización de documentos. |
| Filtros avanzados | Recomendable pero aplazable | No | Aportan comodidad, pero no son esenciales para la demo. | Búsquedas, vistas guardadas y filtros complejos. |
| Dashboards estadísticos | Recomendable pero aplazable | No | Pueden ampliar demasiado el alcance. | Paneles de productividad, rentabilidad y actividad. |
| Integración completa con Holded | Línea futura del producto SaaS | No | Implica dependencia externa y complejidad adicional. | Sincronización de clientes, facturas y documentos. |
| Facturación propia | Línea futura del producto SaaS | No | Desvía el foco del control de tareas y tiempos. | Facturas, impuestos, estados de cobro y vencimientos. |
| Multiempresa avanzado | Línea futura del producto SaaS | No | Es propio de un SaaS comercial completo. | Planes, tenants, límites y administración global. |
| App móvil nativa | Línea futura del producto SaaS | No | No es necesaria para defender el MVP web. | Aplicaciones iOS y Android. |
| Aplicación de escritorio | Línea futura del producto SaaS | No | No aporta valor suficiente al TFM frente a la web. | Cliente independiente si el producto lo requiere. |
| Integraciones con WhatsApp, email o agentes externos | Línea futura del producto SaaS | No | Añaden riesgos técnicos, permisos y seguridad. | Canales conversacionales y asistentes externos. |
| CRM comercial completo | Descartada para el TFM | No | Cambia el foco hacia ventas y marketing. | Podría evaluarse como producto separado. |
| Pasarela de pago | Descartada para el TFM | No | No aporta al núcleo funcional del TFM. | Suscripciones comerciales del SaaS. |
| Firma digital | Descartada para el TFM | No | Añade complejidad legal y técnica innecesaria. | Validación formal de reportes o contratos. |
| Sistema avanzado de permisos | Descartada para el TFM | No | Sobredimensiona el MVP. | Matriz de permisos por rol, equipo y cliente. |
| Automatizaciones complejas | Descartada para el TFM | No | Riesgo alto de sobrealcance. | Flujos automáticos configurables. |

## 8. Fuera del alcance del MVP

Quedan fuera del alcance del MVP del TFM:

- integración completa con Holded
- facturación propia
- multiempresa avanzado
- app móvil nativa
- aplicación de escritorio
- CRM comercial completo
- integraciones reales con WhatsApp, email o agentes externos
- automatizaciones complejas
- sistema avanzado de permisos
- pasarela de pago
- firma digital
- chat cliente-proveedor
- notificaciones avanzadas
- gestión documental completa
- dashboards financieros avanzados

Estas funcionalidades podrán documentarse como evolución futura del producto SaaS, pero no deben implementarse como parte del MVP salvo decisión posterior reflejada explícitamente en la documentación del repositorio.

## 9. Criterios de aceptación funcional

El documento de requisitos funcionales se considerará satisfecho para el MVP si el sistema permite demostrar el siguiente flujo principal:

1. Un usuario interno accede al sistema.
2. Gestiona un cliente.
3. Gestiona un proyecto asociado al cliente.
4. Gestiona tareas asociadas al proyecto.
5. Registra tiempo manualmente sobre una tarea.
6. Inicia y detiene una tarea mediante start/stop.
7. El sistema evita solapamientos de tareas activas.
8. El sistema calcula horas registradas.
9. El sistema estima costes básicos a partir de una tarifa.
10. El sistema genera un reporte básico consultable.
11. La IA genera un resumen profesional revisable.
12. El cliente accede a su área básica y consulta solo información visible.
13. La prueba interna de lenguaje natural devuelve una propuesta estructurada sin ejecutar acciones automáticamente.

El MVP será válido si este flujo puede demostrarse de extremo a extremo de forma clara, sencilla y coherente con el alcance del TFM.
