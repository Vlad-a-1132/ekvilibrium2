"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAuth } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export async function markAdminNotificationRead(formData: FormData): Promise<void> {
  await requireAdminAuth();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  await prisma.adminNotification.updateMany({
    where: { id, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });

  revalidatePath("/admin/notifications");
  revalidatePath("/admin");
}
