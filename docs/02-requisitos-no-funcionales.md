# Requisitos no funcionales

> Documento de requisitos no funcionales del MVP del TFM.
> Define criterios de seguridad, privacidad, calidad, mantenibilidad, accesibilidad, usabilidad y rendimiento razonable sin ampliar el alcance del MVP.

## 1. Introducción

Este documento recoge los requisitos no funcionales del MVP del Trabajo Final de Máster.

Su objetivo es definir las condiciones de calidad que debe cumplir la aplicación, más alla de las funcionalidades descritas en `docs/01-requisitos-funcionales.md`.

El documento se centra en un MVP académico, funcional y defendible. No pretende definir una plataforma SaaS comercial completa ni sustituir a los documentos técnicos posteriores, como `docs/03-modelo-datos.md`, `docs/04-arquitectura.md`, `docs/07-plan-pruebas.md` o `docs/08-despliegue.md`.

Las decisiones concretas de arquitectura, stack tecnológico, base de datos, proveedor de autenticación, proveedor de IA, ORM, infraestructura o despliegue se documentarán posteriormente en `docs/04-arquitectura.md` y, cuando proceda, en ADRs.

## 2. Criterios generales del MVP

El sistema debe priorizar:

- seguridad desde el diseño
- privacidad de la información de clientes
- claridad funcional
- mantenibilidad
- validación de datos
- experiencia de uso sencilla
- comportamiento predecible
- rendimiento razonable para un volumen limitado
- control humano sobre los resultados generados por IA

El objetivo no es alcanzar una solucion empresarial certificada, sino aplicar buenas prácticas coherentes con el alcance del TFM.

Los requisitos no funcionales deben ayudar a construir un MVP pequeño, completo y defendible, sin introducir complejidad propia de una plataforma SaaS avanzada.

## 3. Seguridad desde el diseño

La seguridad debe considerarse desde el diseño inicial del sistema, no como una revisión final.

### RNF-01. Autenticación obligatoria en zonas privadas

Las zonas privadas de la aplicación deben requerir autenticación.

El sistema debe diferenciar, como mínimo, entre usuario interno y cliente, de acuerdo con los requisitos funcionales del MVP.

### RNF-02. Control básico de acceso

El cliente solo debe poder acceder a información asociada a el y marcada como visible.

El usuario interno podrá gestionar la información operativa del sistema, dentro del alcance del MVP.

No se implementara un sistema avanzado de permisos durante el TFM, salvo decisión posterior documentada.

### RNF-03. Principio de mínimo privilegio

Cada usuario debe disponer solo del acceso necesario para su rol dentro del MVP.

El sistema debe evitar exponer información interna a usuarios cliente, especialmente:

- observaciones internas
- tareas no visibles
- reportes no compartidos
- datos de otros clientes
- información técnica o administrativa no destinada al cliente

### RNF-04. Validación de entradas

El sistema debe validar los datos introducidos por el usuario antes de procesarlos o almacenarlos.

La validación debe aplicarse especialmente en:

- formularios de clientes
- formularios de proyectos
- formularios de tareas
- registros de tiempo
- filtros de reportes
- instrucciones de lenguaje natural para IA

### RNF-05. Gestión segura de sesiones y credenciales

Las credenciales, claves de API y secretos de configuración no deben almacenarse directamente en el código fuente.

La gestión concreta de sesiones, autenticación y secretos se definirá en la fase de arquitectura, pero el requisito mínimo es evitar prácticas inseguras evidentes.

### RNF-06. No ejecucion autónoma por IA

La IA no debe ejecutar acciones reales de forma autónoma.

Las funcionalidades basadas en IA podrán proponer textos o estructuras, pero el usuario interno deberá revisar los resultados antes de utilizarlos en reportes o procesos del sistema.

## 4. OWASP Top Ten aplicado al MVP

El MVP debe tener en cuenta OWASP Top Ten como guia práctica de riesgos frecuentes en aplicaciones web.

No se plantea una auditoría avanzada de seguridad, sino una aplicación razonable de buenas prácticas.

