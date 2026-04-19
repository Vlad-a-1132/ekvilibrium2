"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { removeFromCart, updateCartQuantity } from "@/lib/actions/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CartData } from "@/lib/queries/cart";

type CartClientProps = {
  initial: CartData;
  canCheckout: boolean;
  isLoggedIn: boolean;
};

export function CartClient({ initial, canCheckout, isLoggedIn }: CartClientProps) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  async function run(productId: string, fn: () => Promise<unknown>) {
    setPending(productId);
    try {
      await fn();
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  if (initial.lines.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-[#403A34]/10 bg-[#fbf8f4] px-8 py-14 text-center">
        <p className="font-serif text-lg text-[#403A34]">Корзина пуста</p>
        <p className="mt-2 text-sm text-[#403A34]/65">Добавьте товары из каталога.</p>
        <Button asChild className="mt-6">
          <Link href="/">На главную</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-6">
      <ul className="space-y-4">
        {initial.lines.map((line, index) => (
          <motion.li
            key={line.cartItemId}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="flex flex-col gap-4 rounded-2xl border border-[#403A34]/10 bg-[#fbf8f4] p-4 sm:flex-row sm:items-center"
          >
            <Link
              href={`/product/${line.slug}`}
              className="relative flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f3ece4] p-2 sm:h-24 sm:w-28"
            >
              {line.imagePath ? (
                <Image src={line.imagePath} alt="" fill className="object-contain" sizes="112px" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-[#403A34]/45">
                  Нет фото
                </div>
              )}
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${line.slug}`}
                className="font-medium text-[#403A34] hover:underline"
              >
                {line.name}
              </Link>
              <p className="mt-1 text-sm tabular-nums text-[#403A34]/75">
                {line.price.toLocaleString("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                  maximumFractionDigits: 0,
                })}{" "}
                × {line.quantity}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <div className="flex items-center gap-1 rounded-lg border border-[#403A34]/15 bg-white/80 p-1">
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-md text-[#403A34] transition-colors hover:bg-[#403A34]/10"
                  aria-label="Уменьшить"
                  disabled={pending === line.productId}
                  onClick={() =>
                    run(line.productId, () => updateCartQuantity(line.productId, line.quantity - 1))
                  }
                >
                  {pending === line.productId ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Minus className="size-4" />
                  )}
                </button>
                <Input
                  className="h-9 w-14 border-0 bg-transparent text-center text-sm tabular-nums"
                  type="number"
                  min={1}
                  value={line.quantity}
                  readOnly
                  aria-label="Количество"
                />
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-md text-[#403A34] transition-colors hover:bg-[#403A34]/10"
                  aria-label="Увеличить"
                  disabled={pending === line.productId}
                  onClick={() =>
                    run(line.productId, () => updateCartQuantity(line.productId, line.quantity + 1))
                  }
                >
                  {pending === line.productId ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                </button>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-[#403A34]/70 hover:text-red-800"
                aria-label="Удалить"
                disabled={pending === line.productId}
                onClick={() => run(line.productId, () => removeFromCart(line.productId))}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </motion.li>
        ))}
      </ul>

      <div className="flex flex-col items-end gap-2 border-t border-[#403A34]/10 pt-8">
        <p className="text-sm text-[#403A34]/70">
          Товаров: <span className="font-medium text-[#403A34]">{initial.itemCount}</span>
        </p>
        <p className="font-serif text-2xl text-[#403A34]">
          Итого:{" "}
          {initial.subtotal.toLocaleString("ru-RU", {
            style: "currency",
            currency: "RUB",
            maximumFractionDigits: 0,
          })}
        </p>
        {canCheckout ? (
          <Button asChild className="mt-4 rounded-xl">
            <Link href="/checkout">Оформить заказ</Link>
          </Button>
        ) : initial.lines.length > 0 && !isLoggedIn ? (
          <p className="mt-4 max-w-sm text-right text-xs text-[#403A34]/55">
            Войдите в аккаунт, чтобы оформить заказ.
          </p>
        ) : null}
      </div>
    </div>
  );
}
