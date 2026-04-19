import Link from "next/link";

import { ProductsGrid } from "@/components/catalog/products-grid";
import type { CatalogProduct } from "@/types/catalog";

type HomeSpotlightProps = {
  products: CatalogProduct[];
  wishlistIds: Set<string>;
};

export function HomeSpotlight({ products, wishlistIds }: HomeSpotlightProps) {
  if (products.length === 0) {
    return (
      <section className="border-t border-[#403A34]/10 pt-16">
        <h2 className="font-serif text-2xl text-[#403A34] md:text-3xl">Новинки</h2>
        <p className="mt-2 max-w-xl text-sm text-[#403A34]/65">
          Когда в базе появятся товары, здесь автоматически покажется подборка последних поступлений.
        </p>
        <div className="mt-10 rounded-2xl border border-dashed border-[#403A34]/20 bg-[#fbf8f4]/80 px-8 py-14 text-center text-sm text-[#403A34]/55">
          Пока нет товаров для витрины — загляните в каталог позже или добавьте позиции в админке.
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-[#403A34]/10 pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#403A34] md:text-3xl">Новинки</h2>
          <p className="mt-2 text-sm text-[#403A34]/65">Последние добавленные товары — не полный каталог.</p>
        </div>
        <Link
          href="/catalog/kanctovary"
          className="text-sm font-medium text-[#403A34]/80 underline-offset-4 transition-colors hover:text-[#403A34] hover:underline"
        >
          В каталог →
        </Link>
      </div>
      <div className="mt-10">
        <ProductsGrid products={products} wishlistIds={wishlistIds} />
      </div>
    </section>
  );
}
