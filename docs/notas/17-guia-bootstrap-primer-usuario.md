# Guía de bootstrap del primer usuario

## Objetivo

Crear el primer usuario interno en un entorno local nuevo para poder iniciar sesión y acceder a la gestión de usuarios.

Este proceso está pensado únicamente para desarrollo local y despliegues controlados.

---

## Requisitos previos

Antes de ejecutar el bootstrap deben completarse los siguientes pasos:

### 1. Levantar PostgreSQL

```bash
docker compose up -d
```

### 2. Aplicar migraciones

```bash
npx prisma migrate dev
```

### 3. Generar cliente Prisma

```bash
npm run prisma:generate
```

### 4. Configurar variables de entorno

Verificar que existe un archivo `.env` local correctamente configurado.

---

## Variables necesarias

Además de las variables habituales (`DATABASE_URL`, `AUTH_SECRET`, etc.), el bootstrap requiere:

```env
BOOTSTRAP_USER_EMAIL="admin@example.com"
BOOTSTRAP_USER_PASSWORD="change-me-please"
BOOTSTRAP_USER_NAME="Admin"
```

### Descripción

| Variable                | Descripción                           |
| ----------------------- | ------------------------------------- |
| BOOTSTRAP_USER_EMAIL    | Correo electrónico del primer usuario |
| BOOTSTRAP_USER_PASSWORD | Contraseña inicial                    |
| BOOTSTRAP_USER_NAME     | Nombre visible del usuario            |

---

## Crear el primer usuario

Ejecutar:

```bash
npm run bootstrap:first-user
```

El script creará un usuario:

* Estado: `ACTIVE`
* Rol: `INTERNAL`

Si el usuario ya existe, el script no debe generar duplicados.

---

## Inicio de sesión

Una vez creado el usuario:

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000/users
```

o el puerto asignado por Next.js si el 3000 estuviera ocupado.

---

## Consideraciones de seguridad

* La contraseña nunca debe almacenarse en texto plano.
* El script utiliza `bcryptjs` para generar `passwordHash`.
* No existe endpoint público para realizar este bootstrap.
* El proceso está pensado únicamente para inicialización controlada de entornos.

---

## Resolución de problemas

### Error: MissingSecret

Verificar que existe:

```env
AUTH_SECRET="valor-seguro"
```

### Error: columna `passwordHash` no existe

Aplicar migraciones pendientes:

```bash
npx prisma migrate dev
```

### Error: faltan variables BOOTSTRAP_*

Verificar la configuración del archivo `.env`.

---

## Histórico

Documento creado durante la Fase 2A (Bootstrap controlado del primer usuario) para facilitar la preparación de nuevos entornos de desarrollo.
