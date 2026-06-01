# Historico IA - Proyecto tecnico base

## Estado

Plan literal disponible.

## Prompt original

El usuario solicito leer `README.md`, `AGENTS.md`, `docs/04-arquitectura.md`, `docs/adr/0004-eleccion-stack-tecnologico.md`, `docs/adr/0005-persistencia-y-acceso-datos.md` y `docs/adr/0006-autenticacion-y-control-acceso.md`.

El objetivo indicado fue preparar el primer codigo ejecutable del MVP creando unicamente el proyecto tecnico base con Next.js, React, TypeScript, npm, estructura modular por dominios y preparacion futura para PostgreSQL, Prisma, Auth.js/NextAuth y Vitest, sin implementar funcionalidades de negocio.

## Plan completo propuesto

````text
# Aplicar Proyecto Técnico Base del MVP

## Resumen

Crear en la raíz del repositorio una app Next.js con React, TypeScript, App Router, npm y estructura mínima modular, sin funcionalidades de negocio ni integraciones reales.

La aplicación final quedará en la raíz, no en `frontend/`, `backend/` ni una carpeta anidada. Se usará instalación manual mínima para no reescribir la documentación existente.

## Cambios

Comandos previstos:

```powershell
npm init -y
npm install next react react-dom
npm install -D typescript @types/node @types/react @types/react-dom eslint eslint-config-next
npm run typecheck
npm run lint
npm run build
```

Scripts en `package.json`:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit"
}
```

Ficheros a crear:

```text
package.json
package-lock.json
next.config.ts
tsconfig.json
eslint.config.mjs
next-env.d.ts
src/app/layout.tsx
src/app/page.tsx
src/app/globals.css
src/modules/README.md
src/shared/README.md
docs/planes/06-proyecto-tecnico-base.md
docs/historico-ia/fase-04-implementacion/01-proyecto-tecnico-base.md
```

Fichero a modificar:

```text
README.md
```

La página inicial será técnica y mínima: solo indicará que el proyecto base del MVP arranca correctamente.

## Límites

Queda fuera de este bloque:

- Clientes, proyectos, tareas, tiempos, reportes, área cliente e IA.
- Autenticación real.
- Prisma schema completo.
- Migraciones.
- Docker Compose.
- Tests reales.
- Playwright.
- Cambios en requisitos, modelo de datos, arquitectura o ADRs cerrados.

No se instalarán todavía `prisma`, `@prisma/client`, `next-auth`, `vitest` ni `playwright`.

## Documentación

Actualizar `README.md` solo con instrucciones breves:

```text
npm install
npm run dev
npm run build
npm run typecheck
npm run lint
```

Crear `docs/planes/06-proyecto-tecnico-base.md` con resumen formal del plan aplicado.

Crear `docs/historico-ia/fase-04-implementacion/01-proyecto-tecnico-base.md` incluyendo:

- Estado: `Plan literal disponible`.
- Prompt original.
- Plan completo propuesto.
- Revisión humana.
- Prompt de aplicación.
- Resultado esperado.
- Commit/PR previsto.

## Validación

Validaciones obligatorias al terminar:

```powershell
npm run typecheck
npm run lint
npm run build
```

Si alguna validación falla por configuración inicial, se corregirá solo dentro del alcance del proyecto técnico base.

Commit sugerido:

```text
chore: crear proyecto tecnico base con Next.js
```
````

## Revision humana

El usuario aprobo el plan con este mensaje:

```text
Plan aprobado.

Aplica el plan tal como lo has descrito.

Recordatorios importantes:

1. Usa npm como gestor de paquetes.
   - No usar pnpm.
   - No usar yarn.
   - Debe generarse package-lock.json.

2. Mantén la app en la raíz del repositorio.
   - No crear frontend/.
   - No crear backend/.
   - No crear my-app/.
   - No mover la documentación existente.

3. No instales todavía:
   - prisma
   - @prisma/client
   - next-auth
   - vitest
   - playwright

4. No implementes negocio:
   - clientes
   - proyectos
   - tareas
   - tiempos
   - reportes
   - área cliente
   - IA
   - autenticación real

5. En docs/historico-ia/fase-04-implementacion/01-proyecto-tecnico-base.md:
   - marca el estado como "Plan literal disponible"
   - conserva el plan completo propuesto
   - incluye esta aprobación como revisión humana / prompt de aplicación

6. Si alguna validación falla, corrige solo dentro del alcance del proyecto base.

Al finalizar, resume:
- comandos ejecutados
- ficheros creados/modificados
- validaciones realizadas
- incidencias
- commit sugerido
```

## Prompt de aplicacion

```text
ejecuta el plan
```

## Resultado

Se crea el proyecto tecnico base en la raiz del repositorio con npm, Next.js, React, TypeScript, App Router, ESLint minimo, pagina inicial tecnica y estructura documental inicial para `src/modules` y `src/shared`.

No se implementan funcionalidades de negocio, autenticacion real, Prisma, migraciones, Docker Compose ni tests reales.

## Validacion realizada

```powershell
npm run typecheck
npm run lint
npm run build
```

Resultado: las tres validaciones finalizaron correctamente.

## Commit o PR previsto

```text
chore: crear proyecto tecnico base con Next.js
```
