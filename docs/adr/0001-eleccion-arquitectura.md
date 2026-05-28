# ADR 0001 - Eleccion de arquitectura

## Estado

Aceptada.

## Contexto

El proyecto debe definir una arquitectura adecuada para desarrollar un MVP funcional del TFM.

El sistema debe cubrir clientes, proyectos, tareas, tiempos, tarifas basicas, reportes, area de cliente, uso controlado de IA y trazabilidad minima. Tambien debe mantener una separacion clara entre el MVP academico y una posible evolucion futura como SaaS comercial.

La arquitectura debe evitar sobredimensionar la solucion. No se busca construir una plataforma distribuida ni una infraestructura avanzada, sino una aplicacion defendible, mantenible y suficiente para demostrar el nucleo funcional.

## Decision

Se decide utilizar una **arquitectura de monolito modular organizado por dominios funcionales**.

La aplicacion se planteara como un unico sistema desplegable, con separacion interna por modulos y capas.

Los dominios principales seran:

- clientes
- proyectos
- tareas
- tiempos
- tarifas y costes
- reportes
- area de cliente
- IA controlada
- trazabilidad minima

La separacion sera interna, no distribuida. La arquitectura distinguira entre interfaz, validacion, casos de uso, reglas de negocio, acceso a datos, integracion IA y trazabilidad, pero no convertira esas responsabilidades en aplicaciones independientes para el MVP.

## Alternativas valoradas

### Monolito modular

Permite construir el MVP como una unica aplicacion, manteniendo orden interno y separacion por dominios.

Ventajas:

- menor complejidad inicial
- facil de implementar y probar
- facil de explicar en la defensa del TFM
- suficiente para el volumen y alcance del MVP
- permite evolucionar posteriormente si el producto crece

Inconvenientes:

- menor separacion fisica que una arquitectura distribuida
- puede requerir disciplina interna para evitar mezclar responsabilidades

### Frontend y backend completamente separados

Consiste en desarrollar dos aplicaciones independientes desde el inicio: una aplicacion frontend y una API backend separada.

Ventajas:

- separacion fisica clara entre interfaz y API
- puede facilitar una evolucion futura hacia multiples clientes

Inconvenientes:

- incrementa configuracion, despliegue y mantenimiento
- obliga a definir contratos API completos desde una fase temprana
- anade complejidad que no es imprescindible para demostrar el MVP

Para el TFM, esta separacion completa se considera innecesaria salvo decision posterior documentada.

### Microservicios

Consiste en separar los dominios en servicios independientes.

Ventajas:

- independencia de despliegue por servicio
- posible escalabilidad por dominio en un producto maduro

Inconvenientes:

- alta complejidad operativa
- necesidad de comunicacion entre servicios
- mayor dificultad de pruebas y depuracion
- infraestructura innecesaria para el MVP
- riesgo claro de sobrealcance

Se descarta para el MVP.

## Consecuencias

La decision permite avanzar con una arquitectura sencilla y defendible, sin renunciar a una organizacion interna clara.

El MVP no incluira:

- arquitectura distribuida
- microservicios
- dos aplicaciones completamente independientes
- orquestacion avanzada
- mensajeria distribuida
- infraestructura propia de un SaaS a escala comercial

Si en el futuro el producto evoluciona hacia un SaaS comercial, se podra reevaluar la separacion de componentes o servicios. Esa evolucion no forma parte del alcance actual del TFM.
