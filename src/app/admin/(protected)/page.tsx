import Link from "next/link";

import { getAdminOverviewStats } from "@/lib/queries/admin";

export default async function AdminDashboardPage() {
  const stats = await getAdminOverviewStats();

  const cards = [
    {
      title: "Товары",
      value: stats.productCount,
      description: "Позиции в каталоге (включая неактивные).",
      href: "/admin/products",
    },
    {
      title: "Главные категории",
      value: stats.mainCategoryCount,
      description: "Корневые разделы витрины.",
      href: "/admin/categories",
    },
    {
      title: "Подкатегории",
      value: stats.subCategoryCount,
      description: "Привязка к главным категориям.",
      href: "/admin/subcategories",
    },
  ] as const;

  return (
    <div>
      <h2 className="font-serif text-2xl text-[#403A34]">Обзор</h2>
      <p className="mt-2 max-w-2xl text-sm text-[#403A34]/70">
        Сводка по данным из базы: товары и дерево категорий.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-2xl border border-[#403A34]/10 bg-white/70 p-6 shadow-sm transition-colors hover:border-[#403A34]/20 hover:bg-white"
          >
            <p className="text-sm font-medium text-[#403A34]/80">{card.title}</p>
            <p className="mt-3 font-serif text-3xl tabular-nums tracking-tight text-[#403A34]">
              {card.value}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[#403A34]/60">{card.description}</p>
            <p className="mt-4 text-xs font-medium text-[#403A34]/45 group-hover:text-[#403A34]/65">
              Подробнее →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
