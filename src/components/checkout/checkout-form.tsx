import Link from "next/link";

import type { SessionUser } from "@/lib/auth/user";
import type { CartData } from "@/lib/queries/cart";

export type CheckoutFormProps = {
  user: SessionUser;
  cart: CartData;
  errorMessage?: string | null;
};

function formatRub(value: number): string {
  return value.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  });
}

/** Серверный компонент: обычный POST на /api/checkout, без server actions и без клиентских хуков. */
export function CheckoutForm({ user, cart, errorMessage }: CheckoutFormProps) {
  const lines = Array.isArray(cart?.lines) ? cart.lines : [];

  let subtotal: number;
  if (typeof cart?.subtotal === "number" && Number.isFinite(cart.subtotal)) {
    subtotal = cart.subtotal;
  } else {
    subtotal = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      subtotal += line.price * line.quantity;
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <form
        method="POST"
        action="/api/checkout"
        className="space-y-6 rounded-3xl border border-[#403A34]/10 bg-white/80 p-6 shadow-[0_16px_48px_-28px_rgba(64,58,52,0.3)] md:p-8"
      >
        <div>
          <h2 className="font-serif text-xl text-[#403A34]">Покупатель</h2>
          <p className="mt-2 text-sm text-[#403A34]/70">
            {user.fullName} · {user.email}
          </p>
        </div>

        {errorMessage ? (
          <p className="rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-900/90" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div>
          <label htmlFor="checkout-phone" className="text-sm font-medium text-[#403A34]">
            Телефон для связи <span className="text-red-800">*</span>
          </label>
          <input
            id="checkout-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            defaultValue={user.phone ?? ""}
            placeholder="+7 (900) 000-00-00"
            className="mt-1.5 flex h-10 w-full rounded-xl border border-[#403A34]/20 bg-white px-3 py-2 text-sm text-[#403A34] shadow-sm placeholder:text-[#403A34]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403A34]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1eb]"
          />
          <p className="mt-1.5 text-xs text-[#403A34]/55">
            Пожалуйста, укажите номер телефона для подтверждения заказа.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-[#403A34] px-8 text-sm font-medium text-[#f6f1eb] transition-colors hover:bg-[#2f2a25]"
        >
          Оформить заказ
        </button>
      </form>

      <aside className="h-fit rounded-3xl border border-[#403A34]/10 bg-[#fbf8f4] p-6">
        <h3 className="font-serif text-lg text-[#403A34]">Ваш заказ</h3>

        {lines.length === 0 ? (
          <p className="mt-4 text-sm text-[#403A34]/65">Корзина пуста — добавьте товары, чтобы оформить заказ.</p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((line) => (
              <li key={line.cartItemId} className="flex justify-between gap-4 text-[#403A34]/85">
                <span className="min-w-0">
                  {line.name} × {line.quantity}
                </span>
                <span className="shrink-0 tabular-nums">{formatRub(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 border-t border-[#403A34]/10 pt-4 font-serif text-xl text-[#403A34]">
          Итого: {formatRub(subtotal)}
        </p>

        <Link
          href="/cart"
          className="mt-4 inline-block text-sm text-[#403A34]/75 underline-offset-4 hover:underline"
        >
          ← В корзину
        </Link>
      </aside>
    </div>
  );
}
