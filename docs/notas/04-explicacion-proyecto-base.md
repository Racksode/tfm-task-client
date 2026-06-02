# Explicación del proyecto base generado

## 1. Qué se ha creado

Se ha creado un proyecto técnico base con Next.js, React y TypeScript.

En este momento el proyecto ya puede arrancar en local y mostrar una página inicial sencilla, pero todavía no contiene funcionalidades de negocio del MVP.

La idea de esta fase es tener una base mínima y ordenada sobre la que después se podrán incorporar, de forma controlada, los módulos de clientes, proyectos, tareas, tiempos, reportes, autenticación, persistencia e IA.

## 2. Node.js

Node.js es el entorno que permite ejecutar JavaScript fuera del navegador.

En este proyecto, Node.js se usa principalmente para:

- ejecutar las herramientas de desarrollo
- instalar dependencias
- arrancar el servidor local de Next.js
- construir la aplicación para producción
- ejecutar comprobaciones como linting y typechecking

Aunque la aplicación se vea en el navegador, muchas tareas del proyecto se ejecutan antes o alrededor del navegador usando Node.js.

## 3. npm

npm es el gestor de paquetes que acompaña habitualmente a Node.js.

En este proyecto se usa para dos cosas principales:

- instalar librerías y herramientas
- ejecutar comandos definidos en `package.json`

Cuando se ejecuta un comando como:

```bash
npm run dev
```

npm busca en `package.json` qué significa `dev` y ejecuta el comando asociado.

## 4. package.json

`package.json` es uno de los ficheros centrales de un proyecto Node.js.

En este proyecto define:

- el nombre del proyecto
- la versión interna del proyecto
- los comandos disponibles
- las dependencias necesarias para ejecutar la aplicación
- las dependencias usadas durante el desarrollo

Las dependencias principales son:

- `next`
- `react`
- `react-dom`

Las dependencias de desarrollo incluyen herramientas como:

- `typescript`
- `eslint`
- tipos de TypeScript para Node.js, React y React DOM

En el `package.json` actual aparecen Next.js `^16.2.7`, React `^19.2.7` y TypeScript `^6.0.3`.

El símbolo `^` indica que npm puede instalar versiones compatibles dentro del mismo rango principal, según las reglas de versionado semántico.

## 5. package-lock.json

`package-lock.json` registra la versión exacta de cada paquete instalado y de sus dependencias internas.

Mientras `package.json` describe qué necesita el proyecto, `package-lock.json` deja constancia precisa de qué se instaló realmente.

Esto ayuda a que otras personas, otros entornos o futuras instalaciones del proyecto obtengan un resultado reproducible.

Por eso este fichero sí debe subirse a Git.

## 6. node_modules

`node_modules` es la carpeta donde npm instala físicamente las dependencias.

No se sube a Git porque:

- puede ocupar mucho espacio
- contiene miles de ficheros generados por npm
- se puede reconstruir ejecutando `npm install`
- depende del sistema y del entorno de instalación

Lo normal es subir `package.json` y `package-lock.json`, pero no `node_modules`.

Cuando otra persona clona el proyecto, ejecuta:

```bash
npm install
```

y npm vuelve a crear `node_modules`.

## 7. Next.js

Next.js es el framework principal del proyecto.

Un framework no es solo una librería: aporta una estructura de trabajo, convenciones y herramientas para construir la aplicación.

En este proyecto Next.js se encarga de:

- organizar rutas y páginas
- arrancar el servidor de desarrollo
- preparar la aplicación para producción
- integrar React
- integrar TypeScript
- gestionar parte de la configuración necesaria para una aplicación web moderna

La carpeta `src/app` indica que el proyecto usa la estructura de App Router de Next.js.

## 8. React

React es la librería que se usa para construir la interfaz de usuario.

En vez de escribir páginas HTML completas de forma manual, React permite crear componentes.

Un componente es una función que devuelve una parte de interfaz.

Por ejemplo, `src/app/page.tsx` exporta una función `Home` que devuelve el contenido visual de la página inicial.

## 9. TypeScript

TypeScript es una extensión de JavaScript que añade tipos.

Los tipos ayudan a detectar errores antes de ejecutar la aplicación.

En este proyecto TypeScript permite:

- describir mejor qué datos espera cada parte del código
- detectar errores durante el desarrollo
- trabajar con más seguridad en componentes, funciones y configuración
- tener mejor autocompletado en el editor

El fichero `tsconfig.json` define cómo debe comportarse TypeScript en el proyecto. Por ejemplo, está activado `strict`, lo que implica una comprobación de tipos más exigente.

## 10. Ficheros de configuración principales

### next.config.ts

`next.config.ts` contiene la configuración de Next.js.

Ahora mismo está prácticamente vacío:

```ts
const nextConfig = {};
```

Esto significa que el proyecto usa la configuración por defecto de Next.js. Es adecuado para esta fase inicial.

### tsconfig.json

`tsconfig.json` configura TypeScript.

Algunos puntos importantes:

