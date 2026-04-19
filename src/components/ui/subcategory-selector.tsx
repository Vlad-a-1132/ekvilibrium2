"use client";

import { motion } from "framer-motion";
import { LayoutGrid, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type SubcategorySelectorItem = {
  id: string;
  name: string;
  slug?: string;
  /** Число товаров (опционально, для будущего) */
  count?: number;
};

type SubcategorySelectorProps = {
  items: SubcategorySelectorItem[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  searchPlaceholder?: string;
  label?: string;
  className?: string;
  isLoading?: boolean;
};

function SubcategorySkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-10 animate-pulse rounded-xl bg-[#403A34]/8" />
      <div className="grid max-h-[min(22rem,50vh)] grid-cols-2 gap-2 overflow-hidden rounded-2xl border border-[#403A34]/8 bg-[#fbf8f4]/50 p-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-[#403A34]/6" />
        ))}
      </div>
    </div>
  );
}

export function SubcategorySelector({
  items,
  value,
  onChange,
  disabled,
  searchPlaceholder = "Поиск по названию…",
  label = "Подкатегория",
  className,
  isLoading,
}: SubcategorySelectorProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.name.toLowerCase().includes(q));
  }, [items, debouncedQuery]);

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <p className="text-sm font-semibold tracking-tight text-[#403A34]">{label}</p>
        <SubcategorySkeleton />
      </div>
    );
  }

  if (disabled) {
    return (
      <div className={cn("space-y-4", className)}>
        <p className="text-sm font-semibold tracking-tight text-[#403A34]">{label}</p>
        <div className="rounded-2xl border border-dashed border-[#403A34]/15 bg-gradient-to-br from-[#fbf8f4]/80 to-[#ede6dc]/30 px-6 py-14 text-center text-sm text-[#403A34]/50 shadow-inner">
          Сначала выберите раздел выше
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        <p className="text-sm font-semibold tracking-tight text-[#403A34]">{label}</p>
        <div className="rounded-2xl border border-dashed border-[#403A34]/15 bg-[#fbf8f4]/60 px-6 py-14 text-center text-sm text-[#403A34]/50">
          Нет подкатегорий для этого раздела
        </div>
      </div>
    );
  }

  const emptySearch = query.trim() !== "" && filtered.length === 0;

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-sm font-semibold tracking-tight text-[#403A34]">{label}</p>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#403A34]/35"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-11 rounded-2xl border-[#403A34]/12 bg-white/95 pl-10 shadow-sm transition-shadow duration-200 placeholder:text-[#403A34]/40 focus-visible:shadow-md"
          autoComplete="off"
        />
      </div>
      <div
        className={cn(
          "max-h-[min(22rem,50vh)] overflow-y-auto rounded-2xl border border-[#403A34]/10 bg-gradient-to-b from-white/90 to-[#fbf8f4]/50 p-3 shadow-md scrollbar-equilibrium",
        )}
        role="listbox"
        aria-label={label}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {filtered.map((s) => {
            const active = value === s.id;
            const showCount = typeof s.count === "number" && s.count > 0;
            return (
              <motion.button
                key={s.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => onChange(s.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className={cn(
                  "flex min-h-[4.25rem] flex-col justify-between rounded-xl border px-3 py-3 text-left transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403A34]/30 focus-visible:ring-offset-1",
                  active
                    ? "border-[#403A34] bg-[#403A34] text-[#f6f1eb] shadow-lg"
                    : "border-[#403A34]/10 bg-white/70 text-[#403A34] hover:border-[#403A34]/25 hover:shadow-md",
                )}
              >
                <span className="flex items-start gap-2">
                  <LayoutGrid
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      active ? "text-[#f6f1eb]/80" : "text-[#403A34]/35",
                    )}
                    aria-hidden
                  />
                  <span className="text-sm font-medium leading-snug">{s.name}</span>
                </span>
                {showCount ? (
                  <span
                    className={cn(
                      "mt-2 inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                      active ? "bg-white/15 text-[#f6f1eb]/90" : "bg-[#403A34]/8 text-[#403A34]/65",
                    )}
                  >
                    {s.count} шт.
                  </span>
                ) : null}
              </motion.button>
            );
          })}
        </div>
        {emptySearch ? (
          <p className="py-10 text-center text-sm text-[#403A34]/50">Ничего не найдено</p>
        ) : null}
      </div>
    </div>
  );
}
