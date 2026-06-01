# ADR 0004 - Eleccion de stack tecnologico

## Estado

Aceptada.

## Contexto

El MVP necesita una base tecnica concreta antes de crear el primer codigo ejecutable.

La arquitectura ya aceptada define un monolito modular organizado por dominios funcionales. Queda pendiente concretar el stack, la estructura inicial del proyecto, los patrones basicos de organizacion y el testing minimo, sin ampliar el alcance del TFM.

La decision debe permitir comenzar el proyecto base con seguridad, pero evitando una arquitectura propia de un SaaS comercial completo.

## Decision

Se decide utilizar el siguiente stack inicial para el MVP:

- Next.js.
- React.
- TypeScript.
- Aplicacion monolitica modular en un unico proyecto.
- Docker solo como apoyo local cuando sea necesario, especialmente para la base de datos.
- GitHub como repositorio y control de versiones.

La estructura inicial del proyecto se organizara por dominios funcionales y mantendra una separacion sencilla entre:

- interfaz de usuario
- validacion
- casos de uso y reglas de negocio
- acceso a datos
- integracion IA
- trazabilidad minima

Los dominios principales seran los ya definidos en la arquitectura: clientes, proyectos, tareas, tiempos, tarifas y costes, reportes, area de cliente, IA controlada y trazabilidad minima.

El testing minimo se apoyara en Vitest para pruebas unitarias de reglas criticas. Playwright se considera recomendable pero aplazable, y solo se incorporara si el avance del MVP lo permite sin desplazar el nucleo funcional.

## Alternativas valoradas

### Next.js, React y TypeScript

Permite construir interfaz y logica de servidor en un unico proyecto, manteniendo coherencia con el monolito modular.

Ventajas:

- reduce la necesidad de separar frontend y backend desde el inicio
- encaja con una aplicacion web demostrable
- facilita trabajar con TypeScript de extremo a extremo
- permite evolucionar sin introducir microservicios

Inconvenientes:

- requiere disciplina para no mezclar responsabilidades
- puede introducir decisiones propias del framework que deben mantenerse simples

### React con API backend separada

Separaria frontend y backend en dos aplicaciones desde el inicio.

Ventajas:

- separacion fisica clara
- posible reutilizacion futura de la API

Inconvenientes:

- aumenta configuracion, contratos y despliegue
- no es necesario para demostrar el MVP
- contradice la preferencia actual por un monolito modular sencillo

No se selecciona para el MVP.

### Framework backend clasico con frontend separado

Opciones como Django, Laravel o Rails podrian resolver bien parte del MVP.

Ventajas:

- madurez en aplicaciones CRUD
- ecosistemas estables

Inconvenientes:

- obligarian a combinar otro stack frontend o renunciar a la experiencia prevista con React
- alejan el proyecto del stack candidato ya identificado
- no aportan una ventaja clara para el alcance actual

No se seleccionan para el MVP.

## Consecuencias

El primer proyecto ejecutable debera iniciarse como una aplicacion Next.js con TypeScript y organizacion interna modular.

La estructura debera ser suficiente para separar responsabilidades, pero no debera crear capas, librerias internas o abstracciones que no sean necesarias para el MVP.

Quedan aplazados:

- inicializacion del proyecto Next.js
- instalacion de dependencias
- configuracion concreta de Vitest
- posible incorporacion de Playwright
- detalles de despliegue
- estructura definitiva de carpetas si durante la implementacion aparece una razon tecnica justificada para ajustarla
