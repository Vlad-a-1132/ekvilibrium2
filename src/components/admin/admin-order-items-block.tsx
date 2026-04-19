import Link from "next/link";

import {
  orderItemDescriptionDisplay,
  productPublicPath,
  truncateDescriptionForList,
} from "@/lib/order-item-admin-display";
import { cn } from "@/lib/utils";

export type AdminOrderItemRow = {
  id: string;
  productName: string;
  productPrice: number;
  quantity: number;
  productId: string | null;
  product: { slug: string; description: string | null } | null;
};

type AdminOrderItemsBlockProps = {
  items: AdminOrderItemRow[];
  /** Короткая обрезка описания (списки) или полный текст (карточка заказа). */
  descriptionVariant: "list" | "detail";
  /** Для variant=list */
  listMaxChars?: number;
  className?: string;
};

export function AdminOrderItemsBlock({
  items,
  descriptionVariant,
  listMaxChars = 150,
  className,
}: AdminOrderItemsBlockProps) {
  if (items.length === 0) {
    return <p className="text-sm text-[#403A34]/55">Нет позиций.</p>;
  }

  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => {
        const rawDesc = orderItemDescriptionDisplay(item.product);
        const descShown =
          descriptionVariant === "list"
            ? truncateDescriptionForList(rawDesc, listMaxChars)
            : rawDesc;
        const href = productPublicPath(item.product?.slug ?? null);

        return (
          <li
            key={item.id}
            className="rounded-xl border border-[#403A34]/10 bg-[#fbf8f4]/60 px-3 py-2.5 text-sm"
          >
            <div className="font-medium text-[#403A34]">{item.productName}</div>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#403A34]/55">
              <span>
                Количество:{" "}
                <span className="font-medium tabular-nums text-[#403A34]/75">{item.quantity} шт.</span>
              </span>
              <span className="tabular-nums">
                {item.productPrice.toLocaleString("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                  maximumFractionDigits: 0,
                })}{" "}
                × {item.quantity} ={" "}
                <span className="font-medium text-[#403A34]/70">
                  {(item.productPrice * item.quantity).toLocaleString("ru-RU", {
                    style: "currency",
                    currency: "RUB",
                    maximumFractionDigits: 0,
                  })}
                </span>
              </span>
            </div>
            <p
              className={cn(
                "mt-1.5 text-xs leading-relaxed text-[#403A34]/68",
                descriptionVariant === "detail" && "whitespace-pre-wrap",
              )}
            >
              <span className="text-[#403A34]/45">Описание: </span>
              {descShown}
            </p>
            <div className="mt-2">
              {href ? (
                <Link
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-[#403A34] underline-offset-2 hover:underline"
                >
                  Открыть на витрине
                </Link>
              ) : (
                <span className="text-xs text-[#403A34]/45" title="Товар удалён или недоступен">
                  Ссылка недоступна
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
