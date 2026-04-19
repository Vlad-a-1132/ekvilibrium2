import Link from "next/link";

import { AdminOrderItemsBlock } from "@/components/admin/admin-order-items-block";
import { markAdminNotificationRead } from "@/lib/actions/admin-notifications";
import { getAdminNotificationsList, getUnreadAdminNotificationCount } from "@/lib/queries/admin-notifications";

export default async function AdminNotificationsPage() {
  const [unreadCount, notifications] = await Promise.all([
    getUnreadAdminNotificationCount(),
    getAdminNotificationsList(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl text-[#403A34]">Уведомления</h1>
      <p className="mt-2 text-sm text-[#403A34]/65">
        Непрочитанных:{" "}
        <span className="font-semibold text-[#403A34]">{unreadCount}</span>
      </p>

      {notifications.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-[#403A34]/20 bg-[#fbf8f4] px-6 py-12 text-center text-sm text-[#403A34]/65">
          Уведомлений пока нет.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`rounded-2xl border px-4 py-4 ${
                n.isRead
                  ? "border-[#403A34]/10 bg-white/80"
                  : "border-[#403A34]/25 bg-amber-50/50 shadow-sm"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#403A34]">{n.title}</p>
                  <p className="mt-1 text-xs text-[#403A34]/55">
                    {n.createdAt.toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })} ·{" "}
                    {n.type} · {n.isRead ? "Прочитано" : "Непрочитано"}
                  </p>
                  {n.order ? (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm leading-relaxed text-[#403A34]/80">
                        <span className="font-medium text-[#403A34]">{n.order.fullName}</span>
                        {" · "}
                        <a href={`mailto:${n.order.email}`} className="underline-offset-2 hover:underline">
                          {n.order.email}
                        </a>
                        {" · "}
                        <span className="tabular-nums">
                          {n.order.total.toLocaleString("ru-RU", {
                            style: "currency",
                            currency: "RUB",
                            maximumFractionDigits: 0,
                          })}
                        </span>
                        {" · "}
                        <span className="tabular-nums">{n.order.phone}</span>
                      </p>
                      {n.order.items.length > 0 ? (
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#403A34]/45">
                            Состав заказа
                          </p>
                          <AdminOrderItemsBlock
                            items={n.order.items}
                            descriptionVariant="list"
                            listMaxChars={160}
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-[#403A34]/55">Состав заказа недоступен.</p>
                      )}
                    </div>
                  ) : (
                    <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#403A34]/85">
                      {n.message}
                    </pre>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {n.order ? (
                    <Link
                      href={`/admin/orders/${n.order.id}`}
                      className="text-sm font-medium text-[#403A34] underline-offset-2 hover:underline"
                    >
                      Заказ №{n.order.orderNumber}
                    </Link>
                  ) : null}
                  {!n.isRead ? (
                    <form action={markAdminNotificationRead}>
                      <input type="hidden" name="id" value={n.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-[#403A34]/20 bg-white px-3 py-1.5 text-xs font-medium text-[#403A34] hover:bg-[#403A34]/5"
                      >
                        Отметить прочитанным
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
