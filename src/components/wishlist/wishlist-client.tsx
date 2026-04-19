"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { toggleWishlist } from "@/lib/actions/wishlist";
import { Button } from "@/components/ui/button";
import type { WishlistLine } from "@/lib/queries/wishlist";

type WishlistClientProps = {
  initial: WishlistLine[];
};

export function WishlistClient({ initial }: WishlistClientProps) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  async function remove(productId: string) {
    setPending(productId);
    try {
      await toggleWishlist(productId);
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  if (initial.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-[#403A34]/10 bg-[#fbf8f4] px-8 py-14 text-center">
        <p className="font-serif text-lg text-[#403A34]">Пока пусто</p>
        <p className="mt-2 text-sm text-[#403A34]/65">Нажмите ❤️ на карточке товара в каталоге.</p>
        <Button asChild className="mt-6">
          <Link href="/">На главную</Link>
        </Button>
      </div>
    );
  }

  return (
    <ul className="mt-10 space-y-4">
      {initial.map((line, index) => (
        <motion.li
          key={line.wishlistItemId}
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
              })}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 shrink-0"
            disabled={pending === line.productId}
            onClick={() => remove(line.productId)}
          >
            {pending === line.productId ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Убрать
          </Button>
        </motion.li>
      ))}
    </ul>
  );
}
