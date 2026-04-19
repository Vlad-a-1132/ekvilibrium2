import Link from "next/link";

import { CartClient } from "@/components/cart/cart-client";
import { getCurrentUser } from "@/lib/auth/user";
import { getCart } from "@/lib/queries/cart";

export default async function CartPage() {
  const [data, user] = await Promise.all([getCart(), getCurrentUser()]);
  const canCheckout = Boolean(user) && data.lines.length > 0;

  return (
    <div className="py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[#403A34]">Корзина</h1>
          <p className="mt-2 text-sm text-[#403A34]/70">
            Позиции привязаны к браузеру через cookie-сессию. Оформление заказа — для{" "}
            <Link href="/login" className="font-medium underline-offset-4 hover:underline">
              вошедших
            </Link>{" "}
            пользователей.
          </p>
        </div>
        <Link
          href="/wishlist"
          className="text-sm text-[#403A34]/80 underline-offset-4 hover:underline"
        >
          Избранное
        </Link>
      </div>

      <CartClient initial={data} canCheckout={canCheckout} isLoggedIn={Boolean(user)} />
    </div>
  );
}
