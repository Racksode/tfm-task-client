# Reflexión sobre alcance, documentación y desarrollo asistido por IA

> Documento interno de trabajo.  
> Esta reflexión recoge uno de los principales aprendizajes del proyecto: el uso de IA acelera la definición, documentación y generación de ideas, pero también puede provocar sobrealcance, falsa sensación de avance y pérdida de control del proyecto.

## 1. Contexto

Durante la definición inicial del TFM se ha detectado un cambio importante respecto a la forma tradicional de plantear proyectos de desarrollo.

En proyectos anteriores, el alcance solía definirse de forma general al inicio y se iba desglosando, ajustando o ampliando a medida que avanzaba el desarrollo. La documentación era más reducida y el trabajo se orientaba a cerrar fases funcionales, entregar valor y, en un contexto profesional, facturar hitos o avances.

Con la asistencia de herramientas de inteligencia artificial, el proceso cambia de forma significativa. La IA permite generar rápidamente documentación, ideas, funcionalidades, propuestas de arquitectura, integraciones, casos de uso y posibles líneas de evolución. Esto tiene un valor evidente, pero también introduce nuevos riesgos.

## 2. Riesgo detectado

El principal riesgo identificado es caer en una trampa de sobredefinición y sobrealcance.

La IA hace que parezca muy barato:

- imaginar nuevas funcionalidades
- documentar módulos futuros
- proponer integraciones avanzadas
- definir arquitecturas completas
- describir automatizaciones complejas
- plantear productos SaaS más ambiciosos
- generar textos aparentemente profesionales

Sin embargo, que una funcionalidad sea fácil de describir no significa que sea barata de construir.

Cada funcionalidad real implica costes de:

- análisis
- diseño
- implementación
- pruebas
- seguridad
- documentación
- despliegue
- mantenimiento
- soporte
- corrección de errores
- evolución futura

Por este motivo, es necesario diferenciar entre lo que la IA ayuda a imaginar y lo que realmente puede desarrollarse de forma responsable dentro del alcance de un TFM.

## 3. Falsa sensación de avance

Una documentación extensa puede generar la sensación de que el proyecto está avanzando mucho, aunque todavía no exista un producto funcional.

La documentación es necesaria, pero no debe confundirse con avance real de producto.

El avance real del TFM se medirá por:

- decisiones cerradas
- alcance controlado
- funcionalidades implementadas
- pruebas realizadas
- documentación útil y actualizada
- capacidad de demostrar el MVP
- coherencia entre lo definido y lo construido

No se medirá por la cantidad de documentos generados ni por el número de funcionalidades imaginadas.

## 4. El problema de las funcionalidades "aparentemente baratas"

Con IA, funcionalidades que antes se habrían considerado grandes o complejas pueden parecer fáciles de incorporar.

Ejemplos:

- integración con Holded
- integración con WhatsApp
- integración con email
- agentes externos como OpenClaw o Hermes
- app móvil
- aplicación de escritorio
- multiempresa SaaS avanzado
- sistema completo de facturación
- automatizaciones avanzadas
- analítica avanzada
- módulos comerciales tipo CRM completo

Aunque la IA pueda ayudar a plantearlas o incluso generar una primera aproximación técnica, cada una de estas funcionalidades tiene implicaciones reales de coste, seguridad, mantenimiento y soporte.

Por tanto, deben tratarse como evolución futura salvo que exista una justificación clara para incluirlas en el MVP.

## 5. Separación entre TFM, producto futuro e investigación

Para mantener el control del proyecto, se establece una separación clara entre tres niveles.

### 5.1. TFM

Incluye únicamente el MVP que se va a construir, probar y defender.

Debe ser limitado, funcional y coherente.

### 5.2. Producto SaaS futuro

Incluye funcionalidades que podrían tener sentido comercial más adelante, pero que no forman parte del alcance principal del TFM.

Estas ideas se documentan como visión de producto o roadmap futuro.

### 5.3. Experimentación con IA

Incluye pruebas, herramientas, agentes, automatizaciones, comparativas y aprendizajes relacionados con el desarrollo asistido por IA.

Estas pruebas pueden aportar valor académico, pero no deben confundirse con funcionalidades obligatorias del producto.

