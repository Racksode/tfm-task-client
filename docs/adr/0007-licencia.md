# ADR 0007 - Licencia del proyecto

## Estado

Aceptada.

## Contexto

El proyecto es un Trabajo Final de Master que se plantea, ademas, como base de un posible producto SaaS comercializable.

Hasta ahora habia una incoherencia: el README indicaba la licencia como pendiente, mientras que package.json declaraba ISC.

Era necesario fijar una licencia coherente que cumpliese estos objetivos del autor:

- permitir el uso no comercial de forma gratuita
- exigir una contraprestacion para el uso comercial
- conservar la atribucion al autor y un enlace al proyecto
- mantener abierta la posibilidad de un modelo comercial futuro

Un punto importante es que las licencias open source permisivas habituales no permiten restringir el uso comercial, por lo que no encajan con el objetivo de monetizacion.

## Decision

Se adopta un modelo de **licencia dual**:

- **AGPL-3.0** como licencia open source por defecto (`LICENSE`).
- **Licencia comercial** de pago para usos que no quieran asumir las obligaciones de copyleft de la AGPL (`COMMERCIAL-LICENSE.md`).

En consecuencia:

- `package.json` declara `AGPL-3.0-only`.
- El uso bajo AGPL es gratuito; el uso comercial sin copyleft requiere licencia comercial.
- Se solicita mantener la atribucion al autor y un enlace al proyecto en los creditos.

La AGPL aporta copyleft fuerte: quien ofrezca como servicio en red una version modificada debe poner a disposicion el codigo fuente correspondiente. Esto actua como palanca para que el uso comercial cerrado opte por la licencia comercial.

## Alternativas valoradas

### AGPL-3.0 mas licencia comercial

Licencia open source copyleft fuerte combinada con una licencia comercial de pago.

Ventajas:

- es open source reconocida, con valor para la defensa academica
- el copyleft de red incentiva la compra de licencia comercial para uso cerrado
- conserva la atribucion mediante el propio copyleft
- mantiene abierta la via de monetizacion futura
- como titular del copyright, se puede relicenciar a una licencia mas abierta en el futuro

Inconvenientes:

- el copyleft puede disuadir a algunas empresas de cualquier uso
- gestionar la licencia comercial exige definir condiciones y contacto

Es la opcion seleccionada.

### Licencia permisiva (MIT o Apache-2.0)

Permitiria cualquier uso, incluido comercial, conservando la atribucion.

Ventajas:

- maxima difusion y simplicidad
- Apache-2.0 ademas incluye concesion explicita de patentes

Inconvenientes:

- no permite reservar el uso comercial
- no encaja con el objetivo de monetizacion
- es practicamente irreversible una vez publicada

No se selecciona.

### Source-available no comercial (PolyForm Noncommercial)

Permitiria uso y modificacion solo para fines no comerciales, con licencia comercial aparte.

Ventajas:

- control directo de la monetizacion
- uso no comercial gratuito

Inconvenientes:

- no es open source segun la definicion OSI, lo que resta valor a la narrativa open source del TFM
- menor reconocimiento que una licencia OSI consolidada

No se selecciona, aunque encajaria si la prioridad fuese el control total de la monetizacion frente a la etiqueta open source.

### Propietario (todos los derechos reservados)

No concederia ningun permiso sin autorizacion expresa.

Inconvenientes:

- impediria incluso el uso no comercial gratuito buscado
- nula difusion

No se selecciona.

## Consecuencias

- El repositorio incluye `LICENSE` (AGPL-3.0) y `COMMERCIAL-LICENSE.md` (modelo dual y contacto).
- `package.json` queda como `AGPL-3.0-only` y el README documenta el modelo de licencia.
- Para uso comercial cerrado, los interesados deberan adquirir la licencia comercial.
- El requisito de enlace en creditos forma parte de las condiciones de la licencia comercial; bajo AGPL se solicita como cortesia y se conservan los avisos de copyright, ya que la AGPL no permite imponer restricciones adicionales.
- Queda como posible mejora futura anadir cabeceras de licencia en los ficheros fuente.
