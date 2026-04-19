import { orderStatusBadgeClass, orderStatusLabel } from "@/lib/order-status-label";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";

type OrderStatusBadgeProps = {
  status: OrderStatus;
  className?: string;
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        orderStatusBadgeClass(status),
        className,
      )}
    >
      {orderStatusLabel(status)}
    </span>
  );
}
