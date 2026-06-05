# Explicación formativa de la CI básica con GitHub Actions

## 1. Qué es CI

CI significa integración continua.

En este proyecto, la CI es un proceso automático que valida el código cada vez que se abre o actualiza un Pull Request hacia `main`.

Su objetivo es detectar errores técnicos antes de integrar cambios en la rama principal.

## 2. Diferencia entre CI y CD

CI valida el proyecto.

CD despliega o publica el proyecto.

Este cambio solo introduce CI. No despliega la aplicación, no publica versiones y no configura ningún entorno de producción.

## 3. Por qué se introduce ahora

La CI se introduce después de crear la capa base de acceso a datos con Prisma.

Ese punto ya estaba previsto en `docs/notas/09-planificacion-skills-ci-cd.md`: después de preparar la persistencia y antes de acumular autenticación, CRUDs o módulos funcionales.

Introducirla ahora permite validar automáticamente una base técnica mínima antes de seguir ampliando el MVP.

## 4. Qué valida el workflow

El workflow se ejecuta en Pull Requests hacia `main` y comprueba:

- instalación reproducible de dependencias con `npm ci`;
- validez del schema de Prisma;
- generación de Prisma Client;
- comprobación de tipos TypeScript;
- revisión con ESLint;
- compilación de Next.js.

Los comandos ejecutados son:

```text
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

## 5. Por qué se usa `npm ci`

`npm ci` instala las dependencias a partir de `package-lock.json`.

Esto es adecuado para CI porque hace la instalación más reproducible y evita cambios implícitos en el árbol de dependencias.

El proyecto mantiene npm como gestor de paquetes.

## 6. Por qué no se cambia a pnpm

No se cambia a pnpm porque el proyecto ya usa npm y cuenta con `package-lock.json`.

Cambiar de gestor de paquetes no aporta valor necesario al MVP en este momento y generaría cambios de dependencias fuera del alcance de esta tarea.

## 7. Papel de `DATABASE_URL`

Prisma 7 obtiene la URL de conexión desde `DATABASE_URL`.

Los comandos de validación y generación pueden necesitar que esta variable exista, aunque no se conecten a una base de datos real.

Por eso el workflow define una URL local no realista de producción y sin secretos privados:

```text
postgresql://postgres:postgres@localhost:5432/tfm_task_client
```

La CI no levanta PostgreSQL y no ejecuta migraciones.

## 8. Qué no hace esta CI

Esta CI no:

- despliega la aplicación;
- implementa CD;
- ejecuta migraciones;
- levanta producción;
- levanta PostgreSQL;
- prueba funcionalidades de negocio;
- crea tests nuevos;
- sustituye la revisión humana.

Su función es validar una calidad técnica mínima.

## 9. Pasos futuros posibles

Cuando el proyecto avance, se podrían valorar tareas separadas como:

- añadir tests cuando existan casos implementados;
- incorporar checks de seguridad;
- valorar Dependabot o auditorías;
- valorar CD cuando exista un MVP desplegable y una estrategia clara de despliegue.

Estos pasos quedan fuera de esta tarea.
