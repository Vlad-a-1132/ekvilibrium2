import Link from "next/link";

import { WishlistClient } from "@/components/wishlist/wishlist-client";
import { getWishlist } from "@/lib/queries/wishlist";

export default async function WishlistPage() {
  const lines = await getWishlist();

  return (
    <div className="py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[#403A34]">Избранное</h1>
          <p className="mt-2 text-sm text-[#403A34]/70">
            Список сохранён в этой сессии браузера.
          </p>
        </div>
        <Link href="/cart" className="text-sm text-[#403A34]/80 underline-offset-4 hover:underline">
          Корзина
        </Link>
      </div>

      <WishlistClient initial={lines} />
    </div>
  );
}