### RNF-07. Control de acceso roto

El sistema debe evitar accesos cruzados entre clientes.

Un cliente no debe poder consultar tareas, proyectos, reportes o datos asociados a otro cliente.

### RNF-08. Fallos criptográficos

El sistema no debe almacenar contraseñas, tokens o secretos en claro.

Las decisiones concretas sobre cifrado, hashing o gestión de secretos se definirán durante la arquitectura.

### RNF-09. Inyección

El sistema debe evitar la construccion insegura de consultas o comandos a partir de entradas de usuario.

La estrategia técnica concreta se decidirá posteriormente, pero el requisito funcional de seguridad es que las entradas no puedan alterar consultas, filtros o acciones internas de forma no autorizada.

### RNF-10. Diseño inseguro

Las reglas críticas deben estar contempladas desde el diseño:

- separacion entre usuario interno y cliente
- visibilidad explícita de tareas y reportes
- prevencion de solapamientos de tareas activas
- revisión humana de resultados generados por IA
- no ejecucion automática de instrucciones en lenguaje natural

### RNF-11. Configuración insegura

El sistema debe evitar configuraciones inseguras evidentes, como:

- secretos incluidos en el repositorio
- mensajes de error con información interna sensible
- entornos de produccion con configuraciones de desarrollo
- permisos excesivos por defecto

La configuración concreta se documentará en la fase de arquitectura y despliegue.

### RNF-12. Componentes vulnerables

Durante la implementación se deberán revisar de forma básica las dependencias utilizadas.

No se incorporaran librerias innecesarias solo por conveniencia si aumentan el mantenimiento o la superficie de riesgo.

### RNF-13. Fallos de identificación y autenticación

El sistema debe proteger el acceso a cuentas de usuario y evitar accesos no autenticados a zonas privadas.

La política concreta de contraseñas, sesiones o proveedores se definirá posteriormente.

### RNF-14. Fallos de integridad de datos

Los datos relevantes del MVP deben conservar coherencia funcional.

Esto aplica especialmente a:

- registros de tiempo
- tareas activas
- reportes generados
- costes estimados
- textos generados o propuestos por IA

### RNF-15. Logging y monitorizacion insuficientes

El MVP debe permitir identificar errores relevantes durante el desarrollo, pruebas y demo.

No se requiere una plataforma avanzada de monitorizacion, pero si un tratamiento mínimo de errores que facilite detectar problemas sin exponer información sensible al usuario.

### RNF-16. SSRF y llamadas externas

El sistema debe evitar llamadas externas no controladas.

Este punto es especialmente importante para futuras integraciones con APIs externas, canales conversacionales o agentes, qué quedan fuera del MVP salvo la funcionalidad IA acotada y controlada.

## 5. Privacidad y protección de datos

El MVP debe aplicar buenas prácticas básicas de privacidad inspiradas en RGPD.

Esto no significa que el MVP sea una solucion legalmente certificada ni que sustituya una revisión jur?dica. El objetivo es demostrar un tratamiento prudente y justificado de los datos dentro del alcance académico.

### RNF-17. Minimización de datos

El sistema debe recoger solo los datos necesarios para demostrar el funcionamiento del MVP.

No se deben solicitar datos personales o empresariales que no aporten valor al flujo principal del TFM.

### RNF-18. Separacion de información interna y visible

La información interna del usuario profesional no debe mostrarse al cliente salvo que este marcada explícitamente como visible o forme parte de un reporte generado para el.

### RNF-19. Tratamiento prudente de datos enviados a IA

Las funcionalidades de IA deben enviar solo la información necesaria para generar el resultado esperado.

Debe evitarse incluir datos personales, confidenciales o irrelevantes cuando no sean necesarios para el resumen o la interpretacion solicitada.

### RNF-20. Transparencia funcional sobre IA

El usuario interno debe entender que la IA actua como apoyo.

Los textos generados por IA no sustituyen a la información real registrada en el sistema ni deben considerarse fuente de verdad.

## 6. Trazabilidad mínima

El MVP debe incluir trazabilidad mínima para acciones relevantes.

