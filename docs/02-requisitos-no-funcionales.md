# Requisitos no funcionales

> Documento de requisitos no funcionales del MVP del TFM.
> Define criterios de seguridad, privacidad, calidad, mantenibilidad, accesibilidad, usabilidad y rendimiento razonable sin ampliar el alcance del MVP.

## 1. Introduccion

Este documento recoge los requisitos no funcionales del MVP del Trabajo Final de Master.

Su objetivo es definir las condiciones de calidad que debe cumplir la aplicacion, mas alla de las funcionalidades descritas en `docs/01-requisitos-funcionales.md`.

El documento se centra en un MVP academico, funcional y defendible. No pretende definir una plataforma SaaS comercial completa ni sustituir a los documentos tecnicos posteriores, como `docs/03-modelo-datos.md`, `docs/04-arquitectura.md`, `docs/07-plan-pruebas.md` o `docs/08-despliegue.md`.

Las decisiones concretas de arquitectura, stack tecnologico, base de datos, proveedor de autenticacion, proveedor de IA, ORM, infraestructura o despliegue se documentaran posteriormente en `docs/04-arquitectura.md` y, cuando proceda, en ADRs.

## 2. Criterios generales del MVP

El sistema debe priorizar:

- seguridad desde el diseno
- privacidad de la informacion de clientes
- claridad funcional
- mantenibilidad
- validacion de datos
- experiencia de uso sencilla
- comportamiento predecible
- rendimiento razonable para un volumen limitado
- control humano sobre los resultados generados por IA

El objetivo no es alcanzar una solucion empresarial certificada, sino aplicar buenas practicas coherentes con el alcance del TFM.

Los requisitos no funcionales deben ayudar a construir un MVP pequeno, completo y defendible, sin introducir complejidad propia de una plataforma SaaS avanzada.

## 3. Seguridad desde el diseno

La seguridad debe considerarse desde el diseno inicial del sistema, no como una revision final.

### RNF-01. Autenticacion obligatoria en zonas privadas

Las zonas privadas de la aplicacion deben requerir autenticacion.

El sistema debe diferenciar, como minimo, entre usuario interno y cliente, de acuerdo con los requisitos funcionales del MVP.

### RNF-02. Control basico de acceso

El cliente solo debe poder acceder a informacion asociada a el y marcada como visible.

El usuario interno podra gestionar la informacion operativa del sistema, dentro del alcance del MVP.

No se implementara un sistema avanzado de permisos durante el TFM, salvo decision posterior documentada.

### RNF-03. Principio de minimo privilegio

Cada usuario debe disponer solo del acceso necesario para su rol dentro del MVP.

El sistema debe evitar exponer informacion interna a usuarios cliente, especialmente:

- observaciones internas
- tareas no visibles
- reportes no compartidos
- datos de otros clientes
- informacion tecnica o administrativa no destinada al cliente

### RNF-04. Validacion de entradas

El sistema debe validar los datos introducidos por el usuario antes de procesarlos o almacenarlos.

La validacion debe aplicarse especialmente en:

- formularios de clientes
- formularios de proyectos
- formularios de tareas
- registros de tiempo
- filtros de reportes
- instrucciones de lenguaje natural para IA

### RNF-05. Gestion segura de sesiones y credenciales

Las credenciales, claves de API y secretos de configuracion no deben almacenarse directamente en el codigo fuente.

La gestion concreta de sesiones, autenticacion y secretos se definira en la fase de arquitectura, pero el requisito minimo es evitar practicas inseguras evidentes.

### RNF-06. No ejecucion autonoma por IA

La IA no debe ejecutar acciones reales de forma autonoma.

Las funcionalidades basadas en IA podran proponer textos o estructuras, pero el usuario interno debera revisar los resultados antes de utilizarlos en reportes o procesos del sistema.

## 4. OWASP Top Ten aplicado al MVP

El MVP debe tener en cuenta OWASP Top Ten como guia practica de riesgos frecuentes en aplicaciones web.

