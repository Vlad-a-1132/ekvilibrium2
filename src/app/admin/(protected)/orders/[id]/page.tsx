import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminOrderItemsBlock } from "@/components/admin/admin-order-items-block";
import { AdminOrderStatusForm } from "@/components/admin/admin-order-status-form";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { getAdminOrderById } from "@/lib/queries/orders";

type AdminOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) notFound();

  return (
    <div>
      <Link
        href="/admin/orders"
        className="text-sm text-[#403A34]/70 underline-offset-4 hover:text-[#403A34] hover:underline"
      >
        ← Все заказы
      </Link>
      <h1 className="mt-4 flex flex-wrap items-center gap-3 font-serif text-2xl text-[#403A34]">
        <span>Заказ №{order.orderNumber}</span>
        <OrderStatusBadge status={order.status} className="text-[11px]" />
      </h1>
      <p className="mt-2 text-sm text-[#403A34]/65">
        {new Date(order.createdAt).toLocaleString("ru-RU", {
          dateStyle: "full",
          timeStyle: "short",
        })}
      </p>

      <div className="mt-8">
        <AdminOrderStatusForm orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#403A34]/10 bg-white/90 p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#403A34]/45">Покупатель</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-[#403A34]/55">Имя</dt>
              <dd className="font-medium text-[#403A34]">{order.fullName}</dd>
            </div>
            <div>
              <dt className="text-[#403A34]/55">Email</dt>
              <dd>
                <a href={`mailto:${order.email}`} className="font-medium text-[#403A34] hover:underline">
                  {order.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[#403A34]/55">Телефон</dt>
              <dd className="font-medium tabular-nums text-[#403A34]">{order.phone}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-[#403A34]/10 bg-[#fbf8f4] p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#403A34]/45">Итого</h2>
          <p className="mt-4 font-serif text-2xl text-[#403A34]">
            {order.total.toLocaleString("ru-RU", {
              style: "currency",
              currency: "RUB",
              maximumFractionDigits: 0,
            })}
          </p>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-[#403A34]/10 bg-white/90">
        <h2 className="border-b border-[#403A34]/10 px-6 py-4 font-serif text-lg text-[#403A34]">Товары</h2>
        <div className="px-6 py-4">
          <AdminOrderItemsBlock items={order.items} descriptionVariant="detail" />
        </div>
      </section>
    </div>
  );
}
