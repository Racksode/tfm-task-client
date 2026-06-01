# Plan 06 - Proyecto tecnico base

## Objetivo

Crear el primer codigo ejecutable del MVP como una aplicacion Next.js con React, TypeScript, App Router y npm, manteniendo el alcance limitado al proyecto tecnico base.

## Alcance

Se crea la aplicacion en la raiz del repositorio, sin app anidada y sin mover la documentacion existente.

Este bloque incluye:

- configuracion minima de Next.js
- configuracion minima de TypeScript
- configuracion minima de ESLint
- estructura inicial `src/app`
- preparacion documental de `src/modules` y `src/shared`
- pagina inicial tecnica minima
- scripts npm de desarrollo y validacion

## Comandos previstos

```powershell
npm init -y
npm install next react react-dom
npm install -D typescript @types/node @types/react @types/react-dom eslint eslint-config-next
npm run typecheck
npm run lint
npm run build
```

## Fuera de alcance

No se implementan:

- clientes, proyectos, tareas, tiempos, reportes, area cliente ni IA
- autenticacion real
- modelo Prisma completo
- migraciones
- Docker Compose
- tests reales
- Playwright
- cambios en requisitos, modelo de datos, arquitectura o ADRs cerrados

## Resultado esperado

El proyecto debe poder instalarse con `npm install`, arrancar con `npm run dev` y superar las validaciones basicas `npm run typecheck`, `npm run lint` y `npm run build`.

## Commit previsto

```text
chore: crear proyecto tecnico base con Next.js
```
