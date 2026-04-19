"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutAdminAction } from "@/lib/actions/admin-panel-auth";
import { cn } from "@/lib/utils";
import type { AdminNavItem } from "@/types/admin";

const nav: AdminNavItem[] = [
  { title: "Обзор", href: "/admin", description: "Сводка и метрики" },
  { title: "Заказы", href: "/admin/orders" },
  { title: "Уведомления", href: "/admin/notifications" },
  { title: "Товары", href: "/admin/products" },
  { title: "Новый товар", href: "/admin/products/new" },
  { title: "Категории", href: "/admin/categories" },
  { title: "Подкатегории", href: "/admin/subcategories" },
  { title: "Новая подкатегория", href: "/admin/subcategories/new" },
];

type AdminShellProps = {
  children: React.ReactNode;
  unreadNotificationCount?: number;
};

export function AdminShell({ children, unreadNotificationCount = 0 }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#f4f0ea] text-[#2a2622]">
      <aside className="hidden min-h-0 w-64 shrink-0 flex-col border-r border-[#403A34]/10 bg-[#fbf8f4] px-4 py-8 md:flex">
        <Link href="/" className="block px-2 font-serif text-lg text-[#403A34]">
          ← На витрину
        </Link>
        <p className="mt-6 px-2 text-xs font-semibold uppercase tracking-wider text-[#403A34]/45">
          Админка
        </p>
        <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-[#403A34] text-[#f6f1eb]" : "hover:bg-[#403A34]/8",
                )}
              >
                <span>{item.title}</span>
                {item.href === "/admin/notifications" && unreadNotificationCount > 0 ? (
                  <span
                    className={cn(
                      "min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold leading-none",
                      active ? "bg-[#f6f1eb] text-[#403A34]" : "bg-red-600 text-white",
                    )}
                  >
                    {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <form action={logoutAdminAction} className="mt-6 shrink-0 px-2">
          <button
            type="submit"
            className="w-full rounded-lg border border-[#403A34]/15 bg-white/60 px-3 py-2.5 text-left text-sm text-[#403A34]/85 transition-colors hover:border-[#403A34]/25 hover:bg-white"
          >
            Выйти
          </button>
        </form>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-[#403A34]/10 bg-[#f6f1eb]/90 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <h1 className="font-serif text-xl text-[#403A34]">Эквилибриум</h1>
            <span className="text-xs uppercase tracking-wider text-[#403A34]/50">Admin</span>
          </div>
        </header>
        <div className="flex-1 px-4 py-8 md:px-8">{children}</div>
      </div>
    </div>
  );
}
