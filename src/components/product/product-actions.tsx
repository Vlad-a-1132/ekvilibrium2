"use client";

import { Heart, Loader2, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { addToCart } from "@/lib/actions/cart";
import { toggleWishlist } from "@/lib/actions/wishlist";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductActionsProps = {
  productId: string;
  initialInWishlist: boolean;
};

export function ProductActions({ productId, initialInWishlist }: ProductActionsProps) {
  const router = useRouter();
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [cartFeedback, setCartFeedback] = useState(false);

  useEffect(() => {
    if (!cartFeedback) return;
    const t = window.setTimeout(() => setCartFeedback(false), 2800);
    return () => window.clearTimeout(t);
  }, [cartFeedback]);

  async function handleCart() {
    setCartLoading(true);
    try {
      const res = await addToCart(productId);
      if (res.ok) {
        setCartFeedback(true);
        router.refresh();
      }
    } finally {
      setCartLoading(false);
    }
  }

  async function handleWishlist() {
    setWishLoading(true);
    try {
      const res = await toggleWishlist(productId);
      if (res.ok) {
        setInWishlist(res.inWishlist);
        router.refresh();
      }
    } finally {
      setWishLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <Button
          type="button"
          className={cn(
            "h-14 min-h-14 flex-1 gap-2.5 rounded-xl px-6 text-base font-semibold shadow-md",
            "bg-[#403A34] text-[#f6f1eb] hover:bg-[#2f2a25]",
            "transition-all hover:shadow-lg active:scale-[0.99]",
          )}
          onClick={handleCart}
          disabled={cartLoading}
        >
          {cartLoading ? (
            <Loader2 className="size-5 animate-spin" aria-hidden />
          ) : (
            <ShoppingBag className="size-5 shrink-0" aria-hidden />
          )}
          В корзину
        </Button>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-14 min-h-14 gap-2.5 rounded-xl border-2 border-[#403A34]/20 bg-white/90 px-6 text-base font-medium",
            "transition-all hover:border-[#403A34]/35 hover:bg-[#f6f1eb]/80 active:scale-[0.99]",
            "sm:min-w-[200px]",
            inWishlist &&
              "border-[#8b5a5a]/40 bg-[#8b5a5a]/10 text-[#5c3838] hover:bg-[#8b5a5a]/18",
          )}
          onClick={handleWishlist}
          disabled={wishLoading}
          aria-pressed={inWishlist}
        >
          {wishLoading ? (
            <Loader2 className="size-5 animate-spin" aria-hidden />
          ) : (
            <Heart className={cn("size-5 shrink-0", inWishlist && "fill-current")} aria-hidden />
          )}
          {inWishlist ? "В избранном" : "В избранное"}
        </Button>
      </div>

      {cartFeedback && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200/90 bg-emerald-50/95 p-4 text-sm text-emerald-950 shadow-[0_12px_40px_-16px_rgba(20,83,45,0.35)]"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium leading-snug">Товар добавлен в корзину</p>
            <button
              type="button"
              className="shrink-0 rounded-md p-1 text-emerald-800/70 transition-colors hover:bg-emerald-100/80 hover:text-emerald-950"
              aria-label="Закрыть"
              onClick={() => setCartFeedback(false)}
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm" className="bg-emerald-900 text-emerald-50 hover:bg-emerald-950">
              <Link href="/cart">Перейти в корзину</Link>
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setCartFeedback(false)}>
              Продолжить покупки
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
