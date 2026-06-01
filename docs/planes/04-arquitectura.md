# Plan 04 - Arquitectura

## Objetivo

Definir la arquitectura inicial del MVP y los ADRs principales necesarios para justificar las decisiones técnicas de alto nivel antes de iniciar implementación.

## Ficheros afectados

- `docs/04-arquitectura.md`
- `docs/adr/0001-eleccion-arquitectura.md`
- `docs/adr/0002-eleccion-base-datos.md`
- `docs/adr/0003-integracion-ia.md`

## Plan aprobado

Documentar una arquitectura inicial limitada al MVP, con módulos funcionales, capas internas, persistencia relacional, autenticación y visibilidad básicas, integración IA controlada, restricciones explícitas, testing previsto y decisiones aplazadas.

## Ajustes humanos aplicados

- Evitar microservicios, infraestructura avanzada y arquitectura distribuida.
- Mantener la IA como apoyo revisable, sin ejecución automática de acciones.
- Documentar ADRs breves para arquitectura, base de datos e integración IA.
- Aplazar decisiones de stack concreto, ORM, proveedor de autenticación, proveedor IA y despliegue final.

## Resultado

Arquitectura inicial y ADRs del MVP completados, dejando el proyecto preparado para una fase breve de decisiones técnicas iniciales antes del primer código ejecutable.

## Commit asociado, si se conoce

```text
docs: definir arquitectura inicial del proyecto
```
