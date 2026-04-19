import { prisma } from "@/lib/prisma";

const orderItemAdminSelect = {
  id: true,
  productName: true,
  productPrice: true,
  quantity: true,
  productId: true,
  product: {
    select: { slug: true, description: true },
  },
} as const;

export async function getUserOrders(userId: string) {
  try {
    return await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
        _count: { select: { items: true } },
      },
    });
  } catch {
    return [];
  }
}

export async function getUserOrderForAccount(userId: string, orderId: string) {
  try {
    return await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: { orderBy: { id: "asc" } },
      },
    });
  } catch {
    return null;
  }
}

export async function getAdminOrdersList() {
  try {
    return await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        orderNumber: true,
        fullName: true,
        email: true,
        phone: true,
        total: true,
        status: true,
        createdAt: true,
        items: {
          orderBy: { id: "asc" },
          select: orderItemAdminSelect,
        },
      },
    });
  } catch {
    return [];
  }
}

export async function getAdminOrderById(id: string) {
  try {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { id: "asc" },
          select: orderItemAdminSelect,
        },
      },
    });
  } catch {
    return null;
  }
}
