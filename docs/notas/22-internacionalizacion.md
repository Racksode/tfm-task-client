# Internacionalización (i18n) — enfoque

> Nota de diseño del TFM. **No implementado**; documenta cómo abordaríamos el multiidioma cuando proceda.

## Objetivo

Preparar la app para varios idiomas (español por defecto; inglés como primer idioma adicional), sin rehacer pantallas cuando se implemente.

## Qué se traduce y qué no

- **Sí (cadenas de UI estáticas)**: navegación, títulos, descripciones, botones, etiquetas de formularios, mensajes/alertas, validaciones, textos de ayuda, footer.
- **Estados/enumerados**: `ACTIVE/INACTIVE`, `INTERNAL/CLIENT`, estados de tarea, etc. se mapean a etiquetas traducibles (no se muestran los valores crudos del enum).
- **No (contenido de datos)**: nombres de usuarios/clientes, descripciones introducidas por el usuario, etc. No se traducen.

## Enfoque propuesto

- Librería: **`next-intl`** (i18n idiomática para el App Router de Next).
- **Catálogos de mensajes** por idioma: `messages/es.json`, `messages/en.json`, con claves por dominio (`nav.*`, `users.*`, `common.*`, `validation.*`, `status.*`).
- **Provider** de i18n en el layout y hook `useTranslations` (o `getTranslations` en server components) para resolver claves.
- **Selección de idioma**: a decidir entre routing por subpath (`/es`, `/en`) o por **cookie/preferencia de usuario**; persistir la preferencia (cookie y, si procede, campo en `User`).

## Decisiones pendientes (cuando se implemente)

- Estrategia de routing (subpath vs cookie) y persistencia de la preferencia.
- Idiomas iniciales (ES, EN) y fallback.
- Traducción de correos/plantillas (cuando existan).
- Formateo de fechas/números por locale (`Intl`).

## Plan de implementación

1. Cerrar el "mapa" de pantallas/strings (ya en curso con la documentación funcional).
2. Instalar y configurar `next-intl`; crear catálogos base ES y extraer las cadenas existentes a claves.
3. Migrar componentes a `useTranslations`/`getTranslations`.
4. Mapear enumerados a etiquetas traducibles.
5. Añadir el segundo idioma (EN) y el selector.

## Recomendación de momento

Conviene **decidir e implementar i18n relativamente pronto** (antes de acumular muchos módulos con texto incrustado) o asumir un refactor de extracción de cadenas más adelante. De momento queda documentado; la implementación se planificará como fase propia.
