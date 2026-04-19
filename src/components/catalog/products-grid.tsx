import { ProductCard } from "@/components/product/product-card";
import type { CatalogProduct } from "@/types/catalog";

type ProductsGridProps = {
  products: CatalogProduct[];
  wishlistIds?: Set<string>;
};

export function ProductsGrid({ products, wishlistIds }: ProductsGridProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} initialInWishlist={wishlistIds?.has(p.id) ?? false} />
        </li>
      ))}
    </ul>
  );
}
