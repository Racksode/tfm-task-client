# Guia de entorno VSCode para Windows y macOS

## 1. Objetivo

Esta guia explica como preparar Visual Studio Code de forma equivalente en Windows y macOS para trabajar en este TFM y en futuros proyectos similares.

El objetivo no es obligar a usar una configuracion concreta, sino tener una referencia clara para que el entorno de desarrollo sea coherente en ambos sistemas.

El proyecto usa:

- Next.js
- React
- TypeScript
- npm
- Prisma
- PostgreSQL mediante Docker Compose
- Git y GitHub
- documentacion Markdown

Por eso interesa que VSCode tenga soporte adecuado para TypeScript, linting, Prisma, Docker, Git y Markdown.

## 2. Requisitos previos

Antes de configurar VSCode, conviene tener instalados:

- Git.
- Node.js LTS.
- npm, incluido con Node.js.
- Visual Studio Code.
- Docker Desktop, solo si se trabaja con persistencia local mediante PostgreSQL.

Una vez clonado el repositorio, las dependencias del proyecto se instalan con:

```bash
npm install
```

Este comando se documenta aqui como parte del checklist, pero no depende de ninguna extension de VSCode.

## 3. Extensiones recomendadas

Las extensiones recomendadas para este proyecto son:

- ESLint.
- Prettier.
- Prisma.
- Docker.
- GitHub Pull Requests.

Estas extensiones ayudan a trabajar con el stack del proyecto, pero no sustituyen las validaciones reales por terminal.

Por ejemplo, aunque ESLint marque errores en el editor, la validacion final sigue siendo:

```bash
npm run lint
```

## 4. Extensiones opcionales

Tambien pueden ser utiles:

- GitLens, para inspeccionar historial Git con mas contexto.
- Markdown All in One, para trabajar con documentacion Markdown.
- Error Lens, para ver errores de forma mas visible dentro del editor.

Son opcionales. No son necesarias para que el proyecto compile.

## 5. Extensiones pendientes o no obligatorias

No es necesario instalar todavia:

- agentes IA dentro de VSCode
- extensiones especificas de Playwright

Los agentes IA pueden ser utiles como apoyo, pero el proyecto no debe depender de ellos para compilar, validarse o ejecutarse.

Las extensiones de Playwright pueden aplazarse mientras Playwright siga fuera del alcance inmediato del MVP.

## 6. Comprobar extensiones instaladas

VSCode permite listar extensiones desde terminal:

```bash
code --list-extensions
```

Este comando sirve para comparar rapidamente el entorno de Windows y macOS.

Si se quiere guardar una lista de referencia, conviene revisarla antes para evitar incluir extensiones personales que no aporten valor al proyecto.

## 7. Instalar extensiones desde terminal

Una extension puede instalarse con:

```bash
code --install-extension <extension-id>
```

Por ejemplo, el formato general seria:

```bash
code --install-extension editor.extension
```

Antes de incorporar una extension al flujo habitual del proyecto, conviene comprobar:

- que aporta valor real
- que no introduce configuracion innecesaria
- que se puede usar igual en Windows y macOS
- que no sustituye las validaciones por terminal

## 8. Diferencias entre Windows y macOS

### Terminal

En Windows es habitual trabajar con PowerShell.

En macOS es habitual trabajar con zsh o bash.

La mayoria de comandos npm son iguales en ambos sistemas:

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

Pero algunos comandos del sistema cambian.

### Rutas de archivos

En Windows las rutas suelen verse asi:

```text
D:\03 - Webs\10 - TFM
```

En macOS suelen verse asi:

```text
/Users/usuario/proyectos/tfm-task-client
```

Dentro de la documentacion del proyecto conviene usar rutas relativas cuando sea posible, por ejemplo:

```text
docs/notas/
prisma/schema.prisma
```

### Copiar `.env`

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

En macOS o Linux:

```bash
cp .env.example .env
```

El archivo `.env` es local y no debe versionarse.

### Permisos

En macOS pueden aparecer diferencias de permisos si se copian carpetas desde otro usuario o si se trabaja con discos externos.

En Windows pueden aparecer avisos de permisos o propiedad del repositorio en Git si el repositorio se abre con un usuario distinto al que lo creo.

Cuando ocurra, conviene resolver el problema de entorno sin modificar codigo del proyecto.

### Finales de linea

Windows y macOS pueden manejar finales de linea de forma distinta.

Para evitar cambios innecesarios, conviene mantener una configuracion consistente y respetar los archivos de configuracion del repositorio, como `.editorconfig` y `.gitattributes` si estan presentes.

## 9. Configuracion recomendada de VSCode

La configuracion puede mantenerse sencilla.

Aspectos recomendables:

- activar formato al guardar solo si el formateador esta claro para el proyecto
- usar ESLint para detectar problemas en TypeScript y React
- dejar que VSCode use la version de TypeScript del proyecto cuando proceda
- usar la terminal integrada para ejecutar comandos npm
- mantener finales de linea consistentes

No es necesario crear configuraciones nuevas de VSCode si el proyecto ya funciona correctamente.

La configuracion del editor debe ayudar al desarrollo, no convertirse en una dependencia imprescindible.

## 10. Checklist de validacion del entorno

Para comprobar una maquina nueva, revisar:

```bash
node -v
npm -v
git --version
code --version
```

Despues, desde la raiz del proyecto:

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

Si se trabaja con persistencia local, comprobar tambien Docker Desktop y seguir la guia de entorno local con Docker, PostgreSQL y Prisma.

## 11. Buenas practicas

Mantener Windows y macOS lo mas equivalentes posible ayuda a reducir errores dificiles de explicar.

Buenas practicas:

- no instalar extensiones innecesarias
- revisar extensiones antes de incorporarlas al flujo habitual
- no depender de extensiones IA para compilar o validar el proyecto
- no depender de configuraciones locales que otros entornos no tienen
- documentar cambios relevantes del entorno
- ejecutar las validaciones por terminal antes de dar una fase por cerrada

## 12. Resumen

VSCode debe ser una herramienta de apoyo, no una fuente de verdad del proyecto.

La fuente de verdad sigue siendo:

- el codigo del repositorio
- la documentacion versionada
- los scripts npm
- las validaciones por terminal

Con una configuracion prudente y similar en Windows y macOS, el proyecto resulta mas facil de mantener, revisar y defender.
