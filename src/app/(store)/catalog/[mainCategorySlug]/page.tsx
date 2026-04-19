import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CatalogEmptyState } from "@/components/catalog/catalog-empty-state";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { CatalogSubcategoryFilters } from "@/components/catalog/catalog-subcategory-filters";
import { ProductsGrid } from "@/components/catalog/products-grid";
import { getMainCategoryForCatalog, getSubcategoriesByMainCategorySlug } from "@/lib/queries/categories";
import { getProductsByCategory } from "@/lib/queries/products";
import { getWishlistProductIds } from "@/lib/queries/wishlist";
import { absoluteUrl } from "@/lib/seo/site";
import { mainCategorySeo } from "@/lib/seo/strings";
import { truncateMetaDescription } from "@/lib/seo/truncate";

type CatalogPageProps = {
  params: Promise<{ mainCategorySlug: string }>;
  searchParams: Promise<{ sub?: string; page?: string }>;
};

function parsePage(raw: string | undefined) {
  const n = Number.parseInt(raw ?? "1", 10);
  if (Number.isNaN(n) || n < 1) return 1;
  return n;
}

export async function generateMetadata({ params, searchParams }: CatalogPageProps): Promise<Metadata> {
  const { mainCategorySlug } = await params;
  const sp = await searchParams;
  const activeSubSlug = sp.sub?.trim() || undefined;
  const pageNum = parsePage(sp.page);

  const category = await getMainCategoryForCatalog(mainCategorySlug);
  if (!category) {
    return { title: "Каталог" };
  }

  const seo = mainCategorySeo[mainCategorySlug];
  const sub = activeSubSlug ? category.subcategories.find((s) => s.slug === activeSubSlug) : undefined;

  let title =
    seo?.title ?? `${category.name} в Пятигорске — купить в «Эквилибриум»`;
  let description =
    seo?.description ??
    `Каталог «${category.name}» в Пятигорске. Интернет-магазин канцелярии «Эквилибриум»: цены и наличие в карточках товаров.`;

  if (sub) {
    title = `${sub.name} в Пятигорске — ${category.name} | Эквилибриум`;
    description = truncateMetaDescription(
      `${sub.name} в каталоге «${category.name}», Пятигорск. «Эквилибриум»: канцелярия и канцтовары онлайн — цены и наличие в карточках.`,
    );
  }

  if (pageNum > 1) {
    title = `${title} — стр. ${pageNum}`;
  }

  const canonical = absoluteUrl(
    `/catalog/${mainCategorySlug}`,
    {
      ...(activeSubSlug ? { sub: activeSubSlug } : {}),
      ...(pageNum > 1 ? { page: String(pageNum) } : {}),
    },
  );

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
    },
    robots: { index: true, follow: true },
  };
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

  const activeSub = activeSubSlug ? subcategories.find((s) => s.slug === activeSubSlug) : undefined;

  return (
    <div className="py-12 md:py-16">
      <nav className="text-sm text-[#403A34]/55">
        <Link href="/" className="hover:text-[#403A34]">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#403A34]">{category.name}</span>
      </nav>

      <h1 className="mt-6 font-serif text-3xl text-[#403A34] md:text-4xl">
        {activeSub ? (
          <>
            <span className="block">{activeSub.name}</span>
            <span className="mt-1 block text-xl font-normal leading-snug text-[#403A34]/72 md:text-2xl">
              {category.name}
            </span>
          </>
        ) : (
          category.name
        )}
      </h1>

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
