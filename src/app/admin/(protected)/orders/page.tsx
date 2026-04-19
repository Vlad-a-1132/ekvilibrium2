import Link from "next/link";
import { Fragment } from "react";

import { AdminOrderItemsBlock } from "@/components/admin/admin-order-items-block";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { getAdminOrdersList } from "@/lib/queries/orders";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrdersList();

  return (
    <div>
      <h1 className="font-serif text-2xl text-[#403A34]">Заказы</h1>
      <p className="mt-2 text-sm text-[#403A34]/65">Данные покупателя и сумма заказа.</p>

      {orders.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-[#403A34]/20 bg-[#fbf8f4] px-6 py-12 text-center text-sm text-[#403A34]/65">
          Заказов пока нет.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-[#403A34]/10 bg-white/90">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[#403A34]/10 bg-[#f6f1eb]/80 text-xs font-semibold uppercase tracking-wide text-[#403A34]/55">
              <tr>
                <th className="px-4 py-3">№</th>
                <th className="px-4 py-3">Дата</th>
                <th className="px-4 py-3">Клиент</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Телефон</th>
                <th className="px-4 py-3">Сумма</th>
                <th className="px-4 py-3">Статус</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <Fragment key={o.id}>
                  <tr className="border-b border-[#403A34]/8">
                    <td className="px-4 py-3 font-medium text-[#403A34]">
                      <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[#403A34]/80">
                      {new Date(o.createdAt).toLocaleString("ru-RU", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3 text-[#403A34]">{o.fullName}</td>
                    <td className="px-4 py-3 text-[#403A34]/85">{o.email}</td>
                    <td className="px-4 py-3 tabular-nums text-[#403A34]/85">{o.phone}</td>
                    <td className="px-4 py-3 tabular-nums font-medium text-[#403A34]">
                      {o.total.toLocaleString("ru-RU", {
                        style: "currency",
                        currency: "RUB",
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                  </tr>
                  <tr className="border-b border-[#403A34]/8 last:border-0">
                    <td colSpan={7} className="bg-[#fbf8f4]/80 px-4 pb-4 pt-1">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#403A34]/45">
                        Товары
                      </p>
                      <AdminOrderItemsBlock
                        items={o.items}
                        descriptionVariant="list"
                        listMaxChars={150}
                      />
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
