import Link from "next/link";

import {
  adminProductsHref,
  ADMIN_PRODUCTS_PAGE_SIZE,
  type AdminProductSortDir,
  type AdminProductSortField,
} from "@/lib/queries/admin-products";
import { cn } from "@/lib/utils";

type AdminProductsPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  sort: AdminProductSortField;
  dir: AdminProductSortDir;
};

export function AdminProductsPagination({
  page,
  totalPages,
  total,
  sort,
  dir,
}: AdminProductsPaginationProps) {
  if (totalPages <= 1) return null;

  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;
  const from = total === 0 ? 0 : (page - 1) * ADMIN_PRODUCTS_PAGE_SIZE + 1;
  const to = Math.min(page * ADMIN_PRODUCTS_PAGE_SIZE, total);

  return (
    <nav
      className="mt-6 flex flex-col gap-3 border-t border-[#403A34]/10 pt-5 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Страницы списка товаров"
    >
      <p className="text-sm text-[#403A34]/65">
        Показано{" "}
        <span className="font-medium tabular-nums text-[#403A34]">
          {from}–{to}
        </span>{" "}
        из{" "}
        <span className="font-medium tabular-nums text-[#403A34]">{total}</span>
      </p>

      <div className="flex items-center gap-3 text-sm text-[#403A34]">
        {prev != null ? (
          <Link
            href={adminProductsHref({ page: prev, sort, dir })}
            className="rounded-full border border-[#403A34]/20 px-4 py-2 transition-colors hover:bg-[#403A34]/8"
          >
            Назад
          </Link>
        ) : (
          <span className="rounded-full border border-transparent px-4 py-2 text-[#403A34]/35">
            Назад
          </span>
        )}
        <span className="tabular-nums text-[#403A34]/70">
          <span className="text-[#403A34]">{page}</span>
          <span className="mx-1">/</span>
          {totalPages}
        </span>
        {next != null ? (
          <Link
            href={adminProductsHref({ page: next, sort, dir })}
            className={cn(
              "rounded-full border border-[#403A34]/20 px-4 py-2 transition-colors hover:bg-[#403A34]/8",
            )}
          >
            Вперёд
          </Link>
        ) : (
          <span className="rounded-full border border-transparent px-4 py-2 text-[#403A34]/35">
            Вперёд
          </span>
        )}
      </div>
    </nav>
  );
}