Esta trazabilidad no equivale a una auditoría avanzada ni a un sistema completo de cumplimiento normativo. Su objetivo es permitir comprender que acciones importantes han ocurrido durante el uso del sistema y facilitar la revisión durante pruebas, demo o depuración.

### RNF-21. Acciones trazables

Como mínimo, deberán poder identificarse acciones relevantes como:

- creación y modificación de tareas
- creación de registros de tiempo
- inicio y parada de tareas mediante start/stop
- generación de reportes
- uso de funcionalidades de IA
- generación o revisión de textos asistidos por IA

### RNF-22. Información mínima de trazabilidad

Cuando se registre una acción relevante, la información mínima recomendable será:

- tipo de acción
- usuario que la realiza, cuando aplique
- fecha y hora
- entidad afectada
- resultado básico de la acción

El detalle técnico concreto se decidirá durante el diseño de modelo de datos y arquitectura.

## 7. Mantenibilidad

El código del MVP debe ser sencillo, legible y fácil de justificar en la defensa del TFM.

### RNF-23. Simplicidad de implementación

La solucion debe evitar sobrediseno, abstracciones prematuras y patrones complejos que no sean necesarios para el MVP.

Debe priorizarse una estructura clara frente a una arquitectura preparada para una escala comercial futura.

### RNF-24. Separacion de responsabilidades

La implementación debe separar, en la medida razonable, las responsabilidades principales:

- interfaz de usuario
- validación
- reglas de negocio
- acceso a datos
- integración con IA

La forma concreta de organizar el código se definirá en la arquitectura.

### RNF-25. Documentación de decisiones relevantes

Las decisiones que afecten a alcance, seguridad, arquitectura, IA o privacidad deberán quedar reflejadas en la documentación del repositorio.

El chat con IA no será fuente de verdad del proyecto.

## 8. Testing y control de calidad

El MVP debe contar con pruebas suficientes para validar las partes críticas del sistema.

No se busca una cobertura exhaustiva, sino asegurar que los flujos principales del TFM funcionan de forma fiable.

### RNF-26. Pruebas unitarias

Se deberán priorizar pruebas unitarias sobre lógica crítica, especialmente:

- cálculo de horas
- cálculo de costes estimados
- validación de registros de tiempo
- prevencion de solapamientos
- reglas de visibilidad

### RNF-27. Pruebas de integración

Se deberán contemplar pruebas de integración para validar flujos relevantes entre varias partes del sistema.

Casos prioritarios:

- creación de cliente, proyecto y tarea
- registro manual de tiempo
- inicio y parada de tarea
- generación de reporte
- acceso de cliente solo a información visible
- generación de resumen IA revisable

### RNF-28. Pruebas E2E recomendables

Las pruebas de extremo a extremo serán recomendables si el tiempo del TFM lo permite.

No se consideran obligatorias para cerrar el MVP, pero aportarian valor para validar la demo principal.

### RNF-29. Revisión manual de calidad

Antes de la defensa, se deberá realizar una revisión manual del flujo principal:

1. acceso como usuario interno
2. gestión de cliente, proyecto y tarea
3. registro manual de tiempo
4. uso de start/stop
5. comprobacion de no solapamiento
6. generación de reporte
7. generación o revisión de resumen IA
8. acceso como cliente a información visible

## 9. Accesibilidad

El MVP debe aplicar buenas prácticas básicas de accesibilidad.

No se plantea una certificacion completa WCAG, pero si una interfaz razonablemente accesible.

### RNF-30. Semántica y navegación

La interfaz debe usar estructuras comprensibles y permitir una navegación básica clara.

Siempre que sea posible, los formularios, botones, enlaces y mensajes deben ser identificables y coherentes.

### RNF-31. Contraste y legibilidad

Los textos principales deben tener contraste suficiente y ser legibles en los dispositivos previstos.

Debe evitarse depender exclusivamente del color para transmitir estados importantes.

### RNF-32. Formularios comprensibles

Los formularios deben incluir etiquetas claras, validaciones comprensibles y mensajes de error ?tiles para el usuario.

