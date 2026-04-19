"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Input } from "@/components/ui/input";
import { catalogHref } from "@/lib/catalog-url";
import { cn } from "@/lib/utils";

type Sub = { id: string; name: string; slug: string };

type CatalogSubcategoryFiltersProps = {
  mainCategorySlug: string;
  subcategories: Sub[];
  activeSubSlug?: string | null;
  variant?: "sidebar" | "chips";
};

export function CatalogSubcategoryFilters({
  mainCategorySlug,
  subcategories,
  activeSubSlug,
  variant = "sidebar",
}: CatalogSubcategoryFiltersProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const allHref = catalogHref(mainCategorySlug);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return subcategories;
    return subcategories.filter((s) => s.name.toLowerCase().includes(q));
  }, [subcategories, debouncedQuery]);

  const isChips = variant === "chips";
  const emptySearch = query.trim() !== "" && filtered.length === 0;

  const chipActive =
    "border-transparent bg-[#403A34] text-[#f6f1eb] shadow-md shadow-[#403A34]/20";
  const chipIdle =
    "border-[#403A34]/12 bg-white/90 text-[#403A34] hover:border-[#403A34]/22 hover:shadow-sm";

  const sidebarLink = (active: boolean) =>
    cn(
      "block rounded-xl border px-3 py-2.5 text-sm transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403A34]/25 focus-visible:ring-offset-1",
      active
        ? "border-[#403A34] bg-[#403A34] font-medium text-[#f6f1eb] shadow-lg"
        : "border-[#403A34]/8 bg-white/60 text-[#403A34] hover:border-[#403A34]/18 hover:bg-white hover:shadow-md",
    );

  return (
    <div
      className={cn(
        !isChips &&
          "rounded-2xl border border-[#403A34]/10 bg-gradient-to-b from-white/80 to-[#fbf8f4]/40 p-4 shadow-md",
      )}
    >
      <div className={cn(!isChips && "space-y-4")}>
        {!isChips && (
          <div className="space-y-1 border-b border-[#403A34]/8 pb-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#403A34]/45">
              Фильтр
            </p>
            <p className="text-xs text-[#403A34]/55">Подкатегории раздела</p>
          </div>
        )}

        {isChips && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#403A34]/45">
            Подкатегории
          </p>
        )}

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#403A34]/35"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isChips ? "Поиск…" : "Найти подкатегорию…"}
            className={cn(
              "h-10 rounded-2xl border-[#403A34]/10 bg-white/95 pl-10 text-sm shadow-sm transition-shadow duration-200 focus-visible:shadow-md",
              isChips && "h-9 pl-9",
            )}
            autoComplete="off"
          />
        </div>

        {isChips ? (
          <ul className="flex gap-2 overflow-x-auto pb-2 pt-1 [-webkit-overflow-scrolling:touch] scrollbar-equilibrium">
            <li className="shrink-0 snap-start">
              <Link
                href={allHref}
                className={cn(
                  "inline-flex min-h-[2.5rem] items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                  !activeSubSlug ? chipActive : chipIdle,
                )}
              >
                Все товары
              </Link>
            </li>
            {filtered.map((s) => {
              const active = activeSubSlug === s.slug;
              const href = catalogHref(mainCategorySlug, { sub: s.slug });
              return (
                <li key={s.id} className="shrink-0 snap-start">
                  <Link
                    href={href}
                    className={cn(
                      "inline-flex max-w-[min(16rem,78vw)] min-h-[2.5rem] items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                      active ? chipActive : chipIdle,
                    )}
                  >
                    {s.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div
            className="max-h-[min(26rem,60vh)] space-y-1.5 overflow-y-auto pr-1 scrollbar-equilibrium"
            role="navigation"
            aria-label="Подкатегории"
          >
            <Link href={allHref} className={sidebarLink(!activeSubSlug)}>
              Все товары
            </Link>
            {filtered.map((s) => {
              const active = activeSubSlug === s.slug;
              const href = catalogHref(mainCategorySlug, { sub: s.slug });
              return (
                <Link key={s.id} href={href} className={sidebarLink(active)}>
                  {s.name}
                </Link>
              );
            })}
          </div>
        )}

        {emptySearch ? (
          <p className="pt-1 text-center text-sm text-[#403A34]/50">Ничего не найдено</p>
        ) : null}
      </div>
    </div>
  );
}
