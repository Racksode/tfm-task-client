# Plan de pruebas

> Documento funcional del MVP del TFM.
> Define la estrategia de validación y pruebas del MVP, separando lo que ya está automatizado de lo que queda previsto.

## 1. Introducción

Este documento describe cómo se valida el proyecto y qué pruebas se contemplan para el MVP.

Distingue dos planos:

- **Validación automática actual**: lo que ya ejecuta la integración continua (CI) en cada Pull Request.
- **Pruebas previstas**: los niveles de prueba planificados que aún no están implementados.

El estado refleja la realidad del repositorio y no presenta como hecho lo que no existe. Actualmente **no hay pruebas automatizadas** (no hay Vitest ni Playwright instalados); la CI realiza validación estática y de build.

## 2. Validación automática actual (CI)

La CI está definida en `.github/workflows/ci.yml` (job **"Validate project"**).

- **Disparador**: `pull_request` contra `main`. Mediante `paths-ignore`, los PR que solo cambian documentación (`**/*.md`, `docs/**`, `LICENSE`) no ejecutan la CI, ya que no pueden romper tipos, lint ni build.
- **Entorno**: Ubuntu, Node.js LTS, `DATABASE_URL` definida como variable de entorno.
- **Pasos**:
  1. `npm ci` — instalación reproducible de dependencias.
  2. `npm run prisma:validate` — valida el esquema de Prisma.
  3. `npm run prisma:generate` — genera el cliente de Prisma.
  4. `npm run typecheck` — comprobación de tipos con TypeScript.
  5. `npm run lint` — análisis estático con ESLint.
  6. `npm run build` — compilación de la aplicación Next.js.

**Qué garantiza hoy**: que el proyecto instala, el esquema de Prisma es válido, el código tipa, pasa lint y compila. Es la puerta de calidad mínima para integrar en `main`.

**Qué NO es**: no son pruebas funcionales ni de integración; no se ejecuta lógica de negocio contra datos.

## 3. Limitaciones actuales de la CI

Se dejan registradas para abordarlas cuando se incorporen pruebas:

- No existe paso de pruebas (`npm test`); no hay framework de testing instalado.
- `DATABASE_URL` está definida, pero el workflow **no levanta un servicio PostgreSQL**, por lo que no puede ejecutar pruebas que requieran base de datos real. Sería necesario añadir un `services: postgres` al workflow.
- No hay medición de **cobertura** ni umbral mínimo.
- Solo se valida el esquema con `prisma:validate`; no se comprueban **migraciones** contra una base de datos.
- La CI se ejecuta solo en `pull_request` hacia `main`, no en push directo ni en otras ramas.

## 4. Niveles de prueba previstos

### 4.1. Pruebas unitarias (Vitest) — pendiente

Centradas en la lógica de negocio crítica del MVP:

- cálculo de horas y coste estimado;
- prevención de solapamiento de tareas activas (RN-12);
- validaciones de usuarios y de registros de tiempo (RN-10, RN-11);
- reglas de visibilidad para el área de cliente (RN-02, RN-17, RN-20).

Vitest figura como herramienta prevista en el stack, pero todavía no está instalado.

### 4.2. Pruebas de integración — pendiente

Verificación de las server actions y el acceso a datos (Prisma) contra una base de datos de prueba. Requerirá levantar PostgreSQL en la CI.

### 4.3. Pruebas end-to-end (Playwright) — aplazable

Validación del flujo principal de la demo de extremo a extremo (acceso, gestión, tiempos, reporte, área de cliente). Se considera aplazable para el MVP.

### 4.4. Validación manual

Comprobación manual de los flujos críticos antes de cerrar cada fase, especialmente acceso por rol, control start/stop y generación de reportes.

## 5. Trazabilidad con casos de uso y reglas

La cobertura de pruebas se rastrea junto a las historias de usuario en la matriz de `docs/13-historias-de-usuario.md` (columna *Test*), hoy en estado *Pendiente* para todas.

Prioridad de prueba cuando se implemente el testing:

- alta: lógica con reglas explícitas (start/stop y solapamiento, cálculo de horas/coste, visibilidad de área de cliente);
- media: validaciones de formularios y server actions;
- baja: vistas sin lógica relevante.

## 6. Criterios de validación para integrar

- **Hoy**: la CI de validación ("Validate project") debe estar en verde para integrar en `main`.
- **Cuando exista testing**: además, las pruebas automatizadas deben pasar y, si se define, cumplir el umbral mínimo de cobertura.

## 7. Estado y próximos pasos

- La validación estática y de build está automatizada en CI.
- La incorporación de pruebas automatizadas (empezando por Vitest y unas pocas pruebas de lógica de negocio) está pendiente y deberá plantearse como una fase propia, con su instalación de dependencias y, si procede, el servicio PostgreSQL en la CI.
