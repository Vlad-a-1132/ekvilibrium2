"use client";

import Link from "next/link";
import { Lock, Mail, Phone, Shield, UserRound } from "lucide-react";
import { useState } from "react";

import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { siteContact } from "@/data/site-contact";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";

type ProfileVm = {
  fullName: string;
  email: string;
  phone: string | null;
  roleLabel: string;
};

type OrderVm = {
  id: string;
  orderNumber: number;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  itemCount: number;
};

type TabId = "profile" | "orders";

const tabs: { id: TabId; label: string }[] = [
  { id: "profile", label: "Профиль" },
  { id: "orders", label: "Ваши заказы" },
];

type AccountPageViewProps = {
  profile: ProfileVm;
  orders: OrderVm[];
  initialTab: TabId;
};

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0]!, last: "" };
  return { first: parts[0]!, last: parts.slice(1).join(" ") };
}

export function AccountPageView({ profile, orders, initialTab }: AccountPageViewProps) {
  const [tab, setTab] = useState<TabId>(initialTab);
  const { first, last } = splitName(profile.fullName);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 border-b border-[#403A34]/10 pb-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                tab === t.id
                  ? "bg-[#403A34] text-[#f6f1eb] shadow-md shadow-[#403A34]/15"
                  : "text-[#403A34]/70 hover:bg-white/80 hover:text-[#403A34]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="outline" className="rounded-xl">
            Выйти
          </Button>
        </form>
      </div>

      {tab === "profile" && <ProfileTab profile={profile} firstName={first} lastName={last} />}
      {tab === "orders" && <OrdersTab orders={orders} />}
    </div>
  );
}

function ProfileTab({
  profile,
  firstName,
  lastName,
}: {
  profile: ProfileVm;
  firstName: string;
  lastName: string;
}) {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[#403A34]/10 bg-white/80 p-6 shadow-[0_16px_48px_-28px_rgba(64,58,52,0.35)] md:p-8">
        <h2 className="flex items-center gap-2 font-serif text-xl text-[#403A34] md:text-2xl">
          <UserRound className="size-6 text-[#403A34]/55" strokeWidth={1.5} />
          Контактные данные
        </h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#403A34]/45">Имя</dt>
            <dd className="mt-1.5 text-[15px] font-medium text-[#403A34]">{firstName || "—"}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#403A34]/45">Фамилия</dt>
            <dd className="mt-1.5 text-[15px] font-medium text-[#403A34]">{lastName || "—"}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#403A34]/45">Email</dt>
            <dd className="mt-1.5 flex items-center gap-2 text-[15px] text-[#403A34]">
              <Mail className="size-4 shrink-0 text-[#403A34]/45" aria-hidden />
              <a href={`mailto:${profile.email}`} className="font-medium hover:underline">
                {profile.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#403A34]/45">Телефон</dt>
            <dd className="mt-1.5 flex items-center gap-2 text-[15px] text-[#403A34]">
              <Phone className="size-4 shrink-0 text-[#403A34]/45" aria-hidden />
              <span className="font-medium">{profile.phone?.trim() || "—"}</span>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#403A34]/45">Роль</dt>
            <dd className="mt-2">
              <span className="inline-flex rounded-full border border-[#403A34]/12 bg-[#f6f1eb] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#403A34]/85">
                {profile.roleLabel}
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-3xl border border-[#403A34]/10 bg-[#fbf8f4]/90 p-6 md:p-8">
        <h2 className="flex items-center gap-2 font-serif text-xl text-[#403A34] md:text-2xl">
          <Lock className="size-6 text-[#403A34]/55" strokeWidth={1.5} />
          Пароль и безопасность
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#403A34]/70">
          Смена пароля и дополнительные настройки появятся вместе с отдельным сервисом входа.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" variant="outline" disabled className="rounded-xl" aria-disabled="true">
            Сменить пароль
          </Button>
        </div>
        <div className="mt-8 flex gap-3 rounded-2xl border border-[#403A34]/8 bg-white/60 p-4">
          <Shield className="mt-0.5 size-5 shrink-0 text-[#403A34]/45" aria-hidden />
          <div>
            <p className="text-sm font-medium text-[#403A34]">Двухфакторная аутентификация</p>
            <p className="mt-1 text-sm text-[#403A34]/65">Будет доступна в следующих версиях.</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#403A34]/10 bg-white/80 p-6 shadow-[0_12px_40px_-24px_rgba(64,58,52,0.28)] md:p-8">
        <h2 className="font-serif text-xl text-[#403A34] md:text-2xl">Поддержка</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#403A34]/70">{siteContact.lead}</p>
        <p className="mt-2 text-sm text-[#403A34]/55">{siteContact.hours}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`mailto:${siteContact.email}?subject=Вопрос%20из%20личного%20кабинета`}
            className="inline-flex rounded-2xl bg-[#403A34] px-6 py-3 text-sm font-semibold text-[#f6f1eb] shadow-lg shadow-[#403A34]/18 transition-colors hover:bg-[#2f2a25]"
          >
            Написать в поддержку
          </Link>
          <a
            href={siteContact.phoneHref}
            className="inline-flex items-center rounded-2xl border border-[#403A34]/15 bg-white px-6 py-3 text-sm font-semibold text-[#403A34] transition-colors hover:bg-[#f6f1eb]"
          >
            {siteContact.phone}
          </a>
        </div>
      </section>
    </div>
  );
}

function OrdersTab({ orders }: { orders: OrderVm[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#403A34]/18 bg-[#fbf8f4]/90 px-6 py-16 text-center md:px-10">
        <p className="font-serif text-xl text-[#403A34]">Заказов пока нет</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#403A34]/68">
          Оформите заказ из корзины — список появится здесь.
        </p>
        <Link
          href="/catalog/kanctovary"
          className="mt-8 inline-flex rounded-2xl border border-[#403A34]/15 bg-white px-6 py-3 text-sm font-semibold text-[#403A34] shadow-sm transition-colors hover:bg-[#f6f1eb]"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((o) => (
        <li key={o.id}>
          <Link
            href={`/account/orders/${o.id}`}
            className="flex flex-col gap-3 rounded-2xl border border-[#403A34]/10 bg-white/90 px-5 py-4 shadow-sm transition-colors hover:border-[#403A34]/22 hover:bg-white md:flex-row md:items-center md:justify-between md:gap-6"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-[#403A34]">Заказ №{o.orderNumber}</span>
                <OrderStatusBadge status={o.status} />
              </div>
              <p className="mt-1 text-sm text-[#403A34]/60">
                {new Date(o.createdAt).toLocaleString("ru-RU", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
                <span className="text-[#403A34]/45"> · </span>
                {o.itemCount} {o.itemCount === 1 ? "позиция" : o.itemCount < 5 ? "позиции" : "позиций"}
              </p>
            </div>
            <p className="font-serif text-lg tabular-nums text-[#403A34] md:text-right">
              {o.total.toLocaleString("ru-RU", {
                style: "currency",
                currency: "RUB",
                maximumFractionDigits: 0,
              })}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