## 6. Fuente de verdad del proyecto

El chat con IA sirve para pensar, explorar y contrastar ideas, pero no debe ser la fuente de verdad del proyecto.

La fuente de verdad será el repositorio.

Se considerará decisión válida únicamente aquello que esté documentado en los ficheros principales del proyecto, especialmente:

- `README.md`
- `docs/00-vision-y-alcance.md`
- `docs/01-requisitos-funcionales.md`
- `docs/09-plan-trabajo-y-control-alcance.md`
- `AGENTS.md`

Cualquier idea surgida en una conversación con IA deberá clasificarse y documentarse antes de considerarse parte del proyecto.

## 7. Regla de incorporación de funcionalidades

Ninguna funcionalidad entra en el MVP solo porque:

- la IA la haya propuesto
- sea técnicamente posible
- parezca sencilla en una descripción
- aporte una visión comercial atractiva
- pueda generarse código rápidamente

Antes de incorporarla, deberá responderse a las siguientes preguntas:

1. ¿Es imprescindible para defender el TFM?
2. ¿Aporta valor directo al MVP?
3. ¿Cuál es su coste de implementación?
4. ¿Cuál será su coste de mantenimiento?
5. ¿Introduce riesgos de seguridad o complejidad?
6. ¿Puede aplazarse sin afectar al objetivo académico?
7. ¿Pertenece al TFM, al SaaS futuro o a una línea de experimentación?

Si no es imprescindible para el MVP, se documentará como línea futura.

## 8. Evaluación económica de funcionalidades

En un proyecto real para un cliente, cada funcionalidad debería valorarse también desde una perspectiva económica.

La IA puede reducir ciertos tiempos de desarrollo, pero no elimina el coste real del proyecto.

Cada funcionalidad debería poder evaluarse según:

- esfuerzo de análisis
- esfuerzo de desarrollo
- esfuerzo de pruebas
- coste de mantenimiento
- dependencia de terceros
- riesgo técnico
- valor aportado al usuario
- precio que justificaría en un proyecto real
- posibilidad de convertirla en módulo premium en un SaaS

Ejemplo:

| Funcionalidad | TFM | SaaS futuro | Coste | Observación |
|---|---|---|---|---|
| Gestión de clientes | Sí | Sí | Medio | Núcleo del sistema |
| Gestión de tareas | Sí | Sí | Medio | Núcleo operativo |
| Start/Stop de tiempos | Sí | Sí | Medio | Funcionalidad diferencial |
| Resumen IA de reportes | Sí | Sí | Medio | Valor académico y funcional |
| Integración Holded real | No | Sí | Alto | Integración externa compleja |
| WhatsApp real | No | Sí | Alto | Requiere seguridad, permisos y canal externo |
| Agentes IA externos | No | Sí | Alto | Interesante como evolución, no como MVP |
| App móvil nativa | No | Sí | Alto | Fuera del alcance inicial |

## 9. Reglas prácticas a partir de esta reflexión

A partir de este punto, el proyecto aplicará las siguientes reglas:

- El MVP queda congelado salvo decisión explícita.
- No se crearán documentos nuevos sin necesidad clara.
- La documentación debe ayudar a construir o defender el TFM.
- Las ideas futuras se documentarán como futuras, no como compromisos.
- El chat con IA no será fuente de verdad.
- Los agentes del IDE no podrán ampliar alcance sin aprobación.
- Toda funcionalidad nueva deberá clasificarse.
- Se priorizará cerrar requisitos funcionales antes de seguir ampliando documentación.
- El valor real se medirá por avance verificable, no por volumen de texto.
- La IA se usará para acelerar, pero no para perder el control.

## 10. Conclusión

Esta reflexión forma parte del aprendizaje central del proyecto.

El desarrollo asistido por IA no consiste en hacer proyectos cada vez más grandes porque ahora sea más fácil generar documentación o código. Consiste en utilizar la IA para trabajar mejor, decidir mejor, documentar mejor y construir con mayor control.

El objetivo del TFM no es demostrar que se puede imaginar un SaaS enorme, sino construir un MVP coherente, útil, limitado y defendible, aplicando IA de forma responsable durante el proceso.
