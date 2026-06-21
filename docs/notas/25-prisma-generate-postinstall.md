# Regeneración automática del Prisma Client (postinstall)

## Qué se ha hecho

Se ha añadido el script `postinstall: "prisma generate"` en `package.json`.

## Por qué

El Prisma Client (en `node_modules/@prisma/client`, generado a partir de `prisma/schema.prisma`) **no se versiona**: cada equipo lo genera localmente. Si el schema cambia (p. ej. al añadir campos de auditoría a `Project`) y no se regenera el cliente, las operaciones fallan en runtime con `PrismaClientValidationError: Unknown argument ...`, aunque la migración esté aplicada y el typecheck del editor use otra copia.

Con `postinstall`, `npm install` regenera el cliente automáticamente, manteniéndolo sincronizado con el schema tras cada cambio de dependencias o de rama que implique reinstalar.

## Conceptos e implicaciones

- `prisma generate` solo lee el schema; **no** necesita conexión a la base de datos ni `DATABASE_URL`, por lo que es seguro en `postinstall` y en CI.
- No sustituye a las migraciones: los cambios de schema siguen requiriendo `prisma migrate dev` (local) / `prisma migrate deploy` (despliegue) para actualizar la base de datos.
- Si el error de "cliente desactualizado" reaparece con el dev server en marcha, basta con regenerar (`npm run prisma:generate`) y **reiniciar** el servidor (Turbopack cachea el módulo en memoria).

## Qué queda sin implementar

- No se añade `prisma generate` al script de `build` (el `postinstall` cubre el caso habitual); valorarlo si algún entorno de despliegue no ejecuta `postinstall`.
