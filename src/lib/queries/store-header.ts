import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";

export type StoreHeaderCounts = {
  cartCount: number;
  wishlistCount: number;
};

/** Лёгкие счётчики для шапки: корзина = сумма quantity, избранное = число позиций. */
export async function getStoreHeaderCounts(): Promise<StoreHeaderCounts> {
  const sessionId = await getSessionId();
  if (!sessionId) {
    return { cartCount: 0, wishlistCount: 0 };
  }

  try {
    const [cartAgg, wishlistCount] = await Promise.all([
      prisma.cartItem.aggregate({
        where: {
          sessionId,
          product: { isActive: true },
        },
        _sum: { quantity: true },
      }),
      prisma.wishlistItem.count({
        where: {
          sessionId,
          product: { isActive: true },
        },
      }),
    ]);

    return {
      cartCount: cartAgg._sum.quantity ?? 0,
      wishlistCount,
    };
  } catch {
    return { cartCount: 0, wishlistCount: 0 };
  }
}
