"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";

import { MEGA_MENU_CATEGORY_INTRO } from "@/components/mega-menu/mega-menu-copy";
import { SiteContainer } from "@/components/layout/site-container";
import { cn } from "@/lib/utils";
import type { MainCategoryNav } from "@/types/catalog";

type MegaMenuProps = {
  category: MainCategoryNav | null;
  open: boolean;
};

export function MegaMenuPanel({ category, open }: MegaMenuProps) {
  const subcategories = Array.isArray(category?.subcategories) ? category!.subcategories : [];

  return (
    <AnimatePresence mode="wait">
      {open && category && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 right-0 top-full z-50 -mt-2 pt-2"
        >
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-3" aria-hidden />

          <div className="border-t border-[#403A34]/8 bg-[#fbf8f4]/95 shadow-[0_24px_60px_-20px_rgba(64,58,52,0.35)] backdrop-blur-md">
            <SiteContainer className="py-5 lg:py-6">
              <div
                className={cn(
                  "flex flex-col overflow-hidden rounded-2xl border border-[#403A34]/10 bg-white/90 shadow-[0_8px_32px_-12px_rgba(64,58,52,0.18)]",
                  "lg:min-h-[360px] lg:max-h-[420px]",
                )}
              >
                {/* Шапка: название, описание, ссылка «Весь раздел» */}
                <header className="shrink-0 border-b border-[#403A34]/8 px-5 py-4 sm:px-6 sm:py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div className="min-w-0 flex-1">
                      <h2 className="font-serif text-xl tracking-tight text-[#403A34] sm:text-[1.35rem]">
                        {category.name}
                      </h2>
                      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#403A34]/68">
                        {MEGA_MENU_CATEGORY_INTRO[category.slug] ??
                          "Подборка товаров раздела — выберите подкатегорию ниже или откройте полный каталог."}
                      </p>
                    </div>
                    <Link
                      href={`/catalog/${category.slug}`}
                      className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[#403A34] underline-offset-4 transition-colors hover:text-[#403A34]/80 hover:underline sm:mt-0.5 sm:pt-0.5"
                    >
                      Весь раздел
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </div>
                </header>

                {/* Контент: сетка подкатегорий + компактный promo справа */}
                <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:gap-5 lg:p-5 lg:pt-4">
                  <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-0.5 [-webkit-overflow-scrolling:touch]">
                      {subcategories.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-[#403A34]/12 bg-[#fbf8f4]/70 px-4 py-8 text-center text-sm text-[#403A34]/58">
                          Подкатегории появятся здесь после наполнения каталога.
                        </p>
                      ) : (
                        <ul className="grid grid-cols-2 gap-2.5 sm:gap-3">
                          {subcategories.map((sub) => (
                            <li key={sub.id} className="min-h-0">
                              <Link
                                href={`/catalog/${category.slug}?sub=${sub.slug}`}
                                className={cn(
                                  "group flex h-full min-h-[4rem] flex-col justify-center rounded-xl border border-[#403A34]/8 bg-[#fbf8f4]/40 px-3 py-2.5 text-sm text-[#403A34] transition-colors duration-150",
                                  "hover:border-[#403A34]/18 hover:bg-white hover:shadow-[0_4px_14px_-6px_rgba(64,58,52,0.2)]",
                                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403A34]/20",
                                )}
                              >
                                <span className="line-clamp-2 break-words leading-snug">{sub.name}</span>
                                <span className="mt-1.5 inline-flex items-center gap-0.5 text-[11px] font-medium text-[#403A34]/45 transition-colors group-hover:text-[#403A34]/65">
                                  Перейти
                                  <ChevronRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <aside className="shrink-0 lg:w-[min(200px,28%)] xl:w-[200px]">
                    <div className="flex h-full min-h-[7rem] flex-col justify-between rounded-xl border border-[#403A34]/10 bg-gradient-to-b from-[#f6f1eb]/90 to-[#fbf8f4] px-3.5 py-3.5 shadow-[0_2px_12px_-4px_rgba(64,58,52,0.12)] lg:min-h-0 lg:py-4">
                      <p className="text-xs leading-snug text-[#403A34]/75">
                        В каталоге — фильтры, сортировка и все товары раздела.
                      </p>
                      <Link
                        href={`/catalog/${category.slug}`}
                        className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#403A34]/15 bg-white/80 px-3 py-2 text-xs font-medium text-[#403A34] transition-colors hover:border-[#403A34]/25 hover:bg-white"
                      >
                        Открыть каталог
                        <ArrowRight className="size-3.5" aria-hidden />
                      </Link>
                    </div>
                  </aside>
                </div>
              </div>
            </SiteContainer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
