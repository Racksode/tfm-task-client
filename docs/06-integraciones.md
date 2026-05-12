# Integraciones previstas y futuras

**Documento interno de trabajo**  
**Idioma:** Español  
**Tipo de documento:** Integraciones externas del proyecto  

---

## 1. Objetivo

Este documento recoge las integraciones externas previstas o contempladas para la evolución del producto.

El objetivo es diferenciar claramente entre:

- Integraciones asumibles dentro del TFM.
- Integraciones planteadas como evolución posterior.
- Integraciones que requieren análisis técnico y de seguridad adicional.

---

## 2. Integraciones dentro del alcance del TFM

En el MVP inicial no se contempla una integración completa con servicios externos críticos.

Sí podrá contemplarse una prueba conceptual controlada para demostrar el uso de IA en la interpretación de instrucciones en lenguaje natural.

Esta prueba podría realizarse mediante una pantalla interna o endpoint controlado donde se envíe una instrucción en lenguaje natural y el sistema proponga una acción estructurada antes de ejecutarla.

Ejemplo:

```text
Registra 45 minutos de soporte en la tarea "Revisión DNS" del cliente X.
```

Salida propuesta:

```json
{
  "accion": "registrar_tiempo",
  "cliente": "Cliente X",
  "tarea": "Revisión DNS",
  "duracion_minutos": 45,
  "requiere_confirmacion": true
}
```

---

## 3. Integración con Holded

La integración con Holded se contempla como evolución futura para la consulta, generación o descarga de facturas.

El sistema no tendrá como objetivo inicial generar facturas internamente.

### 3.1. Opción futura: integración directa

Si técnicamente es viable, la plataforma podría conectarse con Holded para:

- Consultar facturas.
- Crear facturas.
- Descargar facturas.
- Asociar facturas a clientes o proyectos.
- Mostrar facturas en el área privada del cliente.

### 3.2. Opción inicial: gestión documental

En una primera versión, el sistema podrá trabajar con documentos de factura almacenados manualmente o enlazados desde el área del cliente.

Esto permitiría asociar facturas a clientes, proyectos o reportes sin asumir inicialmente la integración completa con Holded.

---

## 4. Integración con agentes IA externos

La plataforma podrá evolucionar hacia la integración con agentes IA externos capaces de recibir instrucciones desde canales como WhatsApp, email u otros medios y convertirlas en acciones dentro del SaaS.

Ejemplos de agentes o asistentes posibles:

- OpenClaw.
- Hermes.
- Asistentes personalizados.
- Bots internos.
- Automatizaciones conectadas a APIs.

### 4.1. Objetivo de la integración

Reducir la fricción de uso del sistema permitiendo que el usuario pueda registrar información o consultar datos sin entrar manualmente en la aplicación web.

Ejemplos de instrucciones:

- Añade 2 horas al cliente X en la tarea Y por revisión de incidencias.
- Crea una nueva tarea para el cliente X: revisar integración con Holded.
- Registra 45 minutos de soporte para el proyecto web del cliente Y.
- Genera un resumen semanal de las tareas realizadas para el cliente Z.
- Marca la tarea de configuración DNS como finalizada.

### 4.2. Posibles casos de uso

- Creación automática de tareas a partir de mensajes.
- Registro de tiempos mediante lenguaje natural.
- Actualización del estado de tareas.
- Generación de resúmenes de trabajo.
- Consulta de información de clientes o proyectos.
- Clasificación automática de tareas.
- Asignación sugerida de tarifas.
- Preparación de reportes para clientes.
- Recepción de instrucciones por WhatsApp o correo electrónico.

### 4.3. Motivo para dejarlo fuera del TFM

Esta funcionalidad no formará parte del alcance principal del MVP porque implica:

- Integraciones adicionales con canales externos.
- Gestión de credenciales y permisos.
- Procesamiento de lenguaje natural.
- Validación de acciones.
- Seguridad ante instrucciones ambiguas o maliciosas.
- Auditoría de operaciones.
- Gestión de errores y confirmaciones.

No obstante, se contempla como una línea futura muy relevante para el producto.

---

## 5. Integración con email

El email podría utilizarse en futuras fases para:

- Crear tareas a partir de correos.
- Asociar comunicaciones a clientes.
- Enviar reportes.
- Notificar cambios de estado.
- Recibir instrucciones procesables por IA.

Por ejemplo, un correo enviado a una dirección específica podría convertirse en una tarea pendiente de revisión.

---

## 6. Integración con WhatsApp

WhatsApp podría utilizarse como canal conversacional para:

- Registrar tareas.
- Registrar tiempos.
- Consultar estados.
- Recibir avisos.
- Enviar instrucciones rápidas al asistente IA.

Por su complejidad técnica, costes, limitaciones de plataforma y requisitos de seguridad, se considera fuera del alcance inicial del TFM.

---

## 7. Criterios de seguridad para integraciones

Cualquier integración externa deberá contemplar:

- Autenticación del origen.
- Validación de permisos del usuario.
- Confirmación antes de ejecutar acciones críticas.
- Registro de auditoría.
- Control de errores.
- Protección frente a instrucciones ambiguas o maliciosas.
- Trazabilidad de la acción realizada.
- Separación entre datos internos y datos visibles para cliente.

---

## 8. Enfoque recomendado

Para el TFM se recomienda implementar, como máximo, una prueba conceptual controlada de interpretación de instrucciones en lenguaje natural.

Las integraciones reales con Holded, WhatsApp, email o agentes externos deberán documentarse como evolución posterior del producto.
