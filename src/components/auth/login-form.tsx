"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginAction, type AuthFormState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginFormProps = {
  nextPath: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, undefined as AuthFormState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />
      {state?.error && (
        <p className="rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-900/90" role="alert">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="login-email" className="text-sm font-medium text-[#403A34]">
          Email
        </label>
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1.5 rounded-xl border-[#403A34]/15"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="text-sm font-medium text-[#403A34]">
          Пароль
        </label>
        <Input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 rounded-xl border-[#403A34]/15"
        />
      </div>
      <Button type="submit" disabled={pending} className="w-full rounded-xl">
        {pending ? "Вход…" : "Войти"}
      </Button>
      <p className="text-center text-sm text-[#403A34]/65">
        Нет аккаунта?{" "}
        <Link href="/register" className="font-medium text-[#403A34] underline-offset-4 hover:underline">
          Регистрация
        </Link>
      </p>
    </form>
  );
}
