import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ProductPurchasePanelProps = {
  title: string;
  subtitle: string | null;
  onSale: boolean;
  priceLabel: string;
  oldPriceLabel: string | null;
  meta: ReactNode;
  specs: ReactNode;
  actions: ReactNode;
  className?: string;
};

export function ProductPurchasePanel({
  title,
  subtitle,
  onSale,
  priceLabel,
  oldPriceLabel,
  meta,
  specs,
  actions,
  className,
}: ProductPurchasePanelProps) {
  return (
    <div
      className={cn(
        "lg:sticky lg:top-24 lg:z-10 lg:self-start",
        "space-y-4",
        className,
      )}
    >
      <div className="rounded-2xl border border-[#403A34]/12 bg-gradient-to-b from-white/90 to-[#fbf8f4]/95 p-5 shadow-[0_12px_40px_-20px_rgba(64,58,52,0.25)] md:p-6">
        <div className="flex flex-wrap items-start gap-2">
          <h1 className="min-w-0 flex-1 font-serif text-2xl font-semibold leading-[1.15] tracking-tight text-[#403A34] md:text-[1.75rem]">
            {title}
          </h1>
          {onSale && (
            <span className="shrink-0 rounded-full bg-[#8b5a5a]/14 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6b3d3d]">
              Скидка
            </span>
          )}
        </div>

        {subtitle && (
          <p className="mt-2 text-sm font-medium text-[#403A34]/65">{subtitle}</p>
        )}

        <div className="mt-5 flex flex-wrap items-baseline gap-3 border-b border-dotted border-[#403A34]/15 pb-5">
          <span className="text-[1.85rem] font-bold tabular-nums tracking-tight text-[#403A34] md:text-[2rem]">
            {priceLabel}
          </span>
          {oldPriceLabel && (
            <span className="text-lg tabular-nums text-[#403A34]/45 line-through">{oldPriceLabel}</span>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-[#403A34]/10 bg-[#f6f1eb]/50 p-4 md:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#403A34]/45">
            Артикул и наличие
          </p>
          <div className="mt-3">{meta}</div>
        </div>
      </div>

      <div className="space-y-4">{specs}</div>

      <div className="border-t border-[#403A34]/10 pt-1">{actions}</div>
    </div>
  );
}
