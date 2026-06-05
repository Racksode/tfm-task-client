# Histórico IA - CI básica con GitHub Actions

## Estado

Plan aprobado y aplicado.

## Resumen del prompt

El usuario solicitó crear una integración continua básica con GitHub Actions para validar Pull Requests hacia `main`.

El workflow debía usar npm, instalar dependencias con `npm ci` y ejecutar:

```text
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

La tarea también debía crear una nota formativa, registrar el plan aprobado y mantener el alcance limitado.

## Restricciones indicadas

El usuario indicó expresamente:

- no usar pnpm ni yarn;
- no añadir CD ni pasos de despliegue;
- no ejecutar migraciones;
- no levantar PostgreSQL en CI salvo que fuera imprescindible;
- usar una `DATABASE_URL` no real para Prisma;
- no modificar `package.json`, `package-lock.json`, `schema.prisma`, migraciones, README, ADRs, Docker Compose, código funcional ni configuración existente;
- no crear tests nuevos ni lógica de negocio;
- documentar la CI como validación técnica mínima, no como despliegue ni sustituto de revisión humana.

## Plan aprobado

Se aprobó:

- crear `.github/workflows/ci.yml`;
- crear `docs/notas/11-explicacion-ci-basica-github-actions.md`;
- crear `docs/planes/09-ci-basica-github-actions.md`;
- crear este histórico ampliado;
- ejecutar las validaciones locales existentes tras aplicar cambios.

## Resultado

Se creó un workflow de GitHub Actions que se ejecuta en Pull Requests hacia `main`.

El workflow usa Ubuntu, Node.js LTS, npm y `npm ci`. Define una `DATABASE_URL` local no real para permitir las validaciones de Prisma sin secretos privados.

La CI valida Prisma, genera Prisma Client, comprueba TypeScript, ejecuta ESLint y compila Next.js.

No se ha creado CD, despliegue, servicio de producción, migración, test nuevo ni lógica de negocio.

## Validación realizada

```text
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

Resultado: las cinco validaciones finalizaron correctamente.

## Commit o PR previsto

```text
ci: añadir validación básica de pull requests
```
