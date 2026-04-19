"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { addToCart } from "@/lib/actions/cart";
import { toggleWishlist } from "@/lib/actions/wishlist";
import { Button } from "@/components/ui/button";
import type { CatalogProduct } from "@/types/catalog";
import { cn } from "@/lib/utils";

export type ProductCardProps = {
  product: CatalogProduct;
  className?: string;
  initialInWishlist?: boolean;
};

export function ProductCard({ product, className, initialInWishlist = false }: ProductCardProps) {
  const router = useRouter();
  const href = `/product/${product.slug}`;
  const onSale = product.oldPrice != null && product.oldPrice > product.price;
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  async function handleCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setCartLoading(true);
    try {
      const res = await addToCart(product.id);
      if (res.ok) router.refresh();
    } finally {
      setCartLoading(false);
    }
  }

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setWishLoading(true);
    try {
      const res = await toggleWishlist(product.id);
      if (res.ok) {
        setInWishlist(res.inWishlist);
        router.refresh();
      }
    } finally {
      setWishLoading(false);
    }
  }

  return (
    <motion.article
      layout
      initial={false}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-[#403A34]/10 bg-[#fbf8f4] shadow-[0_8px_30px_-12px_rgba(64,58,52,0.2)] transition-shadow duration-300 hover:shadow-[0_20px_50px_-20px_rgba(64,58,52,0.28)]",
        className,
      )}
    >
      <Link
        href={href}
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-white p-3 sm:p-4"
      >
        {onSale && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#8b5a5a] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#f6f1eb]">
            Sale
          </span>
        )}
        {product.image ? (
          <Image
            src={product.image.path}
            alt={product.image.alt ?? product.name}
            fill
            className="object-contain transition-opacity duration-300 group-hover:opacity-[0.97]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-[#403A34]/45">
            Нет фото
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={href} className="block flex-1">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-[#403A34] transition-colors group-hover:text-[#2f2a25]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold tabular-nums tracking-tight text-[#403A34]">
            {product.price.toLocaleString("ru-RU", {
              style: "currency",
              currency: "RUB",
              maximumFractionDigits: 0,
            })}
          </span>
          {onSale && product.oldPrice != null && (
            <span className="rounded-md bg-[#403A34]/8 px-1.5 py-0.5 text-xs tabular-nums text-[#403A34]/55 line-through">
              {product.oldPrice.toLocaleString("ru-RU", {
                style: "currency",
                currency: "RUB",
                maximumFractionDigits: 0,
              })}
            </span>
          )}
        </div>

        <div className="mt-auto flex gap-2 pt-4">
          <Button
            type="button"
            variant="default"
            size="sm"
            className="flex-1 transition-transform active:scale-[0.98]"
            onClick={handleCart}
            disabled={cartLoading}
          >
            {cartLoading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <ShoppingBag className="size-4" aria-hidden />
            )}
            В корзину
          </Button>
          <Button
            type="button"
            variant={inWishlist ? "default" : "outline"}
            size="icon"
            className={cn(
              "transition-transform active:scale-95",
              inWishlist && "bg-[#8b5a5a] text-[#f6f1eb] hover:bg-[#7a4e4e]",
            )}
            onClick={handleWishlist}
            disabled={wishLoading}
            aria-pressed={inWishlist}
            aria-label={inWishlist ? "Убрать из избранного" : "В избранное"}
          >
            {wishLoading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Heart className={cn("size-4", inWishlist && "fill-current")} aria-hidden />
            )}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
