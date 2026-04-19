import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { noIndexMetadata } from "@/lib/seo/private-pages";

export const metadata: Metadata = noIndexMetadata(
  "Вход в аккаунт",
  "Вход для покупателей интернет-магазина «Эквилибриум». Служебная страница не индексируется.",
);

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

function safeNext(raw: string | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "";
  return raw;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const sp = await searchParams;
  const nextPath = safeNext(sp.next);

  return (
    <div className="py-12 md:py-16">
      <nav className="text-sm text-[#403A34]/55">
        <Link href="/" className="hover:text-[#403A34]">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#403A34]">Вход</span>
      </nav>
      <h1 className="mt-6 font-serif text-3xl text-[#403A34] md:text-4xl">Вход</h1>
      <p className="mt-2 max-w-md text-sm text-[#403A34]/70">Войдите по email и паролю.</p>

      <div className="mx-auto mt-10 max-w-md">
        <LoginForm nextPath={nextPath} />
      </div>
    </div>
  );
}
