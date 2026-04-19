import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";

export type WishlistLine = {
  wishlistItemId: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  imagePath: string | null;
};

export async function getWishlist(): Promise<WishlistLine[]> {
  const sessionId = await getSessionId();
  if (!sessionId) return [];

  try {
    const rows = await prisma.wishlistItem.findMany({
      where: {
        sessionId,
        product: { isActive: true },
      },
      orderBy: { id: "desc" },
      include: {
        product: {
          include: {
            images: { orderBy: { id: "asc" }, take: 1 },
          },
        },
      },
    });

    return rows.map((r) => {
      const p = r.product;
      const img = p.images[0];
      return {
        wishlistItemId: r.id,
        productId: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        imagePath: img?.url ?? null,
      };
    });
  } catch {
    return [];
  }
}

/** Id товаров в избранном для подсветки карточек на витрине. */
export async function getWishlistProductIds(): Promise<Set<string>> {
  const sessionId = await getSessionId();
  if (!sessionId) return new Set();

  try {
    const rows = await prisma.wishlistItem.findMany({
      where: { sessionId },
      select: { productId: true },
    });
    return new Set(rows.map((r) => r.productId));
  } catch {
    return new Set();
  }
}
