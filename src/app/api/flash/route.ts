import { cookies } from "next/headers";

/**
 * Borra la cookie del flash. Se invoca con `fetch` desde el cliente al mostrar
 * el aviso (lectura única). Es un route handler en lugar de una server action
 * para no provocar un refresh del servidor que ocultaría el aviso.
 */
export async function DELETE() {
  (await cookies()).delete("flash");
  return new Response(null, { status: 204 });
}