No se plantea una auditoria avanzada de seguridad, sino una aplicacion razonable de buenas practicas.

### RNF-07. Control de acceso roto

El sistema debe evitar accesos cruzados entre clientes.

Un cliente no debe poder consultar tareas, proyectos, reportes o datos asociados a otro cliente.

### RNF-08. Fallos criptograficos

El sistema no debe almacenar contrasenas, tokens o secretos en claro.

Las decisiones concretas sobre cifrado, hashing o gestion de secretos se definiran durante la arquitectura.

### RNF-09. Inyeccion

El sistema debe evitar la construccion insegura de consultas o comandos a partir de entradas de usuario.

La estrategia tecnica concreta se decidira posteriormente, pero el requisito funcional de seguridad es que las entradas no puedan alterar consultas, filtros o acciones internas de forma no autorizada.

### RNF-10. Diseño inseguro

Las reglas criticas deben estar contempladas desde el diseno:

- separacion entre usuario interno y cliente
- visibilidad explicita de tareas y reportes
- prevencion de solapamientos de tareas activas
- revision humana de resultados generados por IA
- no ejecucion automatica de instrucciones en lenguaje natural

### RNF-11. Configuracion insegura

El sistema debe evitar configuraciones inseguras evidentes, como:

- secretos incluidos en el repositorio
- mensajes de error con informacion interna sensible
- entornos de produccion con configuraciones de desarrollo
- permisos excesivos por defecto

La configuracion concreta se documentara en la fase de arquitectura y despliegue.

### RNF-12. Componentes vulnerables

Durante la implementacion se deberan revisar de forma basica las dependencias utilizadas.

No se incorporaran librerias innecesarias solo por conveniencia si aumentan el mantenimiento o la superficie de riesgo.

### RNF-13. Fallos de identificacion y autenticacion

El sistema debe proteger el acceso a cuentas de usuario y evitar accesos no autenticados a zonas privadas.

La politica concreta de contrasenas, sesiones o proveedores se definira posteriormente.

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

No se requiere una plataforma avanzada de monitorizacion, pero si un tratamiento minimo de errores que facilite detectar problemas sin exponer informacion sensible al usuario.

### RNF-16. SSRF y llamadas externas

El sistema debe evitar llamadas externas no controladas.

Este punto es especialmente importante para futuras integraciones con APIs externas, canales conversacionales o agentes, que quedan fuera del MVP salvo la funcionalidad IA acotada y controlada.

## 5. Privacidad y proteccion de datos

El MVP debe aplicar buenas practicas basicas de privacidad inspiradas en RGPD.

Esto no significa que el MVP sea una solucion legalmente certificada ni que sustituya una revision juridica. El objetivo es demostrar un tratamiento prudente y justificado de los datos dentro del alcance academico.

### RNF-17. Minimizacion de datos

El sistema debe recoger solo los datos necesarios para demostrar el funcionamiento del MVP.

No se deben solicitar datos personales o empresariales que no aporten valor al flujo principal del TFM.

### RNF-18. Separacion de informacion interna y visible

La informacion interna del usuario profesional no debe mostrarse al cliente salvo que este marcada explicitamente como visible o forme parte de un reporte generado para el.

### RNF-19. Tratamiento prudente de datos enviados a IA

Las funcionalidades de IA deben enviar solo la informacion necesaria para generar el resultado esperado.

Debe evitarse incluir datos personales, confidenciales o irrelevantes cuando no sean necesarios para el resumen o la interpretacion solicitada.

### RNF-20. Transparencia funcional sobre IA

El usuario interno debe entender que la IA actua como apoyo.

Los textos generados por IA no sustituyen a la informacion real registrada en el sistema ni deben considerarse fuente de verdad.

## 6. Trazabilidad minima

El MVP debe incluir trazabilidad minima para acciones relevantes.

Esta trazabilidad no equivale a una auditoria avanzada ni a un sistema completo de cumplimiento normativo. Su objetivo es permitir comprender que acciones importantes han ocurrido durante el uso del sistema y facilitar la revision durante pruebas, demo o depuracion.

