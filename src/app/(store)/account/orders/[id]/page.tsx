import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { getCurrentUser } from "@/lib/auth/user";
import { getUserOrderForAccount } from "@/lib/queries/orders";

type AccountOrderPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
};

export default async function AccountOrderDetailPage({ params, searchParams }: AccountOrderPageProps) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { id } = await params;
  const sp = await searchParams;
  const showCreated = sp.created === "1";

  const order = await getUserOrderForAccount(user.id, id);
  if (!order) notFound();

  return (
    <div className="py-10 md:py-14">
      <nav className="text-sm text-[#403A34]/55">
        <Link href="/" className="transition-colors hover:text-[#403A34]">
          Главная
        </Link>
        <span className="mx-2 text-[#403A34]/35">/</span>
        <Link href="/account?tab=orders" className="transition-colors hover:text-[#403A34]">
          Мои заказы
        </Link>
        <span className="mx-2 text-[#403A34]/35">/</span>
        <span className="font-medium text-[#403A34]">№{order.orderNumber}</span>
      </nav>

      {showCreated && (
        <div className="mt-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-5 py-4 text-sm text-emerald-950/90">
          Заказ оформлен. Мы свяжемся с вами по телефону{' '}
          <span className="font-medium tabular-nums">{order.phone}</span>.
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-3xl tracking-tight text-[#403A34] md:text-4xl">
          Заказ №{order.orderNumber}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-2 text-sm text-[#403A34]/65">
        {new Date(order.createdAt).toLocaleString("ru-RU", {
          dateStyle: "full",
          timeStyle: "short",
        })}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-[#403A34]/10 bg-white/90 p-6 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#403A34]/45">Контакты в заказе</h2>
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

        <section className="rounded-3xl border border-[#403A34]/10 bg-[#fbf8f4] p-6">
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

      <section className="mt-8 rounded-3xl border border-[#403A34]/10 bg-white/90">
        <h2 className="border-b border-[#403A34]/10 px-6 py-4 font-serif text-lg text-[#403A34]">Состав</h2>
        <ul className="divide-y divide-[#403A34]/8">
          {order.items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-baseline justify-between gap-4 px-6 py-4 text-sm">
              <span className="font-medium text-[#403A34]">{item.productName}</span>
              <span className="text-[#403A34]/65">
                {item.productPrice.toLocaleString("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                  maximumFractionDigits: 0,
                })}{" "}
                × {item.quantity}
              </span>
              <span className="ml-auto tabular-nums font-semibold text-[#403A34]">
                {(item.productPrice * item.quantity).toLocaleString("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                  maximumFractionDigits: 0,
                })}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8">
        <Link
          href="/account?tab=orders"
          className="text-sm font-medium text-[#403A34]/80 underline-offset-4 hover:text-[#403A34] hover:underline"
        >
          ← Ко всем заказам
        </Link>
      </p>
    </div>
  );
}
