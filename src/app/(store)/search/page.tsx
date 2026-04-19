import type { Metadata } from "next";
import Link from "next/link";

import { ProductsGrid } from "@/components/catalog/products-grid";
import { searchProducts } from "@/lib/queries/products";
import { noIndexMetadata } from "@/lib/seo/private-pages";
import { getWishlistProductIds } from "@/lib/queries/wishlist";

export const metadata: Metadata = noIndexMetadata(
  "Поиск по каталогу",
  "Поиск товаров в каталоге «Эквилибриум». Страница поиска не индексируется, чтобы избежать дублей.",
);

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const raw = sp.q?.trim() ?? "";
  const hasQuery = raw.length > 0;

  const wishlistIds = await getWishlistProductIds();
  const result = hasQuery ? await searchProducts(raw) : { products: [], total: 0 };
  const { products, total } = result;

  return (
    <div className="py-10 md:py-14">
      <nav className="text-sm text-[#403A34]/55">
        <Link href="/" className="transition-colors hover:text-[#403A34]">
          Главная
        </Link>
        <span className="mx-2 text-[#403A34]/35">/</span>
        <span className="font-medium text-[#403A34]">Поиск</span>
      </nav>

      <h1 className="mt-6 font-serif text-3xl tracking-tight text-[#403A34] md:text-4xl">Результаты поиска</h1>

      {!hasQuery ? (
        <div className="mt-10 rounded-3xl border border-[#403A34]/10 bg-[#fbf8f4] px-8 py-16 text-center shadow-[0_20px_50px_-28px_rgba(64,58,52,0.3)]">
          <p className="font-serif text-lg text-[#403A34]">Введите запрос в строке поиска в шапке</p>
          <p className="mt-3 text-sm text-[#403A34]/65">
            Ищем по названию, описанию и артикулу (SKU).
          </p>
          <Link
            href="/catalog/kanctovary"
            className="mt-8 inline-flex rounded-2xl border border-[#403A34]/15 bg-white px-6 py-3 text-sm font-semibold text-[#403A34] shadow-sm transition-colors hover:bg-[#f6f1eb]"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-3 text-sm text-[#403A34]/70">
            Запрос: <span className="font-medium text-[#403A34]">&ldquo;{raw}&rdquo;</span>
          </p>
          <p className="mt-2 text-sm font-medium text-[#403A34]">Найдено: {total}</p>

          {total === 0 ? (
            <div className="mt-10 rounded-3xl border border-[#403A34]/10 bg-gradient-to-br from-[#fbf8f4] to-[#ede6dc]/40 px-8 py-16 text-center">
              <p className="font-serif text-xl text-[#403A34]">Ничего не нашли</p>
              <p className="mt-3 max-w-md mx-auto text-sm leading-relaxed text-[#403A34]/68">
                Попробуйте другой запрос или откройте каталог и выберите раздел вручную.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/catalog/kanctovary"
                  className="inline-flex rounded-2xl bg-[#403A34] px-6 py-3 text-sm font-semibold text-[#f6f1eb] shadow-lg shadow-[#403A34]/15 transition-colors hover:bg-[#2f2a25]"
                >
                  Канцтовары
                </Link>
                <Link
                  href="/catalog/bumaga"
                  className="inline-flex rounded-2xl border border-[#403A34]/15 bg-white px-6 py-3 text-sm font-semibold text-[#403A34] transition-colors hover:bg-white/90"
                >
                  Бумажная продукция
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-10">
              <ProductsGrid products={products} wishlistIds={wishlistIds} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
