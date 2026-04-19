import { ProductCard } from "@/components/product/product-card";
import type { CatalogProduct } from "@/types/catalog";

type RelatedProductsProps = {
  products: CatalogProduct[];
  wishlistProductIds: Set<string>;
};

export function RelatedProducts({ products, wishlistProductIds }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-14 border-t border-[#403A34]/10 pt-12 md:mt-16 md:pt-14" aria-labelledby="related-heading">
      <h2 id="related-heading" className="font-serif text-xl tracking-tight text-[#403A34] md:text-2xl">
        С этим товаром покупают
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            initialInWishlist={wishlistProductIds.has(p.id)}
            className="h-full"
          />
        ))}
      </div>
    </section>
  );
}
