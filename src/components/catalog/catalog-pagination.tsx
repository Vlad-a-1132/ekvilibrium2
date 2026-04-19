import Link from "next/link";

import { catalogHref } from "@/lib/catalog-url";
import { cn } from "@/lib/utils";

type CatalogPaginationProps = {
  mainCategorySlug: string;
  activeSubSlug?: string | null;
  page: number;
  totalPages: number;
};

export function CatalogPagination({
  mainCategorySlug,
  activeSubSlug,
  page,
  totalPages,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-4 text-sm text-[#403A34]"
      aria-label="Страницы каталога"
    >
      {prev != null ? (
        <Link
          href={catalogHref(mainCategorySlug, { sub: activeSubSlug ?? undefined, page: prev })}
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
          href={catalogHref(mainCategorySlug, { sub: activeSubSlug ?? undefined, page: next })}
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
    </nav>
  );
}