### RNF-21. Acciones trazables

Como minimo, deberan poder identificarse acciones relevantes como:

- creacion y modificacion de tareas
- creacion de registros de tiempo
- inicio y parada de tareas mediante start/stop
- generacion de reportes
- uso de funcionalidades de IA
- generacion o revision de textos asistidos por IA

### RNF-22. Informacion minima de trazabilidad

Cuando se registre una accion relevante, la informacion minima recomendable sera:

- tipo de accion
- usuario que la realiza, cuando aplique
- fecha y hora
- entidad afectada
- resultado basico de la accion

El detalle tecnico concreto se decidira durante el diseno de modelo de datos y arquitectura.

## 7. Mantenibilidad

El codigo del MVP debe ser sencillo, legible y facil de justificar en la defensa del TFM.

### RNF-23. Simplicidad de implementacion

La solucion debe evitar sobrediseno, abstracciones prematuras y patrones complejos que no sean necesarios para el MVP.

Debe priorizarse una estructura clara frente a una arquitectura preparada para una escala comercial futura.

### RNF-24. Separacion de responsabilidades

La implementacion debe separar, en la medida razonable, las responsabilidades principales:

- interfaz de usuario
- validacion
- reglas de negocio
- acceso a datos
- integracion con IA

La forma concreta de organizar el codigo se definira en la arquitectura.

### RNF-25. Documentacion de decisiones relevantes

Las decisiones que afecten a alcance, seguridad, arquitectura, IA o privacidad deberan quedar reflejadas en la documentacion del repositorio.

El chat con IA no sera fuente de verdad del proyecto.

## 8. Testing y control de calidad

El MVP debe contar con pruebas suficientes para validar las partes criticas del sistema.

No se busca una cobertura exhaustiva, sino asegurar que los flujos principales del TFM funcionan de forma fiable.

### RNF-26. Pruebas unitarias

Se deberan priorizar pruebas unitarias sobre logica critica, especialmente:

- calculo de horas
- calculo de costes estimados
- validacion de registros de tiempo
- prevencion de solapamientos
- reglas de visibilidad

### RNF-27. Pruebas de integracion

Se deberan contemplar pruebas de integracion para validar flujos relevantes entre varias partes del sistema.

Casos prioritarios:

- creacion de cliente, proyecto y tarea
- registro manual de tiempo
- inicio y parada de tarea
- generacion de reporte
- acceso de cliente solo a informacion visible
- generacion de resumen IA revisable

### RNF-28. Pruebas E2E recomendables

Las pruebas de extremo a extremo seran recomendables si el tiempo del TFM lo permite.

No se consideran obligatorias para cerrar el MVP, pero aportarian valor para validar la demo principal.

### RNF-29. Revision manual de calidad

Antes de la defensa, se debera realizar una revision manual del flujo principal:

1. acceso como usuario interno
2. gestion de cliente, proyecto y tarea
3. registro manual de tiempo
4. uso de start/stop
5. comprobacion de no solapamiento
6. generacion de reporte
7. generacion o revision de resumen IA
8. acceso como cliente a informacion visible

## 9. Accesibilidad

El MVP debe aplicar buenas practicas basicas de accesibilidad.

No se plantea una certificacion completa WCAG, pero si una interfaz razonablemente accesible.

### RNF-30. Semantica y navegacion

La interfaz debe usar estructuras comprensibles y permitir una navegacion basica clara.

Siempre que sea posible, los formularios, botones, enlaces y mensajes deben ser identificables y coherentes.

### RNF-31. Contraste y legibilidad

Los textos principales deben tener contraste suficiente y ser legibles en los dispositivos previstos.

Debe evitarse depender exclusivamente del color para transmitir estados importantes.

### RNF-32. Formularios comprensibles

Los formularios deben incluir etiquetas claras, validaciones comprensibles y mensajes de error utiles para el usuario.

## 10. Usabilidad

La aplicacion debe ser facil de entender para el usuario interno y para el cliente.

