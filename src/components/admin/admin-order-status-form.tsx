import { updateOrderStatusAction } from "@/lib/actions/admin-order";
import { orderStatusLabel } from "@/lib/order-status-label";
import { ORDER_STATUS_SEQUENCE } from "@/lib/order-status-constants";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@prisma/client";

type AdminOrderStatusFormProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

export function AdminOrderStatusForm({ orderId, currentStatus }: AdminOrderStatusFormProps) {
  return (
    <section className="rounded-2xl border border-[#403A34]/10 bg-white/95 p-6 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-[#403A34]/45">Статус заказа</h2>
      <p className="mt-2 text-sm text-[#403A34]/70">
        Сейчас: <span className="font-medium text-[#403A34]">{orderStatusLabel(currentStatus)}</span>
      </p>
      <form action={updateOrderStatusAction} className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
        <input type="hidden" name="orderId" value={orderId} />
        <div className="min-w-0 flex-1">
          <label htmlFor="order-status" className="sr-only">
            Новый статус
          </label>
          <select
            id="order-status"
            name="status"
            defaultValue={currentStatus}
            className="w-full max-w-sm rounded-xl border border-[#403A34]/15 bg-[#fbf8f4] px-4 py-3 text-sm font-medium text-[#403A34] outline-none transition-colors focus:border-[#403A34]/35 focus:ring-2 focus:ring-[#403A34]/10"
          >
            {ORDER_STATUS_SEQUENCE.map((s) => (
              <option key={s} value={s}>
                {orderStatusLabel(s)}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" className="rounded-xl sm:shrink-0">
          Сохранить статус
        </Button>
      </form>
    </section>
  );
}
