import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * `prisma generate` no se conecta a la base de datos, pero la config falla al
 * cargar si `env("DATABASE_URL")` no existe. En una instalación limpia el
 * `postinstall` (prisma generate) corre antes de crear el `.env`, así que
 * usamos un fallback con formato válido para no romper `npm install`.
 * En migrate/studio/runtime se usa el `DATABASE_URL` real del entorno.
 */
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
