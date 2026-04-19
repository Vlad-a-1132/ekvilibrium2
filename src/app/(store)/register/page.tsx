import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "@/components/auth/register-form";
import { noIndexMetadata } from "@/lib/seo/private-pages";

export const metadata: Metadata = noIndexMetadata(
  "Регистрация",
  "Создание аккаунта покупателя «Эквилибриум». Страница не индексируется поисковиками.",
);

export default function RegisterPage() {
  return (
    <div className="py-12 md:py-16">
      <nav className="text-sm text-[#403A34]/55">
        <Link href="/" className="hover:text-[#403A34]">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#403A34]">Регистрация</span>
      </nav>
      <h1 className="mt-6 font-serif text-3xl text-[#403A34] md:text-4xl">Регистрация</h1>
      <p className="mt-2 max-w-md text-sm text-[#403A34]/70">Создайте аккаунт покупателя.</p>

      <div className="mx-auto mt-10 max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
