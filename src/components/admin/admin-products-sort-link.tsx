import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";

import {
  adminProductsHref,
  nextAdminProductSortDir,
  type AdminProductSortDir,
  type AdminProductSortField,
} from "@/lib/queries/admin-products";
import { cn } from "@/lib/utils";

type AdminProductsSortLinkProps = {
  label: string;
  field: AdminProductSortField;
  currentSort: AdminProductSortField;
  currentDir: AdminProductSortDir;
  category?: string;
};

export function AdminProductsSortLink({
  label,
  field,
  currentSort,
  currentDir,
  category,
}: AdminProductsSortLinkProps) {
  const isActive = currentSort === field;
  const nextDir = nextAdminProductSortDir(field, currentSort, currentDir);

  return (
    <Link
      href={adminProductsHref({ page: 1, sort: field, dir: nextDir, category })}
      className={cn(
        "inline-flex items-center gap-1 transition-colors hover:text-[#403A34]",
        isActive ? "text-[#403A34]" : "text-[#403A34]/55",
      )}
    >
      <span>{label}</span>
      {isActive ? (
        currentDir === "asc" ? (
          <ArrowUp className="size-3.5 shrink-0" aria-hidden />
        ) : (
          <ArrowDown className="size-3.5 shrink-0" aria-hidden />
        )
      ) : null}
    </Link>
  );
}
