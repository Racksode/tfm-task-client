# Histórico IA - Bootstrap controlado del primer usuario

## Estado

Plan aprobado y aplicado.

## Resumen del prompt

El usuario solicitó dividir la Fase 2 de usuarios mínimos.

La Fase 2A debía crear un mecanismo local y controlado para generar el primer usuario autenticable `INTERNAL` con `passwordHash`, sin abrir rutas públicas ni crear todavía el CRUD de usuarios.

## Restricciones indicadas

El usuario indicó expresamente:

- no abrir `/users` públicamente;
- no crear endpoint público;
- no crear pantalla de bootstrap;
- no crear seeds automáticos;
- no crear CRUD de usuarios;
- no introducir `ADMIN` ni `MEMBER`;
- crear el primer usuario como `INTERNAL` y `ACTIVE`;
- usar `bcryptjs.hash`;
- no guardar ni imprimir contraseña en claro;
- no imprimir el hash;
- abortar si ya existe algún usuario `INTERNAL`;
- no modificar `prisma/schema.prisma` ni migraciones;
- no añadir dependencias nuevas;
- no tocar README, ADRs, CI, Docker Compose ni configuración de Auth.

## Plan aprobado

Se aprobó:

- crear `scripts/bootstrap-first-user.mjs`;
- añadir el comando npm `bootstrap:first-user`;
- crear `docs/notas/15-explicacion-bootstrap-primer-usuario.md`;
- crear `docs/planes/12-bootstrap-primer-usuario.md`;
- crear este histórico ampliado.

## Resultado

Se añadió un script local que lee variables de entorno, valida los datos mínimos, comprueba que no exista ya un usuario `INTERNAL`, genera `passwordHash` con `bcryptjs.hash` y crea un usuario `INTERNAL` y `ACTIVE`.

El script no imprime la contraseña ni el hash.

No se creó ruta pública, endpoint público, pantalla, seed automático, CRUD de usuarios, roles nuevos ni permisos avanzados.

## Validación prevista

```text
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

## Commit o PR previsto

```text
feat: añadir bootstrap controlado del primer usuario
```
