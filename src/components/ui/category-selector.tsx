"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Backpack, Layers, Package, Palette, PenLine } from "lucide-react";

import { cn } from "@/lib/utils";

const ICON_BY_SLUG: Record<string, LucideIcon> = {
  kanctovary: PenLine,
  bumaga: Layers,
  tvorchestvo: Palette,
  ryukzaki: Backpack,
};

const HINT_BY_SLUG: Partial<Record<string, string>> = {
  kanctovary: "Канцтовары, бумага, организация рабочего места",
  bumaga: "Тетради, альбомы, планинги и блокноты",
  tvorchestvo: "Краски, пластилин, материалы для творчества",
  ryukzaki: "Рюкзаки, сумки, пеналы и аксессуары",
};

export type CategorySelectorItem = {
  id: string;
  name: string;
  /** Для иконки и подсказки; если не задано — без иконки/дефолтный пакет */
  slug?: string;
  description?: string;
};

type CategorySelectorProps = {
  items: CategorySelectorItem[];
  value: string | null;
  onChange: (id: string | null) => void;
  hiddenInputName?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  /** Скелетон при подгрузке данных */
  isLoading?: boolean;
};

function CategoryCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-[#403A34]/8 bg-gradient-to-br from-[#fbf8f4] to-[#ede6dc]/40 p-5 shadow-inner"
        >
            <div className="flex gap-4">
            <div className="size-12 shrink-0 rounded-xl bg-[#403A34]/10" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 max-w-[12rem] rounded bg-[#403A34]/12" />
              <div className="h-3 w-full rounded bg-[#403A34]/8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategorySelector({
  items,
  value,
  onChange,
  hiddenInputName,
  label = "Раздел",
  className,
  disabled,
  isLoading,
}: CategorySelectorProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <p className="text-sm font-medium text-[#403A34]">{label}</p>
        <CategoryCardSkeleton />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {hiddenInputName ? (
        <input type="hidden" name={hiddenInputName} value={value ?? ""} readOnly />
      ) : null}
      <p className="text-sm font-semibold tracking-tight text-[#403A34]">{label}</p>
      <div
        className="grid grid-cols-1 gap-3 md:grid-cols-2"
        role="tablist"
        aria-label={label}
      >
        {items.map((item) => {
          const active = value === item.id;
          const Icon = item.slug ? ICON_BY_SLUG[item.slug] ?? Package : Package;
          const hint =
            item.description ??
            (item.slug ? HINT_BY_SLUG[item.slug] : undefined) ??
            undefined;

          return (
            <motion.button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={disabled}
              onClick={() => onChange(item.id)}
              whileHover={disabled ? undefined : { scale: 1.02 }}
              whileTap={disabled ? undefined : { scale: 0.99 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border text-left transition-shadow duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403A34]/35 focus-visible:ring-offset-2",
                disabled && "pointer-events-none opacity-45",
                active
                  ? "border-[#403A34]/50 bg-gradient-to-br from-[#403A34] via-[#4a433c] to-[#403A34] text-[#f6f1eb] shadow-lg shadow-[#403A34]/25 ring-2 ring-[#403A34]/30"
                  : "border-[#403A34]/10 bg-gradient-to-br from-white via-[#fbf8f4] to-[#ede6dc]/50 text-[#403A34] shadow-md hover:border-[#403A34]/22 hover:shadow-lg",
              )}
            >
              <div className="relative flex gap-4 p-5">
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-200",
                    active
                      ? "bg-white/15 text-[#f6f1eb]"
                      : "bg-[#403A34]/6 text-[#403A34]/75 group-hover:bg-[#403A34]/10",
                  )}
                >
                  <Icon className="size-6" strokeWidth={1.5} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "font-semibold leading-snug tracking-tight",
                      active ? "text-[#f6f1eb]" : "text-[#403A34]",
                    )}
                  >
                    {item.name}
                  </p>
                  {hint ? (
                    <p
                      className={cn(
                        "mt-1.5 text-xs leading-relaxed",
                        active ? "text-[#f6f1eb]/75" : "text-[#403A34]/55",
                      )}
                    >
                      {hint}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
