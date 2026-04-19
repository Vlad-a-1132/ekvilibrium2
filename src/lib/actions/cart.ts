"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ensureSessionId } from "@/lib/session";

function revalidateCart() {
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function addToCart(
  productId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sessionId = await ensureSessionId();
  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
    select: { id: true },
  });
  if (!product) {
    return { ok: false, error: "Товар не найден или снят с продажи." };
  }

  const existing = await prisma.cartItem.findFirst({
    where: { productId, sessionId },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + 1 },
    });
  } else {
    await prisma.cartItem.create({
      data: { productId, sessionId, quantity: 1 },
    });
  }

  revalidateCart();
  return { ok: true };
}

export async function removeFromCart(
  productId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sessionId = await ensureSessionId();
  const row = await prisma.cartItem.findFirst({
    where: { productId, sessionId },
  });
  if (!row) {
    return { ok: false, error: "Позиция не найдена." };
  }
  await prisma.cartItem.delete({ where: { id: row.id } });
  revalidateCart();
  return { ok: true };
}

export async function updateCartQuantity(
  productId: string,
  quantity: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sessionId = await ensureSessionId();
  const q = Math.floor(Number(quantity));
  if (Number.isNaN(q)) {
    return { ok: false, error: "Некорректное количество." };
  }

  const row = await prisma.cartItem.findFirst({
    where: { productId, sessionId },
  });
  if (!row) {
    return { ok: false, error: "Позиция не найдена." };
  }

  if (q < 1) {
    await prisma.cartItem.delete({ where: { id: row.id } });
  } else {
    await prisma.cartItem.update({
      where: { id: row.id },
      data: { quantity: q },
    });
  }

  revalidateCart();
  return { ok: true };
}
