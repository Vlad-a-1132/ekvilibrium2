import { getCurrentUser } from "@/lib/auth/user";
import { redirectTo } from "@/lib/http/redirect";
import { getCart, normalizeCartData } from "@/lib/queries/cart";
import { getSessionId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

function normalizePhone(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

function buildNewOrderAdminMessage(params: {
  orderNumber: number;
  orderId: string;
  fullName: string;
  phone: string;
  email: string;
  total: number;
  createdAt: Date;
}): string {
  const sum = params.total.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  });
  const when = new Intl.DateTimeFormat("ru-RU", { dateStyle: "long", timeStyle: "short" }).format(
    params.createdAt,
  );
  return [
    "Тип: NEW_ORDER",
    `Номер заказа: ${params.orderNumber}`,
    `ID заказа: ${params.orderId}`,
    `Клиент: ${params.fullName}`,
    `Телефон: ${params.phone}`,
    `Email: ${params.email}`,
    `Сумма: ${sum}`,
    `Дата создания: ${when}`,
  ].join("\n");
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return redirectTo(request, "/login?next=/checkout");
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return redirectTo(request, "/checkout?error=" + encodeURIComponent("Некорректные данные формы."));
  }

  const phoneInput = normalizePhone(String(formData.get("phone") ?? ""));
  const phone = phoneInput || (user.phone?.trim() ?? "");

  if (!phone || phone.replace(/\D/g, "").length < 10) {
    return redirectTo(
      request,
      "/checkout?error=" + encodeURIComponent("Укажите номер телефона — не менее 10 цифр."),
    );
  }

  const sessionId = await getSessionId();
  if (!sessionId) {
    return redirectTo(
      request,
      "/checkout?error=" + encodeURIComponent("Не удалось определить сессию корзины."),
    );
  }

  const cart = normalizeCartData(await getCart());
  if (cart.lines.length === 0) {
    return redirectTo(request, "/cart");
  }

  let createdOrderId: string | null = null;

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: user.id,
          email: user.email,
          phone,
          fullName: user.fullName,
          total: cart.subtotal,
          status: "NEW",
        },
      });

      for (const line of cart.lines) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: line.productId,
            productName: line.name,
            productPrice: line.price,
            quantity: line.quantity,
          },
        });
      }

      await tx.cartItem.deleteMany({ where: { sessionId } });

      if (phone !== user.phone) {
        await tx.user.update({
          where: { id: user.id },
          data: { phone },
        });
      }

      await tx.adminNotification.create({
        data: {
          type: "NEW_ORDER",
          title: `Новый заказ №${order.orderNumber}`,
          message: buildNewOrderAdminMessage({
            orderNumber: order.orderNumber,
            orderId: order.id,
            fullName: order.fullName,
            phone,
            email: user.email,
            total: order.total,
            createdAt: order.createdAt,
          }),
          orderId: order.id,
        },
      });

      createdOrderId = order.id;
    });
  } catch {
    return redirectTo(
      request,
      "/checkout?error=" + encodeURIComponent("Не удалось оформить заказ. Попробуйте позже."),
    );
  }

  if (!createdOrderId) {
    return redirectTo(
      request,
      "/checkout?error=" + encodeURIComponent("Не удалось оформить заказ. Попробуйте позже."),
    );
  }

  return redirectTo(request, `/account/orders/${createdOrderId}?created=1`);
}
