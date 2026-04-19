"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { updateSubcategoryName } from "@/lib/actions/subcategory";
import { cn } from "@/lib/utils";

type SubcategoryRenameFormProps = {
  subCategoryId: string;
  initialName: string;
  compact?: boolean;
};

export function SubcategoryRenameForm({
  subCategoryId,
  initialName,
  compact,
}: SubcategoryRenameFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [pending, startTransition] = useTransition();
  const unchanged = name.trim() === initialName.trim();

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || unchanged) return;

    startTransition(async () => {
      const res = await updateSubcategoryName(subCategoryId, trimmed);
      if (res.ok) {
        setName(trimmed);
        router.refresh();
        return;
      }
      window.alert(res.error);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-wrap items-center gap-2", compact && "max-w-[min(100%,22rem)]")}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={pending}
        className="min-w-[10rem] flex-1 rounded-lg border border-[#403A34]/15 bg-white px-2.5 py-1.5 text-sm text-[#403A34] outline-none ring-[#403A34]/15 focus:border-[#403A34]/25 focus:ring-2 disabled:opacity-60"
        aria-label="Название подкатегории"
        maxLength={200}
      />
      <Button
        type="submit"
        size="sm"
        variant="outline"
        disabled={pending || unchanged || !name.trim()}
        className="shrink-0 border-[#403A34]/20 text-[#403A34] hover:bg-[#403A34]/5"
      >
        {pending ? "Сохранение…" : "Сохранить"}
      </Button>
    </form>
  );
}
