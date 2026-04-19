import Link from "next/link";
import { notFound } from "next/navigation";

import { CatalogEmptyState } from "@/components/catalog/catalog-empty-state";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { CatalogSubcategoryFilters } from "@/components/catalog/catalog-subcategory-filters";
import { ProductsGrid } from "@/components/catalog/products-grid";
import { getMainCategoryForCatalog, getSubcategoriesByMainCategorySlug } from "@/lib/queries/categories";
import { getProductsByCategory } from "@/lib/queries/products";
import { getWishlistProductIds } from "@/lib/queries/wishlist";

type CatalogPageProps = {
  params: Promise<{ mainCategorySlug: string }>;
  searchParams: Promise<{ sub?: string; page?: string }>;
};

function parsePage(raw: string | undefined) {
  const n = Number.parseInt(raw ?? "1", 10);
  if (Number.isNaN(n) || n < 1) return 1;
  return n;
}

export default async function CatalogMainCategoryPage({ params, searchParams }: CatalogPageProps) {
  const { mainCategorySlug } = await params;
  const sp = await searchParams;
  const activeSubSlug = sp.sub?.trim() || undefined;
  const page = parsePage(sp.page);

  const category = await getMainCategoryForCatalog(mainCategorySlug);
  if (!category) notFound();

  const subcategories = await getSubcategoriesByMainCategorySlug(mainCategorySlug);

  const { products, total, totalPages } = await getProductsByCategory({
    mainCategorySlug,
    subcategorySlug: activeSubSlug,
    page,
    limit: 12,
  });

  const wishlistIds = await getWishlistProductIds();

  const empty = total === 0;

  return (
    <div className="py-12 md:py-16">
      <nav className="text-sm text-[#403A34]/55">
        <Link href="/" className="hover:text-[#403A34]">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#403A34]">{category.name}</span>
      </nav>

      <h1 className="mt-6 font-serif text-3xl text-[#403A34] md:text-4xl">{category.name}</h1>
      <p className="mt-3 max-w-2xl text-[#403A34]/70">
        Выберите подкатегорию или смотрите все товары раздела. Список загружается из базы с учётом{" "}
        <code className="rounded bg-[#403A34]/10 px-1 text-sm">?sub=</code> и пагинации.
      </p>

      {subcategories.length > 0 && (
        <div className="mt-8 lg:hidden">
          <CatalogSubcategoryFilters
            variant="chips"
            mainCategorySlug={category.slug}
            subcategories={subcategories}
            activeSubSlug={activeSubSlug}
          />
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,220px)_1fr] lg:gap-12">
        {subcategories.length > 0 && (
          <aside className="hidden lg:block">
            <CatalogSubcategoryFilters
              variant="sidebar"
              mainCategorySlug={category.slug}
              subcategories={subcategories}
              activeSubSlug={activeSubSlug}
            />
          </aside>
        )}

        <div className="min-w-0">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <p className="text-sm text-[#403A34]/60">
              {empty ? (
                "Нет позиций по текущим условиям"
              ) : (
                <>
                  Найдено:{" "}
                  <span className="font-medium text-[#403A34] tabular-nums">{total}</span>
                </>
              )}
            </p>
          </div>

          {empty ? (
            <CatalogEmptyState hasSubFilter={Boolean(activeSubSlug)} />
          ) : (
            <>
              <ProductsGrid products={products} wishlistIds={wishlistIds} />
              <CatalogPagination
                mainCategorySlug={category.slug}
                activeSubSlug={activeSubSlug}
                page={page}
                totalPages={totalPages}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
