import { prisma } from "@/lib/prisma";

export async function getUnreadAdminNotificationCount(): Promise<number> {
  return prisma.adminNotification.count({ where: { isRead: false } });
}

const orderItemsForNotification = {
  orderBy: { id: "asc" as const },
  select: {
    id: true,
    productName: true,
    productPrice: true,
    quantity: true,
    productId: true,
    product: {
      select: { slug: true, description: true },
    },
  },
};

export async function getAdminNotificationsList() {
  return prisma.adminNotification.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          fullName: true,
          email: true,
          phone: true,
          total: true,
          items: orderItemsForNotification,
        },
      },
    },
  });
}
