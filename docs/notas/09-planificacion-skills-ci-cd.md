# Planificación de Skills, CI y CD

## 1. Objetivo de la nota

Esta nota documenta el criterio para introducir Skills, integración continua (CI) y despliegue continuo (CD) en el momento adecuado del proyecto TFM.

No implementa ninguno de estos elementos. Su finalidad es orientar decisiones futuras y evitar añadir procesos o infraestructura antes de que aporten valor real al MVP.

## 2. Skills en este proyecto

En este proyecto, **Skills** se refiere a patrones reutilizables de trabajo con IA, plantillas o procedimientos repetibles. No son una funcionalidad de negocio del CRM.

Podrían servir para estandarizar tareas recurrentes como:

- crear un módulo funcional;
- crear una nota formativa;
- revisar un pull request;
- preparar una tarea para Codex;
- validar una capa técnica;
- documentar una decisión.

Todavía no conviene formalizarlas porque no se han repetido suficientes patrones reales como para saber qué procedimientos resultan útiles y estables.

## 3. Cuándo introducir Skills

Tiene sentido introducir Skills cuando existan patrones de trabajo repetidos y comprobados.

El momento recomendado sería después de completar el primer módulo funcional real, probablemente `Client`, cuando ya se haya recorrido el flujo completo de modelo, acceso a datos, validación, interfaz y documentación. También deberían existir señales claras de que repetir manualmente esas tareas empieza a generar fricción.

Formalizar Skills demasiado pronto puede producir documentación artificial, burocracia innecesaria o procedimientos que no encajen con la evolución real del proyecto.

## 4. CI en este proyecto

La integración continua (CI) consistiría en validar automáticamente los cambios del proyecto cada vez que se abra o actualice un pull request. El candidato natural para implementarla sería GitHub Actions.

Una futura CI podría ejecutar validaciones como:

- `npm install` o `npm ci`, según convenga;
- `npm run prisma:validate`;
- `npm run prisma:generate`;
- `npm run typecheck`;
- `npm run lint`;
- `npm run build`.

La CI no desplegaría la aplicación. Su función sería comprobar una calidad técnica mínima y detectar errores antes de integrar cambios.

## 5. Cuándo introducir CI

La CI debería introducirse relativamente pronto: después de crear la capa de acceso a datos o justo antes de comenzar el primer CRUD o módulo funcional. En cualquier caso, conviene incorporarla antes de que el proyecto acumule muchas funcionalidades.

Disponer de CI antes de desarrollar autenticación y los CRUD permitiría validar automáticamente cada pull request y detectar problemas técnicos con antelación.

Retrasar demasiado la CI aumenta el riesgo de descubrir errores cuando ya afectan a varias funcionalidades.

## 6. CD en este proyecto

El despliegue continuo (CD) implicaría publicar automáticamente la aplicación en un entorno al realizar un merge o crear una release.

No debe implementarse todavía porque faltan decisiones y capacidades esenciales:

- autenticación;
- módulos funcionales;
- estrategia de entornos;
- variables de producción;
- base de datos de producción;
- política de migraciones;
- seguridad mínima;
- decisión de hosting y despliegue.

## 7. Cuándo introducir CD

El CD debe aplazarse hasta que exista un MVP mínimamente funcional y una estrategia clara de despliegue y base de datos.

El momento recomendado sería después de disponer de un login básico y de los módulos de clientes, proyectos, tareas y tiempos. Podría incorporarse antes de la demostración final si aporta valor al TFM y el despliegue puede realizarse de forma controlada.

Implementar CD demasiado pronto aumentaría el riesgo de desplegar una aplicación inmadura, incompleta o insegura.

## 8. Orden recomendado

El orden sugerido para introducir estos elementos es:

1. Crear la capa de acceso a datos.
2. Introducir una CI básica.
3. Implementar la autenticación mínima.
4. Completar el primer módulo funcional `Client`.
5. Formalizar Skills si ya existen patrones repetidos y comprobados.
6. Desarrollar el resto de módulos del MVP.
7. Introducir CD solo cuando exista un MVP y una estrategia clara de despliegue.

## 9. Riesgos de adelantarlos

- **Skills demasiado pronto:** burocracia innecesaria y procedimientos alejados de la realidad del proyecto.
- **CI demasiado tarde:** errores detectados cuando su corrección resulta más costosa.
- **CD demasiado pronto:** despliegue de una aplicación inmadura o sin garantías mínimas de seguridad.

## 10. Estado tras esta nota

Tras crear esta nota:

- no se ha implementado ninguna Skill;
- no se ha creado CI;
- no se ha creado CD;
- solo se ha documentado el criterio para su posible introducción futura.
