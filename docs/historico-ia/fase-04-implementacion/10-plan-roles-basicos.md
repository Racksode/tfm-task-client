# Histórico IA - Plan de roles básicos

## Estado

Plan documental aprobado y aplicado.

## Resumen del prompt

El usuario solicitó crear la planificación documental de la Fase 3 - Consolidación de roles básicos.

La fase debía documentar que el proyecto no crea roles desde cero, sino que consolida el uso de los roles actuales del MVP, `INTERNAL` y `CLIENT`, define reglas claras y prepara el patrón para futuras rutas internas.

## Restricciones indicadas

El usuario indicó expresamente:

- no modificar código;
- no modificar `prisma/schema.prisma`;
- no crear migraciones;
- no crear roles `ADMIN` ni `MEMBER`;
- no crear permisos avanzados;
- no crear área cliente;
- no crear middleware global;
- no tocar CI ni dependencias;
- no modificar README ni otros documentos fuera de los dos archivos solicitados.

## Contexto ya implementado

Antes de esta planificación, el proyecto ya contaba con:

- roles actuales del MVP limitados a `INTERNAL` y `CLIENT`;
- autenticación mínima implementada;
- bootstrap del primer usuario `INTERNAL` implementado;
- usuarios mínimos implementados;
- `/users` protegido para usuarios `INTERNAL`;
- server actions de `/users` protegidas para usuarios `INTERNAL`;
- usuarios `CLIENT` bloqueados en `/users`.

## Plan aprobado

Se aprobó crear únicamente:

- `docs/planes/15-roles-basicos.md`;
- `docs/historico-ia/fase-04-implementacion/10-plan-roles-basicos.md`.

El plan debía mantener la Fase 3 como consolidación documental y validación del patrón `INTERNAL` / `CLIENT`, no como implementación nueva.

## Resultado

Se creó un plan documental para la Fase 3 de roles básicos.

El documento deja claro qué ya está implementado, qué se pretende revisar, qué queda fuera del alcance y qué validación se espera antes de cerrar la fase.

No se modificó código, Prisma, migraciones, CI, dependencias, README ni otros documentos.

No se crearon roles nuevos, permisos avanzados, área cliente ni middleware global.

## Validación esperada

Antes de cerrar la fase se espera comprobar:

- acceso correcto a `/users` con usuario `INTERNAL`;
- bloqueo de acceso a `/users` con usuario `CLIENT`;
- exigencia de rol `INTERNAL` en las server actions de `/users`;
- ausencia de roles nuevos fuera de `INTERNAL` y `CLIENT`;
- ausencia de cambios en esquema de datos, migraciones, CI y dependencias.

## Commit o PR previsto

```text
docs: planificar consolidacion de roles basicos
```
