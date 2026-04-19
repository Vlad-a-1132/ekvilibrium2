"use server";

import { randomBytes } from "crypto";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

import { clearAuthCookie, getAuthTokenFromCookie, setAuthCookie } from "@/lib/auth/user";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";

const SESSION_MS = 30 * 24 * 60 * 60 * 1000;

export type AuthFormState = { error?: string } | undefined;

async function createSessionForUser(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MS);
  await prisma.userSession.create({
    data: { userId, token, expiresAt },
  });
  await setAuthCookie(token);
}

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/account";
  return raw;
}

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!firstName || !lastName) {
    return { error: "Укажите имя и фамилию." };
  }
  if (!email.includes("@")) {
    return { error: "Укажите корректный email." };
  }
  if (password.length < 8) {
    return { error: "Пароль не короче 8 символов." };
  }
  if (password !== confirm) {
    return { error: "Пароли не совпадают." };
  }

  const passwordHash = await hashPassword(password);
  const fullName = `${firstName} ${lastName}`.trim();

  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: "USER",
      },
    });
    await createSessionForUser(user.id);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "Пользователь с таким email уже есть." };
    }
    return { error: "Не удалось зарегистрироваться. Попробуйте позже." };
  }

  redirect("/account");
}


export async function loginAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextRaw = String(formData.get("next") ?? "").trim();

  if (!email || !password) {
    return { error: "Введите email и пароль." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Неверный email или пароль." };
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return { error: "Неверный email или пароль." };
  }

  await createSessionForUser(user.id);

  redirect(safeNextPath(nextRaw.length > 0 ? nextRaw : null));
}

export async function logoutAction() {
  const token = await getAuthTokenFromCookie();
  if (token) {
    try {
      await prisma.userSession.deleteMany({ where: { token } });
    } catch {
      /* ignore */
    }
  }
  await clearAuthCookie();
  redirect("/");
}
