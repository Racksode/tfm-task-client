# Plan 08 - Capa base de acceso a datos con Prisma

## Objetivo

Crear la pieza tecnica minima para reutilizar Prisma Client desde codigo de servidor de Next.js, sin implementar funcionalidades de negocio.

## Alcance aplicado

- Crear `src/lib/prisma.ts`.
- Configurar Prisma Client con `PrismaPg` y `DATABASE_URL`.
- Reutilizar la instancia durante el hot reload de desarrollo.
- Crear una nota formativa sobre la capa de acceso a datos.
- Validar Prisma, TypeScript, ESLint y la compilacion Next.js.

## Limites

No se crean consultas, CRUDs, repositorios, servicios, endpoints, rutas, server actions, pantallas, autenticacion ni logica de negocio.

No se modifican el schema, las migraciones, las dependencias ni la configuracion existente.

## Validacion prevista

```text
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

## Siguiente fase tecnica

La planificacion existente recomienda introducir una CI basica despues de esta capa y antes de acumular modulos funcionales. Debe abordarse como una tarea separada.

## Commit previsto

```text
chore: crear capa base de acceso a datos con Prisma
```
