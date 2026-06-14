"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminProductsHref } from "@/lib/queries/admin-products";
import type { AdminProductSortDir, AdminProductSortField } from "@/lib/queries/admin-products";

type AdminProductsPageJumpProps = {
  page: number;
  totalPages: number;
  sort: AdminProductSortField;
  dir: AdminProductSortDir;
  category?: string;
};

export function AdminProductsPageJump({
  page,
  totalPages,
  sort,
  dir,
  category,
}: AdminProductsPageJumpProps) {
  const router = useRouter();
  const [value, setValue] = useState(String(page));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) return;
    const nextPage = Math.min(Math.max(1, parsed), totalPages);
    router.push(adminProductsHref({ page: nextPage, sort, dir, category }));
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <label className="sr-only" htmlFor="admin-products-page-jump">
        Номер страницы
      </label>
      <Input
        id="admin-products-page-jump"
        type="number"
        min={1}
        max={totalPages}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-9 w-20 tabular-nums"
      />
      <Button type="submit" variant="outline" size="sm">
        Перейти
      </Button>
    </form>
  );
}
