"use client";

import { useActionState } from "react";

import { loginAdminAction, type AdminLoginState } from "@/lib/actions/admin-panel-auth";

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdminAction, null as AdminLoginState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="admin-login" className="block text-xs font-semibold uppercase tracking-wider text-[#403A34]/55">
          Логин
        </label>
        <input
          id="admin-login"
          name="login"
          type="text"
          inputMode="text"
          autoComplete="username"
          autoCapitalize="off"
          spellCheck={false}
          required
          className="mt-1.5 w-full rounded-xl border border-[#403A34]/15 bg-white px-3.5 py-2.5 text-sm text-[#403A34] shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-[#403A34]/35 focus:border-[#403A34]/30 focus:ring-2 focus:ring-[#403A34]/12"
          placeholder=""
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="block text-xs font-semibold uppercase tracking-wider text-[#403A34]/55">
          Пароль
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 w-full rounded-xl border border-[#403A34]/15 bg-white px-3.5 py-2.5 text-sm text-[#403A34] shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-[#403A34]/35 focus:border-[#403A34]/30 focus:ring-2 focus:ring-[#403A34]/12"
          placeholder=""
        />
      </div>
      {state?.error ? (
        <p className="rounded-lg border border-red-200/80 bg-red-50/90 px-3 py-2 text-sm text-red-900" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-xl border border-[#403A34]/20 bg-[#403A34] px-4 py-3 text-sm font-medium text-[#f6f1eb] shadow-sm transition-colors hover:bg-[#403A34]/90 disabled:opacity-60"
      >
        {pending ? "Вход…" : "Войти"}
      </button>
    </form>
  );
}
