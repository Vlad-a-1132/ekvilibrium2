"use server";

import { redirect } from "next/navigation";

import {
  clearAdminSession,
  createAdminSession,
  validateAdminCredentials,
} from "@/lib/auth/admin";

export type AdminLoginState = { error?: string } | null;

export async function loginAdminAction(
  _prev: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const login = String(formData.get("login") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!login.trim() || !password) {
    return { error: "Введите логин и пароль." };
  }

  const loginConfigured = (process.env.ADMIN_PANEL_LOGIN ?? "").trim();
  const passConfigured = (process.env.ADMIN_PANEL_PASSWORD ?? "").trim();
  if (!loginConfigured || !passConfigured) {
    return { error: "Вход в админку не настроен на сервере." };
  }

  if (!validateAdminCredentials(login, password)) {
    return { error: "Неверный логин или пароль." };
  }

  await createAdminSession();
  redirect("/admin/orders");
}

export async function logoutAdminAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}
