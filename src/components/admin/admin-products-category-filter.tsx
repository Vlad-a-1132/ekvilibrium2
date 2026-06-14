import Link from "next/link";

import {
  adminProductsHref,
  type AdminProductSortDir,
  type AdminProductSortField,
} from "@/lib/queries/admin-products";
import { cn } from "@/lib/utils";

export type AdminProductsCategoryOption = {
  slug: string;
  name: string;
};

type AdminProductsCategoryFilterProps = {
  categories: AdminProductsCategoryOption[];
  activeCategory?: string;
  sort: AdminProductSortField;
  dir: AdminProductSortDir;
};

export function AdminProductsCategoryFilter({
  categories,
  activeCategory,
  sort,
  dir,
}: AdminProductsCategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#403A34]/50">Категория</span>
      <Link
        href={adminProductsHref({ page: 1, sort, dir })}
        className={cn(
          "rounded-full border px-3 py-1.5 text-sm transition-colors",
          !activeCategory
            ? "border-[#403A34] bg-[#403A34] text-[#f6f1eb]"
            : "border-[#403A34]/15 bg-white/70 text-[#403A34]/80 hover:border-[#403A34]/25 hover:bg-white",
        )}
      >
        Все
      </Link>
      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <Link
            key={cat.slug}
            href={adminProductsHref({ page: 1, sort, dir, category: cat.slug })}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              isActive
                ? "border-[#403A34] bg-[#403A34] text-[#f6f1eb]"
                : "border-[#403A34]/15 bg-white/70 text-[#403A34]/80 hover:border-[#403A34]/25 hover:bg-white",
            )}
          >
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