## 10. Usabilidad

La aplicación debe ser fácil de entender para el usuario interno y para el cliente.

### RNF-33. Flujos principales simples

Los flujos principales deben requerir el menor numero razonable de pasos:

- crear cliente
- crear proyecto
- crear tarea
- registrar tiempo
- iniciar o detener tarea
- generar reporte
- consultar información como cliente

### RNF-34. Interfaz no sobrecargada

El MVP debe evitar pantallas excesivamente densas o funcionalidades secundarias que distraigan del flujo principal.

La interfaz debe reflejar el alcance real del TFM, no la visión completa del SaaS futuro.

### RNF-35. Mensajes claros

Los mensajes de validación, error y confirmacion deben ser comprensibles para usuarios no técnicos.

No se deben mostrar trazas internas ni detalles técnicos innecesarios en pantalla.

## 11. Rendimiento razonable

El MVP debe ofrecer un rendimiento adecuado para un volumen limitado de datos, propio de una demo académica y un uso inicial controlado.

No se optimizara prematuramente para una escala SaaS avanzada.

### RNF-36. Respuesta adecuada en flujos principales

Las operaciones principales deben responder en tiempos razonables para el usuario:

- carga de listados principales
- consulta de tareas
- registro de tiempos
- generación de reportes
- acceso al área de cliente

### RNF-37. Evitar cargas innecesarias

El sistema debe evitar cargar datos que no sean necesarios para la pantalla o acción actual, especialmente en vistas de cliente y reportes.

### RNF-38. Escalabilidad fuera del alcance inicial

La escalabilidad avanzada, multiempresa SaaS, balanceo de carga, alta disponibilidad y optimizaciones complejas quedan fuera del MVP.

Podrán considerarse líneas futuras del producto SaaS.

## 12. Disponibilidad, errores y modo degradado

El sistema debe comportarse de forma controlada ante errores.

### RNF-39. Manejo claro de errores

Los errores de validación, permisos, autenticación o acciones no permitidas deben comunicarse de forma clara.

El sistema no debe exponer información interna sensible en mensajes de error.

### RNF-40. Modo degradado para IA

La aplicación debe seguir siendo usable aunque la funcionalidad de IA no este disponible.

Si falla el proveedor de IA, la conexión, la configuración o la generación del texto, el usuario debe poder continuar con el flujo principal mediante redacción manual o sin resumen generado automáticamente.

La indisponibilidad de IA no debe impedir:

- gestionar clientes
- gestionar proyectos
- gestionar tareas
- registrar tiempos
- usar start/stop
- generar reportes básicos sin resumen asistido
- consultar el área de cliente

### RNF-41. Recuperacion ante fallos no críticos

Los fallos no críticos deben permitir continuar trabajando siempre que sea posible.

La perdida de una funcionalidad auxiliar no debe bloquear el núcleo del MVP.

## 13. IA responsable y controlada

La IA forma parte del MVP, pero debe estar limitada a funciones concretas, revisables y justificadas.

### RNF-42. IA como apoyo, no como fuente de verdad

La IA puede ayudar a generar textos profesionales o interpretar instrucciones en lenguaje natural, pero la fuente de verdad son los datos registrados en el sistema.

### RNF-43. Revisión humana

El usuario interno debe poder revisar los resultados generados por IA antes de usarlos en reportes o propuestas estructuradas.

### RNF-44. Sin decisiones autónomas

La IA no debe tomar decisiones autónomas sobre cambios en el sistema.

La prueba conceptual de lenguaje natural debe devolver una propuesta estructurada o revisable, no ejecutar acciones reales de forma automática.

### RNF-45. Limitacion de contexto

Las llamadas a IA deben limitar el contexto enviado a la información necesaria para la tarea solicitada.

Este requisito contribuye a reducir riesgos de privacidad, coste y dependencia externa.

## 14. Clasificación de requisitos no funcionales

