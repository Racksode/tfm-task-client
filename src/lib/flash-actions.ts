"use server";

import { cookies } from "next/headers";

/** Borra la cookie flash. Se invoca desde el cliente al mostrar el mensaje. */
export async function clearFlash() {
  (await cookies()).delete("flash");
}