### RNF-33. Flujos principales simples

Los flujos principales deben requerir el menor numero razonable de pasos:

- crear cliente
- crear proyecto
- crear tarea
- registrar tiempo
- iniciar o detener tarea
- generar reporte
- consultar informacion como cliente

### RNF-34. Interfaz no sobrecargada

El MVP debe evitar pantallas excesivamente densas o funcionalidades secundarias que distraigan del flujo principal.

La interfaz debe reflejar el alcance real del TFM, no la vision completa del SaaS futuro.

### RNF-35. Mensajes claros

Los mensajes de validacion, error y confirmacion deben ser comprensibles para usuarios no tecnicos.

No se deben mostrar trazas internas ni detalles tecnicos innecesarios en pantalla.

## 11. Rendimiento razonable

El MVP debe ofrecer un rendimiento adecuado para un volumen limitado de datos, propio de una demo academica y un uso inicial controlado.

No se optimizara prematuramente para una escala SaaS avanzada.

### RNF-36. Respuesta adecuada en flujos principales

Las operaciones principales deben responder en tiempos razonables para el usuario:

- carga de listados principales
- consulta de tareas
- registro de tiempos
- generacion de reportes
- acceso al area de cliente

### RNF-37. Evitar cargas innecesarias

El sistema debe evitar cargar datos que no sean necesarios para la pantalla o accion actual, especialmente en vistas de cliente y reportes.

### RNF-38. Escalabilidad fuera del alcance inicial

La escalabilidad avanzada, multiempresa SaaS, balanceo de carga, alta disponibilidad y optimizaciones complejas quedan fuera del MVP.

Podran considerarse lineas futuras del producto SaaS.

## 12. Disponibilidad, errores y modo degradado

El sistema debe comportarse de forma controlada ante errores.

### RNF-39. Manejo claro de errores

Los errores de validacion, permisos, autenticacion o acciones no permitidas deben comunicarse de forma clara.

El sistema no debe exponer informacion interna sensible en mensajes de error.

### RNF-40. Modo degradado para IA

La aplicacion debe seguir siendo usable aunque la funcionalidad de IA no este disponible.

Si falla el proveedor de IA, la conexion, la configuracion o la generacion del texto, el usuario debe poder continuar con el flujo principal mediante redaccion manual o sin resumen generado automaticamente.

La indisponibilidad de IA no debe impedir:

- gestionar clientes
- gestionar proyectos
- gestionar tareas
- registrar tiempos
- usar start/stop
- generar reportes basicos sin resumen asistido
- consultar el area de cliente

### RNF-41. Recuperacion ante fallos no criticos

Los fallos no criticos deben permitir continuar trabajando siempre que sea posible.

La perdida de una funcionalidad auxiliar no debe bloquear el nucleo del MVP.

## 13. IA responsable y controlada

La IA forma parte del MVP, pero debe estar limitada a funciones concretas, revisables y justificadas.

### RNF-42. IA como apoyo, no como fuente de verdad

La IA puede ayudar a generar textos profesionales o interpretar instrucciones en lenguaje natural, pero la fuente de verdad son los datos registrados en el sistema.

### RNF-43. Revision humana

El usuario interno debe poder revisar los resultados generados por IA antes de usarlos en reportes o propuestas estructuradas.

### RNF-44. Sin decisiones autonomas

La IA no debe tomar decisiones autonomas sobre cambios en el sistema.

La prueba conceptual de lenguaje natural debe devolver una propuesta estructurada o revisable, no ejecutar acciones reales de forma automatica.

### RNF-45. Limitacion de contexto

Las llamadas a IA deben limitar el contexto enviado a la informacion necesaria para la tarea solicitada.

Este requisito contribuye a reducir riesgos de privacidad, coste y dependencia externa.

## 14. Clasificacion de requisitos no funcionales

