# Explicacion de la capa base de acceso a datos con Prisma

## 1. Que es una capa de acceso a datos

Una capa de acceso a datos es la parte tecnica que permite a la aplicacion comunicarse con la base de datos de forma controlada.

En este proyecto, la capa base comienza con una instancia reutilizable de Prisma Client. Esta pieza prepara el acceso desde codigo de servidor, pero todavia no contiene consultas, repositorios ni logica de negocio.

## 2. Por que centralizar Prisma Client

No conviene instanciar `PrismaClient` directamente en cualquier archivo porque cada instancia administra recursos de conexion con PostgreSQL. Crear instancias sin control dificulta mantener una configuracion comun y puede abrir conexiones innecesarias.

Centralizar la instancia ofrece un unico punto tecnico para configurar y reutilizar Prisma desde las futuras piezas de servidor.

## 3. El problema del hot reload

Durante el desarrollo, Next.js puede recargar modulos cuando cambia el codigo. Este mecanismo de hot reload podria crear nuevas instancias de Prisma Client aunque la anterior siga disponible.

Para evitarlo, `src/lib/prisma.ts` conserva la instancia en `globalThis` cuando la aplicacion no se ejecuta en produccion. Asi, las recargas de desarrollo pueden reutilizarla. En produccion se exporta la instancia creada por el modulo sin guardarla globalmente.

## 4. Que hace `src/lib/prisma.ts`

El archivo:

- lee la cadena de conexion desde `DATABASE_URL`;
- crea el adapter PostgreSQL `PrismaPg` proporcionado por `@prisma/adapter-pg`;
- entrega ese adapter a `PrismaClient`, como requiere la configuracion actual de Prisma 7;
- exporta una instancia reutilizable llamada `prisma`;
- evita instancias adicionales durante el hot reload de desarrollo;
- informa mediante un error claro si falta `DATABASE_URL`.

El archivo no ejecuta consultas ni conecta explicitamente al importarse. La conexion se utilizara cuando una futura pieza de servidor realice una operacion con Prisma.

## 5. Relacion entre las piezas

Las piezas de persistencia se relacionan de esta forma:

```text
Prisma schema -> migraciones -> estructura real en PostgreSQL
PostgreSQL <- Prisma Client con adapter pg <- aplicacion Next.js
```

- **PostgreSQL** almacena los datos reales.
- **Prisma schema** define los modelos, campos y relaciones usados por Prisma.
- **Migraciones** convierten los cambios del schema en cambios versionados de la estructura PostgreSQL.
- **Prisma Client** ofrece una API tipada para acceder a esos modelos desde TypeScript.
- **Next.js** utilizara la instancia compartida desde codigo ejecutado en el servidor.

`DATABASE_URL` contiene los datos de conexion y se mantiene en el archivo local `.env`, que no debe compartirse ni versionarse.

## 6. Que no se ha implementado

Este paso no implementa:

- CRUDs;
- endpoints o rutas API;
- pantallas o componentes;
- autenticacion;
- logica de negocio;
- repositorios especificos;
- servicios funcionales;
- consultas de prueba.

La creacion de la capa base no convierte los modelos existentes en funcionalidades terminadas.

## 7. Siguientes pasos

Los siguientes bloques previstos son:

1. Introducir una CI basica como tarea tecnica separada.
2. Implementar autenticacion minima mediante un plan aprobado.
3. Implementar el primer modulo funcional `Client`.
4. Usar esta capa desde servicios o acciones de servidor cuando cada funcionalidad lo requiera.

Estos pasos permanecen pendientes y deben planificarse de forma separada para mantener controlado el alcance del MVP.
