import type { OrderStatus } from "@prisma/client";

export function orderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "NEW":
      return "Новый";
    case "PROCESSING":
      return "В обработке";
    case "CONFIRMED":
      return "Подтверждён";
    case "SHIPPED":
      return "Отправлен";
    case "COMPLETED":
      return "Выполнен";
    case "CANCELLED":
      return "Отменён";
    default:
      return status;
  }
}

/** Классы для badge: фон, текст, обводка. */
export function orderStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case "NEW":
      return "border-[#403A34]/15 bg-[#f6f1eb] text-[#403A34]";
    case "PROCESSING":
      return "border-amber-200/90 bg-amber-50/95 text-amber-950/90";
    case "CONFIRMED":
      return "border-sky-200/90 bg-sky-50/95 text-sky-950/90";
    case "SHIPPED":
      return "border-violet-200/90 bg-violet-50/95 text-violet-950/90";
    case "COMPLETED":
      return "border-emerald-200/90 bg-emerald-50/95 text-emerald-950/90";
    case "CANCELLED":
      return "border-stone-200/90 bg-stone-100/95 text-stone-700";
    default:
      return "border-[#403A34]/15 bg-white text-[#403A34]";
  }
}
