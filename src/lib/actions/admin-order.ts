"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminAuth } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_SEQUENCE } from "@/lib/order-status-constants";
import type { OrderStatus } from "@prisma/client";

function isOrderStatus(v: string): v is OrderStatus {
  return (ORDER_STATUS_SEQUENCE as string[]).includes(v);
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdminAuth();

  const orderId = String(formData.get("orderId") ?? "").trim();
  const raw = String(formData.get("status") ?? "").trim();

  if (!orderId || !isOrderStatus(raw)) {
    redirect("/admin/orders");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: raw },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/account");
  revalidatePath(`/account/orders/${orderId}`);

  redirect(`/admin/orders/${orderId}`);
}
