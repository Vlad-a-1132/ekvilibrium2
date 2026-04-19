import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";

export type CartLine = {
  cartItemId: string;
  productId: string;
  quantity: number;
  name: string;
  slug: string;
  price: number;
  imagePath: string | null;
};

export type CartData = {
  lines: CartLine[];
  subtotal: number;
  itemCount: number;
};

/** Гарантирует массив `lines` и числовые суммы (защита от неполных данных / границ RSC). */
export function normalizeCartData(cart: Partial<CartData> | null | undefined): CartData {
  const lines = Array.isArray(cart?.lines) ? cart.lines : [];
  let subtotal =
    typeof cart?.subtotal === "number" && Number.isFinite(cart.subtotal) ? cart.subtotal : NaN;
  if (!Number.isFinite(subtotal)) {
    subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  }
  let itemCount =
    typeof cart?.itemCount === "number" && Number.isFinite(cart.itemCount) ? cart.itemCount : NaN;
  if (!Number.isFinite(itemCount)) {
    itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  }
  return { lines, subtotal, itemCount };
}

export async function getCart(): Promise<CartData> {
  const sessionId = await getSessionId();
  if (!sessionId) {
    return normalizeCartData({ lines: [], subtotal: 0, itemCount: 0 });
  }

  try {
    const rows = await prisma.cartItem.findMany({
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

    let subtotal = 0;
    let itemCount = 0;
    const lines: CartLine[] = [];

    for (const row of rows) {
      const p = row.product;
      const qty = row.quantity;
      const price = Number(p.price);
      subtotal += price * qty;
      itemCount += qty;
      const img = p.images[0];
      lines.push({
        cartItemId: row.id,
        productId: p.id,
        quantity: qty,
        name: p.name,
        slug: p.slug,
        price,
        imagePath: img?.url ?? null,
      });
    }

    return normalizeCartData({ lines, subtotal, itemCount });
  } catch {
    return normalizeCartData({ lines: [], subtotal: 0, itemCount: 0 });
  }
}