- `strict: true` activa comprobaciones estrictas.
- `noEmit: true` indica que TypeScript no genera ficheros al comprobar tipos.
- `jsx: "react-jsx"` configura cómo se interpreta JSX.
- `paths` define el alias `@/*` para importar desde `src`.
- `exclude` evita revisar `node_modules`.

### eslint.config.mjs

`eslint.config.mjs` configura ESLint.

ESLint ayuda a detectar problemas de estilo, errores habituales y malas prácticas.

El proyecto usa la configuración recomendada de Next.js con `core-web-vitals`.

### next-env.d.ts

`next-env.d.ts` es un fichero generado por Next.js para que TypeScript conozca tipos propios del framework.

El propio fichero indica que no debe editarse manualmente.

## 11. src/app

`src/app` es la carpeta principal de páginas y rutas en el App Router de Next.js.

En esta fase contiene:

- `layout.tsx`
- `page.tsx`
- `globals.css`

Esto es suficiente para que la aplicación tenga una estructura raíz, una página inicial y estilos globales.

## 12. layout.tsx

`src/app/layout.tsx` define la estructura común de la aplicación.

En el proyecto actual hace tres cosas:

- importa los estilos globales desde `globals.css`
- define metadatos básicos como título y descripción
- crea el HTML base con idioma `es`

El parámetro `children` representa el contenido de la página que Next.js colocará dentro del layout.

De forma sencilla:

- `layout.tsx` es el marco común
- `page.tsx` es el contenido de la página concreta

## 13. page.tsx

`src/app/page.tsx` define la página inicial.

Actualmente muestra un panel sencillo con el texto:

```text
Proyecto tecnico base
```

y una indicación de que la aplicación Next.js del MVP arranca correctamente.

Esto sirve como prueba mínima de que el proyecto está funcionando. No representa todavía una pantalla funcional del MVP.

## 14. globals.css

`src/app/globals.css` contiene estilos globales.

En esta fase define:

- colores base
- tipografía
- estilos generales del `body`
- estilo de la página inicial
- estilo del panel de estado

Estos estilos son mínimos. Su función es dar una presentación básica a la pantalla inicial, no definir todavía el diseño completo de la aplicación.

## 15. src/modules

`src/modules` prepara la organización modular por dominios funcionales.

En fases posteriores podrían aparecer aquí módulos como:

- clientes
- proyectos
- tareas
- tiempos
- reportes

Ahora mismo no contiene lógica de negocio porque todavía no se ha aprobado ni implementado ningún dominio funcional.

Esto evita crear carpetas, clases o abstracciones antes de necesitarlas.

## 16. src/shared

`src/shared` está pensada para código compartido.

En fases posteriores podría reunir elementos reutilizables como:

- utilidades comunes
- componentes base
- validaciones compartidas
- configuración común

Actualmente no contiene lógica porque todavía no hay una necesidad real de compartir código.

Esto también ayuda a evitar sobrediseño.

## 17. Comandos npm

Los comandos del proyecto están definidos en `package.json`.

### npm install

Instala las dependencias del proyecto.

Lee `package.json` y `package-lock.json`, descarga los paquetes necesarios y crea la carpeta `node_modules`.

Se suele ejecutar después de clonar el repositorio o cuando cambian las dependencias.

### npm run dev

Ejecuta:

```bash
next dev
```

Arranca el servidor de desarrollo de Next.js.

Es el comando habitual mientras se está programando. Permite abrir la aplicación en el navegador y ver cambios durante el desarrollo.

### npm run build

Ejecuta:

```bash
next build
```

Prepara la aplicación para producción.

Comprueba y genera la versión optimizada del proyecto. Es útil para detectar problemas que quizá no aparecen durante el desarrollo.

### npm run start

Ejecuta:

```bash
next start
```

Arranca la aplicación ya construida para producción.

Normalmente se usa después de ejecutar `npm run build`.

No sustituye a `npm run dev` durante el desarrollo diario.

### npm run lint

Ejecuta:

```bash
eslint .
```

Revisa el proyecto con ESLint.

Sirve para detectar problemas de estilo, patrones incorrectos o errores habituales según la configuración del proyecto.

### npm run typecheck

Ejecuta:

```bash
tsc --noEmit
```

Comprueba los tipos de TypeScript sin generar ficheros nuevos.

Es una forma de validar que el código TypeScript es coherente antes de avanzar.

## 18. Qué queda preparado

Con este proyecto base queda preparado:

- un proyecto Next.js arrancable
- una página inicial mínima
- configuración de TypeScript
- configuración de ESLint
- comandos básicos de desarrollo y validación
- estructura inicial con `src/app`
- carpetas preparadas para módulos y código compartido
- base técnica para incorporar futuras fases del MVP

## 19. Qué no está implementado todavía

Todavía no se ha implementado:

- autenticación
- base de datos
- Prisma
- migraciones
- gestión de clientes
- gestión de proyectos
- gestión de tareas
- registro de tiempos
- start/stop de tareas
- reportes
- área de cliente
- integración de IA
- tests automatizados
- lógica de negocio
- diseño definitivo de interfaz

El proyecto actual es una base técnica inicial. Su valor está en que el entorno ya arranca y tiene una estructura mínima sobre la que seguir trabajando de forma ordenada.
