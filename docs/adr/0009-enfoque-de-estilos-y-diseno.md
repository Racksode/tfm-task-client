# ADR 0009 - Enfoque de estilos y diseno de interfaz

## Estado

Aceptada.

## Contexto

Hasta ahora la interfaz se ha construido con CSS propio minimo y unos pocos componentes a medida (`src/components`). Antes de seguir implementando pantallas (rework de login y usuarios, y modulos siguientes) conviene fijar el enfoque de estilos y una base de diseno coherente, ya que todo lo que se construya a partir de ahora la heredara.

Se dispone de capturas de referencia de un CRM existente que orientan el estilo visual deseado (estructura tipo panel de administracion, tarjetas, tablas con acciones y badges de estado, formularios a dos columnas). El proyecto todavia no tiene nombre ni logotipo definitivos.

El objetivo del usuario es obtener un resultado limpio y profesional con poco esfuerzo de diseno, manteniendo el alcance de un MVP y sin sobredisenar.

## Decision

Se adopta **Tailwind CSS + shadcn/ui** (componentes accesibles sobre Radix) como enfoque de estilos, con una direccion visual sobria y sistematizada documentada en `docs/14-guia-de-diseno.md`.

Puntos clave:

- **Design tokens** mediante variables CSS (convencion de shadcn): color, tipografia, espaciado, radios y sombras centralizados, de modo que la paleta sea facil de ajustar sin tocar componentes.
- **Paleta**: superficies neutras (escala slate), un acento primario teal/verde (color principal de accion), navegacion sobre fondo oscuro y colores semanticos (verde, ambar, rojo, azul) reservados a estados (badges y alertas) y acciones destructivas.
- **Layout**: shell con barra de navegacion lateral, barra superior y contenido en tarjetas. La posicion de la navegacion y la paleta son ajustables via tokens y un unico componente de layout.
- Los componentes de shadcn se copian al repositorio: son codigo propio, revisable y defendible, no una dependencia opaca.

## Alternativas valoradas

### CSS propio con design tokens

Continuar con CSS a medida y variables.

- Ventajas: sin dependencias nuevas, control total, narrativa "hecho a mano".
- Inconvenientes: mas esfuerzo manual, mayor riesgo de inconsistencia visual, sin componentes accesibles listos.

No se selecciona por el coste de esfuerzo y el riesgo de acabado irregular.

### Tailwind CSS sin libreria de componentes

Utilidades CSS, construyendo los componentes a mano.

- Ventajas: estandar, rapido, coherente.
- Inconvenientes: hay que construir y mantener cada componente (incluida la accesibilidad).

Es la base elegida, pero complementada con shadcn/ui para no rehacer componentes.

### Biblioteca de componentes pesada (por ejemplo MUI)

- Ventajas: muchos componentes listos.
- Inconvenientes: mas pesada y opinionada, estilo propio dificil de neutralizar, mayor dependencia.

No se selecciona.

## Consecuencias

- Se anadiran Tailwind CSS y shadcn/ui (con Radix) como dependencias y configuracion.
- Los componentes actuales (`Button`, `Input`, `Select`, `Alert`, `Badge`, `DataTable`, layout) se reconstruiran con shadcn; es buen momento al rehacer login y usuarios.
- La paleta y la posicion de la navegacion quedan parametrizadas y se pueden ajustar iterando en el navegador, sin rehacer pantallas.
- La instalacion y configuracion de Tailwind/shadcn se tratara como una fase de implementacion propia, previa al rework de login y usuarios.
- Quedan fuera: modo oscuro, theming avanzado, sistema de diseno completo y maquetacion final pixel a pixel.
