import Link from "next/link";

import { AccountPageView } from "@/components/account/account-page-view";
import { getCurrentUser, roleLabel } from "@/lib/auth/user";
import { getUserOrders } from "@/lib/queries/orders";

type AccountPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const user = await getCurrentUser();
  if (!user) return null;

  const sp = await searchParams;
  const initialTab = sp.tab === "orders" ? "orders" : "profile";

  const orders = await getUserOrders(user.id);

  return (
    <div className="py-10 md:py-14">
      <nav className="text-sm text-[#403A34]/55">
        <Link href="/" className="transition-colors hover:text-[#403A34]">
          Главная
        </Link>
        <span className="mx-2 text-[#403A34]/35">/</span>
        <span className="font-medium text-[#403A34]">Личный кабинет</span>
      </nav>

      <h1 className="mt-6 font-serif text-3xl tracking-tight text-[#403A34] md:text-4xl">Личный кабинет</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#403A34]/72">
        Профиль, заказы и поддержка — в одном месте.
      </p>

      <div className="mt-10">
        <AccountPageView
          profile={{
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            roleLabel: roleLabel(user.role),
          }}
          orders={orders.map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            status: o.status,
            total: o.total,
            createdAt: o.createdAt,
            itemCount: o._count.items,
          }))}
          initialTab={initialTab}
        />
      </div>
    </div>
  );
}
