import { PackageSearch } from "lucide-react";

type CatalogEmptyStateProps = {
  hasSubFilter: boolean;
};

export function CatalogEmptyState({ hasSubFilter }: CatalogEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-[#403A34]/10 bg-gradient-to-b from-[#fbf8f4] to-[#f6f1eb] px-8 py-16 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <span className="flex size-14 items-center justify-center rounded-2xl border border-[#403A34]/10 bg-white/70 text-[#403A34]/45 shadow-sm">
          <PackageSearch className="size-7" strokeWidth={1.25} aria-hidden />
        </span>
        <p className="font-serif text-xl text-[#403A34]">Товары не найдены</p>
        <p className="text-sm leading-relaxed text-[#403A34]/65">
          {hasSubFilter
            ? "В выбранной подкатегории пока нет позиций. Попробуйте «Все товары» или другой подраздел."
            : "В этой категории ещё нет товаров. Когда ассортимент появится в базе, он отобразится здесь автоматически."}
        </p>
      </div>
    </div>
  );
}
