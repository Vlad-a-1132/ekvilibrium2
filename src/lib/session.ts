import { randomUUID } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "eq_session";

const cookieOptions = {
  httpOnly: true as const,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

/** Только чтение — для RSC и getCart/getWishlist без побочных эффектов. */
export async function getSessionId(): Promise<string | null> {
  const jar = await cookies();
  const v = jar.get(SESSION_COOKIE)?.value;
  return v && v.length >= 8 ? v : null;
}

/**
 * Гарантирует наличие sessionId и cookie (вызывать из server actions).
 */
export async function ensureSessionId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(SESSION_COOKIE)?.value;
  if (existing && existing.length >= 8) return existing;
  const id = randomUUID();
  jar.set(SESSION_COOKIE, id, cookieOptions);
  return id;
}