| Requisito | Clasificación | Entra en TFM | Motivo | Evolución futura |
|---|---|---|---|---|
| Autenticación en zonas privadas | Imprescindible para el MVP | Sí | Permite proteger información interna y de cliente. | Politicas avanzadas de autenticación. |
| Control básico de acceso | Imprescindible para el MVP | Sí | Evita accesos cruzados entre clientes. | Matriz avanzada de permisos. |
| Validación de entradas | Imprescindible para el MVP | Sí | Reduce errores y riesgos de seguridad. | Validaciones configurables o reglas avanzadas. |
| Seguridad inspirada en OWASP Top Ten | Imprescindible para el MVP | Sí | Aporta rigor técnico defendible. | Auditorias externas y hardening avanzado. |
| Privacidad básica inspirada en RGPD | Imprescindible para el MVP | Sí | Promueve tratamiento prudente de datos. | Revisión legal y cumplimiento formal. |
| Trazabilidad mínima | Imprescindible para el MVP | Sí | Facilita revisión y depuración de acciones relevantes. | Auditoría avanzada y cumplimiento normativo. |
| Mantenibilidad | Imprescindible para el MVP | Sí | Facilita implementar, explicar y evolucionar el proyecto. | Arquitectura preparada para escala SaaS. |
| Pruebas unitarias críticas | Imprescindible para el MVP | Sí | Protegen reglas relevantes del sistema. | Cobertura amplia y automatizacion completa. |
| Pruebas de integración | Imprescindible para el MVP | Sí | Validan flujos principales. | Pipelines completos de calidad. |
| Pruebas E2E | Recomendable pero aplazable | No obligatorio | Aportan valor a la demo, pero pueden aplazarse. | Suite E2E completa. |
| Accesibilidad básica | Imprescindible para el MVP | Sí | Mejora usabilidad y calidad general. | Certificacion WCAG formal. |
| Rendimiento razonable | Imprescindible para el MVP | Sí | Evita una experiencia lenta en la demo. | Optimizacion para escala real. |
| Alta disponibilidad | Línea futura del producto SaaS | No | No es necesaria para validar el MVP académico. | Infraestructura tolerante a fallos. |
| Monitorizacion avanzada | Línea futura del producto SaaS | No | Excede el alcance del TFM. | Observabilidad completa. |
| Auditoría avanzada | Línea futura del producto SaaS | No | Excede la trazabilidad mínima necesaria. | Auditoría legal y trazas completas. |
| Cumplimiento legal certificado | Línea futura del producto SaaS | No | Requiere revisión jur?dica espec?fica. | Adecuaci?n legal completa del SaaS. |

## 15. Criterios de aceptación no funcional

El MVP se considerara aceptable desde el punto de vista no funcional si permite demostrar que:

1. Las zonas privadas requieren autenticación.
2. El cliente solo accede a información asociada a el y marcada como visible.
3. Los formularios principales validan entradas relevantes.
4. Los secretos y credenciales no se almacenan directamente en el código fuente.
5. Las reglas críticas de tiempos, visibilidad y reportes se pueden probar.
6. La IA genera resultados revisables y no ejecuta acciones automáticamente.
7. El sistema sigue siendo usable aunque la IA no este disponible.
8. Existe trazabilidad mínima de acciones relevantes.
9. La interfaz resulta comprensible para los flujos principales del MVP.
10. Los errores se comunican sin exponer información interna sensible.
11. El rendimiento es razonable para una demo académica y un uso controlado.
12. Las funcionalidades avanzadas propias del SaaS futuro no se incorporan como requisitos obligatorios del TFM.

## 16. Conclusión

Los requisitos no funcionales del MVP buscan asegurar que el proyecto sea seguro, mantenible, usable y defendible dentro del alcance de un Trabajo Final de Máster.

El criterio principal es aplicar buenas prácticas proporcionadas al contexto académico, evitando tanto la falta de rigor como el sobrediseno.

El MVP debe demostrar que el núcleo funcional puede construirse con calidad suficiente, control de seguridad básico, privacidad razonable, pruebas sobre partes críticas y uso responsable de IA, sin intentar convertirse todavía en un SaaS comercial completo.
