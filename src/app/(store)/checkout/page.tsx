import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getCurrentUser } from "@/lib/auth/user";
import { noIndexMetadata } from "@/lib/seo/private-pages";
import { getCart, normalizeCartData } from "@/lib/queries/cart";

export const metadata: Metadata = noIndexMetadata(
  "Оформление заказа",
  "Оформление заказа в «Эквилибриум». Персональная страница оформления не предназначена для индексации.",
);

type CheckoutPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/checkout");
  }

  const cart = normalizeCartData(await getCart());
  if (cart.lines.length === 0) {
    redirect("/cart");
  }

  const sp = await searchParams;
  const errorMessage = typeof sp.error === "string" && sp.error.length > 0 ? sp.error : null;

  return (
    <div className="py-10 md:py-14">
      <nav className="text-sm text-[#403A34]/55">
        <Link href="/" className="hover:text-[#403A34]">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <Link href="/cart" className="hover:text-[#403A34]">
          Корзина
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#403A34]">Оформление</span>
      </nav>
      <h1 className="mt-6 font-serif text-3xl text-[#403A34] md:text-4xl">Оформление заказа</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#403A34]/72">
        Проверьте состав заказа и укажите контактный телефон. После оформления мы свяжемся с вами для
        подтверждения.
      </p>

      <div className="mt-10">
        <CheckoutForm user={user} cart={cart} errorMessage={errorMessage} />
      </div>
    </div>
  );
}
