import { cookies } from "next/headers";

const FLASH_COOKIE = "flash";

export type FlashType = "info" | "success" | "warning" | "error";

export type Flash = {
  type: FlashType;
  message: string;
};

/**
 * Guarda un mensaje flash en una cookie httpOnly (no manipulable desde el
 * cliente). Se usa para mostrar un resultado tras un redirect entre páginas.
 * Debe llamarse desde una server action.
 */
export async function setFlash(type: FlashType, message: string) {
  const store = await cookies();
  store.set(FLASH_COOKIE, JSON.stringify({ type, message } satisfies Flash), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60,
  });
}

/**
 * Lee el mensaje flash actual (sin borrarlo). Apto para el render de una página.
 * El borrado se hace con `clearFlash` desde el cliente al mostrarlo.
 */
export async function readFlash(): Promise<Flash | null> {
  const raw = (await cookies()).get(FLASH_COOKIE)?.value;
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Flash;
    if (parsed && typeof parsed.message === "string") {
      return parsed;
    }
  } catch {
    // cookie corrupta: se ignora
  }

  return null;
}
