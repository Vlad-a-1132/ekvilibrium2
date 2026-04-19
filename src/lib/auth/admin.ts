import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/** Отдельно от `eq_auth` (пользователь магазина) и `eq_session` (корзина). */
export const ADMIN_SESSION_COOKIE = "eq_admin_session";

const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 дней

const cookieBase = {
  httpOnly: true as const,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

type AdminTokenPayload = {
  v: 1;
  /** unix seconds */
  exp: number;
};

function adminEnvLogin(): string {
  return (process.env.ADMIN_PANEL_LOGIN ?? "").trim();
}

function adminEnvPassword(): string {
  return (process.env.ADMIN_PANEL_PASSWORD ?? "").trim();
}

function getSigningSecret(): string {
  const login = adminEnvLogin();
  const pass = adminEnvPassword();
  if (!login || !pass) return "";
  return createHash("sha256")
    .update(`eq-admin-panel-v1:${login}:${pass}`)
    .digest("hex");
}

function signPayload(payload: AdminTokenPayload): string {
  const secret = getSigningSecret();
  if (!secret) return "";
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifyToken(token: string): boolean {
  const secret = getSigningSecret();
  if (!secret) return false;
  const dot = token.indexOf(".");
  if (dot < 1) return false;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!body || !sig) return false;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;
  try {
    const raw = Buffer.from(body, "base64url").toString("utf8");
    const payload = JSON.parse(raw) as AdminTokenPayload;
    if (payload.v !== 1) return false;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) return false;
    return true;
  } catch {
    return false;
  }
}

function hashEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a, "utf8").digest();
  const hb = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(ha, hb);
}

/** Проверка логина/пароля из env (без утечки в ответ). */
export function validateAdminCredentials(login: string, password: string): boolean {
  const expectedLogin = adminEnvLogin();
  const expectedPassword = adminEnvPassword();
  if (!expectedLogin || !expectedPassword) return false;
  return hashEqual(login.trim(), expectedLogin) && hashEqual(password, expectedPassword);
}

export async function createAdminSession(): Promise<void> {
  const secret = getSigningSecret();
  if (!secret) return;
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const token = signPayload({ v: 1, exp });
  if (!token) return;
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, token, {
    ...cookieBase,
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, "", {
    ...cookieBase,
    maxAge: 0,
  });
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const raw = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!raw || raw.length < 16) return false;
  return verifyToken(raw);
}

export async function requireAdminAuth(): Promise<void> {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");
}
