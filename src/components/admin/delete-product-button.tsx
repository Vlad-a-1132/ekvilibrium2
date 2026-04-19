"use client";

import { useTransition } from "react";

import { deleteProduct } from "@/lib/actions/product";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    const ok = window.confirm(
      `Удалить товар «${productName}»?\n\nЭто действие нельзя отменить: карточка, изображения и связи с корзиной/избранным будут удалены.`,
    );
    if (!ok) return;

    startTransition(async () => {
      try {
        const res = await deleteProduct(productId);
        if (res && "ok" in res && res.ok === false) {
          window.alert(res.error);
        }
      } catch {
        /* успешный redirect из server action */
      }
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={onClick}
      className={cn(
        "border-red-200/90 text-red-800 hover:border-red-300 hover:bg-red-50/90",
        "focus-visible:ring-red-300",
      )}
    >
      {pending ? "Удаление…" : "Удалить"}
    </Button>
  );
}
