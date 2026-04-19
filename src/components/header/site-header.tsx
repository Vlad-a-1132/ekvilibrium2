"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Heart, ShoppingBag, UserRound } from "lucide-react";

import { HeaderAccountMenu } from "@/components/header/header-account-menu";
import { HeaderSearch } from "@/components/header/header-search";
import { MegaMenuPanel } from "@/components/mega-menu/mega-menu";
import { SiteContainer } from "@/components/layout/site-container";
import { cn } from "@/lib/utils";
import type { MainCategoryNav } from "@/types/catalog";

export type SiteHeaderProps = {
  categories: MainCategoryNav[];
  cartCount?: number;
  wishlistCount?: number;
  /** true — ссылка на ЛК, false — на страницу входа */
  isAuthenticated?: boolean;
};

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  const label = count > 99 ? "99+" : String(count);
  return (
    <span className="absolute -bottom-0.5 -right-0.5 flex min-h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full border-2 border-[#f6f1eb] bg-[#403A34] px-1 text-[10px] font-bold tabular-nums leading-none text-[#f6f1eb] shadow-sm">
      {label}
    </span>
  );
}

export function SiteHeader({
  categories,
  cartCount = 0,
  wishlistCount = 0,
  isAuthenticated = false,
}: SiteHeaderProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const navCategories = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories],
  );

  const openCategory = useMemo(
    () => navCategories.find((c) => c.slug === openSlug) ?? null,
    [navCategories, openSlug],
  );

  return (
    <header
      className="relative sticky top-0 z-40 border-b border-[#403A34]/10 bg-[#f6f1eb]/92 shadow-[0_1px_0_rgba(64,58,52,0.04)] backdrop-blur-xl"
      onMouseLeave={() => setOpenSlug(null)}
    >
      <SiteContainer className="relative flex flex-nowrap items-center gap-2 py-3.5 sm:gap-3 md:gap-4 md:py-4">
        <Link
          href="/"
          className="group relative flex h-10 w-[10.75rem] shrink-0 sm:h-11 sm:w-[11.75rem] md:h-12 md:w-[12.75rem]"
        >
          <Image
            src="/vitrina/Tovary%20dlya%20tvorchestva/logo.webp"
            alt="Эквилибриум — канцелярия"
            fill
            className="object-contain object-left transition-opacity duration-200 group-hover:opacity-90"
            sizes="(max-width: 768px) 172px, 204px"
            priority
            unoptimized
          />
        </Link>

        <nav
          className="hidden min-w-0 shrink-0 items-center gap-x-1.5 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] lg:flex [&::-webkit-scrollbar]:hidden"
          aria-label="Основные категории"
        >
          {navCategories.map((cat) => {
            const isOpen = openSlug === cat.slug;
            return (
              <div key={cat.id} className="relative shrink-0">
                <Link
                  href={`/catalog/${cat.slug}`}
                  className={cn(
                    "relative inline-flex items-center whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-medium tracking-tight transition-all duration-200 xl:px-4",
                    isOpen
                      ? "bg-[#403A34] text-[#f6f1eb] shadow-md shadow-[#403A34]/15"
                      : "text-[#403A34]/90 hover:bg-white/70 hover:text-[#403A34] hover:shadow-sm",
                  )}
                  onMouseEnter={() => setOpenSlug(cat.slug)}
                >
                  {cat.name}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="min-w-0 flex-1 lg:max-w-[26rem]">
          <HeaderSearch />
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {isAuthenticated ? (
            <HeaderAccountMenu />
          ) : (
            <Link
              href="/login"
              className={cn(
                "relative inline-flex size-10 items-center justify-center rounded-2xl border border-transparent text-[#403A34] transition-all duration-200",
                "hover:border-[#403A34]/12 hover:bg-white/80 hover:shadow-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403A34]/25 focus-visible:ring-offset-2",
              )}
              aria-label="Вход"
            >
              <UserRound className="size-[1.35rem]" strokeWidth={1.5} />
            </Link>
          )}
          <Link
            href="/wishlist"
            className={cn(
              "relative inline-flex size-10 items-center justify-center rounded-2xl border border-transparent text-[#403A34] transition-all duration-200",
              "hover:border-[#403A34]/12 hover:bg-white/80 hover:shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403A34]/25 focus-visible:ring-offset-2",
            )}
            aria-label={`Избранное${wishlistCount ? `, ${wishlistCount}` : ""}`}
          >
            <Heart className="size-[1.35rem]" strokeWidth={1.5} />
            <CountBadge count={wishlistCount} />
          </Link>
          <Link
            href="/cart"
            className={cn(
              "relative inline-flex size-10 items-center justify-center rounded-2xl border border-transparent text-[#403A34] transition-all duration-200",
              "hover:border-[#403A34]/12 hover:bg-white/80 hover:shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403A34]/25 focus-visible:ring-offset-2",
            )}
            aria-label={`Корзина${cartCount ? `, ${cartCount} поз.` : ""}`}
          >
            <ShoppingBag className="size-[1.35rem]" strokeWidth={1.5} />
            <CountBadge count={cartCount} />
          </Link>
        </div>
      </SiteContainer>

      <MegaMenuPanel category={openCategory} open={Boolean(openSlug)} />

      <div className="border-t border-[#403A34]/8 bg-[#f6f1eb]/80 lg:hidden">
        <SiteContainer className="py-4 sm:py-5">
          <div className="border-b border-[#403A34]/10 pb-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#403A34]/50">
              Каталог
            </h2>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {navCategories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/catalog/${cat.slug}`}
                  className={cn(
                    "flex min-h-[3rem] w-full items-center justify-between gap-3 rounded-xl border border-[#403A34]/12 bg-white/85 px-4 py-3 text-left text-[15px] font-medium leading-snug text-[#403A34] shadow-sm transition-colors",
                    "active:bg-white active:shadow-md",
                    "hover:border-[#403A34]/20 hover:bg-white",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403A34]/20",
                  )}
                >
                  <span className="min-w-0 flex-1 break-words">{cat.name}</span>
                  <ChevronRight
                    className="size-5 shrink-0 text-[#403A34]/35"
                    strokeWidth={2}
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </SiteContainer>
      </div>
    </header>
  );
}