| Requisito | Clasificacion | Entra en TFM | Motivo | Evolucion futura |
|---|---|---|---|---|
| Autenticacion en zonas privadas | Imprescindible para el MVP | Si | Permite proteger informacion interna y de cliente. | Politicas avanzadas de autenticacion. |
| Control basico de acceso | Imprescindible para el MVP | Si | Evita accesos cruzados entre clientes. | Matriz avanzada de permisos. |
| Validacion de entradas | Imprescindible para el MVP | Si | Reduce errores y riesgos de seguridad. | Validaciones configurables o reglas avanzadas. |
| Seguridad inspirada en OWASP Top Ten | Imprescindible para el MVP | Si | Aporta rigor tecnico defendible. | Auditorias externas y hardening avanzado. |
| Privacidad basica inspirada en RGPD | Imprescindible para el MVP | Si | Promueve tratamiento prudente de datos. | Revision legal y cumplimiento formal. |
| Trazabilidad minima | Imprescindible para el MVP | Si | Facilita revision y depuracion de acciones relevantes. | Auditoria avanzada y cumplimiento normativo. |
| Mantenibilidad | Imprescindible para el MVP | Si | Facilita implementar, explicar y evolucionar el proyecto. | Arquitectura preparada para escala SaaS. |
| Pruebas unitarias criticas | Imprescindible para el MVP | Si | Protegen reglas relevantes del sistema. | Cobertura amplia y automatizacion completa. |
| Pruebas de integracion | Imprescindible para el MVP | Si | Validan flujos principales. | Pipelines completos de calidad. |
| Pruebas E2E | Recomendable pero aplazable | No obligatorio | Aportan valor a la demo, pero pueden aplazarse. | Suite E2E completa. |
| Accesibilidad basica | Imprescindible para el MVP | Si | Mejora usabilidad y calidad general. | Certificacion WCAG formal. |
| Rendimiento razonable | Imprescindible para el MVP | Si | Evita una experiencia lenta en la demo. | Optimizacion para escala real. |
| Alta disponibilidad | Linea futura del producto SaaS | No | No es necesaria para validar el MVP academico. | Infraestructura tolerante a fallos. |
| Monitorizacion avanzada | Linea futura del producto SaaS | No | Excede el alcance del TFM. | Observabilidad completa. |
| Auditoria avanzada | Linea futura del producto SaaS | No | Excede la trazabilidad minima necesaria. | Auditoria legal y trazas completas. |
| Cumplimiento legal certificado | Linea futura del producto SaaS | No | Requiere revision juridica especifica. | Adecuacion legal completa del SaaS. |

## 15. Criterios de aceptacion no funcional

El MVP se considerara aceptable desde el punto de vista no funcional si permite demostrar que:

1. Las zonas privadas requieren autenticacion.
2. El cliente solo accede a informacion asociada a el y marcada como visible.
3. Los formularios principales validan entradas relevantes.
4. Los secretos y credenciales no se almacenan directamente en el codigo fuente.
5. Las reglas criticas de tiempos, visibilidad y reportes se pueden probar.
6. La IA genera resultados revisables y no ejecuta acciones automaticamente.
7. El sistema sigue siendo usable aunque la IA no este disponible.
8. Existe trazabilidad minima de acciones relevantes.
9. La interfaz resulta comprensible para los flujos principales del MVP.
10. Los errores se comunican sin exponer informacion interna sensible.
11. El rendimiento es razonable para una demo academica y un uso controlado.
12. Las funcionalidades avanzadas propias del SaaS futuro no se incorporan como requisitos obligatorios del TFM.

## 16. Conclusion

Los requisitos no funcionales del MVP buscan asegurar que el proyecto sea seguro, mantenible, usable y defendible dentro del alcance de un Trabajo Final de Master.

El criterio principal es aplicar buenas practicas proporcionadas al contexto academico, evitando tanto la falta de rigor como el sobrediseno.

El MVP debe demostrar que el nucleo funcional puede construirse con calidad suficiente, control de seguridad basico, privacidad razonable, pruebas sobre partes criticas y uso responsable de IA, sin intentar convertirse todavia en un SaaS comercial completo.
