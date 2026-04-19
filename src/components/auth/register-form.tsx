"use client";

import Link from "next/link";
import { useActionState } from "react";

import { registerAction, type AuthFormState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, undefined as AuthFormState);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <p className="rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-900/90" role="alert">
          {state.error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-first" className="text-sm font-medium text-[#403A34]">
            Имя
          </label>
          <Input
            id="reg-first"
            name="firstName"
            autoComplete="given-name"
            required
            className="mt-1.5 rounded-xl border-[#403A34]/15"
          />
        </div>
        <div>
          <label htmlFor="reg-last" className="text-sm font-medium text-[#403A34]">
            Фамилия
          </label>
          <Input
            id="reg-last"
            name="lastName"
            autoComplete="family-name"
            required
            className="mt-1.5 rounded-xl border-[#403A34]/15"
          />
        </div>
      </div>
      <div>
        <label htmlFor="reg-email" className="text-sm font-medium text-[#403A34]">
          Email
        </label>
        <Input
          id="reg-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1.5 rounded-xl border-[#403A34]/15"
        />
      </div>
      <div>
        <label htmlFor="reg-password" className="text-sm font-medium text-[#403A34]">
          Пароль
        </label>
        <Input
          id="reg-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="mt-1.5 rounded-xl border-[#403A34]/15"
        />
        <p className="mt-1 text-xs text-[#403A34]/50">Не менее 8 символов.</p>
      </div>
      <div>
        <label htmlFor="reg-confirm" className="text-sm font-medium text-[#403A34]">
          Подтверждение пароля
        </label>
        <Input
          id="reg-confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          className="mt-1.5 rounded-xl border-[#403A34]/15"
        />
      </div>
      <Button type="submit" disabled={pending} className="w-full rounded-xl">
        {pending ? "Регистрация…" : "Зарегистрироваться"}
      </Button>
      <p className="text-center text-sm text-[#403A34]/65">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-medium text-[#403A34] underline-offset-4 hover:underline">
          Войти
        </Link>
      </p>
    </form>
  );
}
