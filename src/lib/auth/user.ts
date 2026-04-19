import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import type { User, UserRole } from "@prisma/client";

import { AUTH_COOKIE, AUTH_COOKIE_MAX_AGE_SEC } from "./constants";

export type SessionUser = Pick<User, "id" | "email" | "fullName" | "phone" | "role">;

export async function getAuthTokenFromCookie(): Promise<string | null> {
  const jar = await cookies();
  const v = jar.get(AUTH_COOKIE)?.value;
  return v && v.length >= 16 ? v : null;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = await getAuthTokenFromCookie();
  if (!token) return null;

  try {
    const session = await prisma.userSession.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            role: true,
          },
        },
      },
    });
    return session?.user ?? null;
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");
  return user;
}

/**
 * Доступ по роли `ADMIN` в учётной записи покупателя (cookie `eq_auth`).
 * Панель `/admin` с env-логином использует `requireAdminAuth` из `@/lib/auth/admin`.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/");
  return user;
}

export function roleLabel(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "Администратор";
    default:
      return "Покупатель";
  }
}

/** Выставить httpOnly cookie с токеном сессии. */
export async function setAuthCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE_SEC,
  });
}

export async function clearAuthCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
