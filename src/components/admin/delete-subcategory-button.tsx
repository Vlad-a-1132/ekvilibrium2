"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { deleteSubcategory } from "@/lib/actions/subcategory";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeleteSubcategoryButtonProps = {
  subCategoryId: string;
  subCategoryName: string;
  productCount: number;
};

export function DeleteSubcategoryButton({
  subCategoryId,
  subCategoryName,
  productCount,
}: DeleteSubcategoryButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const blocked = productCount > 0;

  function onClick() {
    if (blocked) return;
    const ok = window.confirm(
      `Удалить подкатегорию «${subCategoryName}»?\n\nЭто действие нельзя отменить.`,
    );
    if (!ok) return;

    startTransition(async () => {
      const res = await deleteSubcategory(subCategoryId);
      if (res.ok) {
        router.refresh();
        return;
      }
      window.alert(res.error);
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending || blocked}
      title={
        blocked
          ? "Нельзя удалить: в подкатегории есть товары. Перенесите или удалите их."
          : undefined
      }
      onClick={onClick}
      className={cn(
        blocked
          ? "cursor-not-allowed border-[#403A34]/15 text-[#403A34]/40"
          : "border-red-200/90 text-red-800 hover:border-red-300 hover:bg-red-50/90 focus-visible:ring-red-300",
      )}
    >
      {pending ? "Удаление…" : "Удалить"}
    </Button>
  );
}
