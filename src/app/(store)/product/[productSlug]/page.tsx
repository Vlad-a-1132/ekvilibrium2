import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductActions } from "@/components/product/product-actions";
import { ProductDescription } from "@/components/product/product-description";
import { ProductGallery } from "@/components/product/product-gallery";
import { RelatedProducts } from "@/components/product/related-products";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { ProductSpecsTable, type SpecRow } from "@/components/product/product-specs-table";
import { getStockLabel } from "@/lib/product-stock-level";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/products";
import { getWishlistProductIds } from "@/lib/queries/wishlist";
import { cn } from "@/lib/utils";

type ProductPageProps = {
  params: Promise<{ productSlug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);
  if (!product) {
    return { title: "Товар" };
  }
  const description = product.description?.slice(0, 160).trim() ?? undefined;
  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);
  if (!product) notFound();

  const wishlistIds = await getWishlistProductIds();
  const initialInWishlist = wishlistIds.has(product.id);

  const relatedProducts = await getRelatedProducts({
    productId: product.id,
    mainCategoryId: product.mainCategoryId,
    subCategoryId: product.subCategoryId,
    limit: 6,
  });

  const price = Number(product.price);
  const oldPrice = product.oldPrice != null ? Number(product.oldPrice) : null;
  const onSale = oldPrice != null && oldPrice > price;

  const galleryImages = product.images.map((img) => ({
    id: img.id,
    path: img.url,
    alt: product.name,
  }));

  const priceLabel = price.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  });
  const oldPriceLabel =
    onSale && oldPrice != null
      ? oldPrice.toLocaleString("ru-RU", {
          style: "currency",
          currency: "RUB",
          maximumFractionDigits: 0,
        })
      : null;

  const subtitleParts = [product.mainCategory.name, product.subCategory?.name].filter(Boolean);
  const subtitle = subtitleParts.length > 0 ? subtitleParts.join(" · ") : null;

  const specRows: SpecRow[] = [
    { label: "Категория", value: product.mainCategory.name },
  ];
  if (product.subCategory) {
    specRows.push({ label: "Тип / подкатегория", value: product.subCategory.name });
  }
  if (product.color) {
    specRows.push({ label: "Цвет", value: product.color });
  }

  const availabilityLabel = getStockLabel(Number(product.stock));

  const metaBlock = (
    <dl className="grid gap-4 sm:grid-cols-2">
      {product.sku && (
        <div className="min-w-0">
          <dt className="text-[11px] font-medium uppercase tracking-wide text-[#403A34]/45">SKU</dt>
          <dd className="mt-1 truncate font-semibold tabular-nums text-[#403A34]">{product.sku}</dd>
        </div>
      )}
      <div className={cn(!product.sku && "sm:col-span-2")}>
        <dt className="text-[11px] font-medium uppercase tracking-wide text-[#403A34]/45">Наличие</dt>
        <dd
          className={cn(
            "mt-1 font-semibold",
            availabilityLabel === "Нет в наличии" ? "text-[#8b5a5a]" : "text-[#403A34]",
          )}
        >
          {availabilityLabel}
        </dd>
      </div>
    </dl>
  );

  return (
    <div className="py-8 md:py-12">
      <nav className="text-sm text-[#403A34]/55">
        <Link href="/" className="transition-colors hover:text-[#403A34]">
          Главная
        </Link>
        <span className="mx-2 text-[#403A34]/35">/</span>
        <Link
          href={`/catalog/${product.mainCategory.slug}`}
          className="transition-colors hover:text-[#403A34]"
        >
          {product.mainCategory.name}
        </Link>
        <span className="mx-2 text-[#403A34]/35">/</span>
        <span className="font-medium text-[#403A34]">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-10">
        <ProductGallery images={galleryImages} productName={product.name} />

        <ProductPurchasePanel
          title={product.name}
          subtitle={subtitle}
          onSale={onSale}
          priceLabel={priceLabel}
          oldPriceLabel={oldPriceLabel}
          meta={metaBlock}
          specs={<ProductSpecsTable rows={specRows} />}
          actions={<ProductActions productId={product.id} initialInWishlist={initialInWishlist} />}
        />
      </div>

      {product.description ? <ProductDescription text={product.description} /> : null}

      <RelatedProducts products={relatedProducts} wishlistProductIds={wishlistIds} />
    </div>
  );
}
