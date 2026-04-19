"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ensureSessionId } from "@/lib/session";

function revalidateWishlist() {
  revalidatePath("/wishlist");
  revalidatePath("/", "layout");
}

export async function toggleWishlist(
  productId: string,
): Promise<{ ok: true; inWishlist: boolean } | { ok: false; error: string }> {
  const sessionId = await ensureSessionId();
  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
    select: { id: true },
  });
  if (!product) {
    return { ok: false, error: "Товар не найден или снят с продажи." };
  }

  const existing = await prisma.wishlistItem.findFirst({
    where: { productId, sessionId },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidateWishlist();
    return { ok: true, inWishlist: false };
  }

  await prisma.wishlistItem.create({
    data: { productId, sessionId },
  });
  revalidateWishlist();
  return { ok: true, inWishlist: true };
}
