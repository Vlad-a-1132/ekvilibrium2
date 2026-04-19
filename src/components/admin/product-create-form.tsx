"use client";

import { ProductForm, type ProductFormCategory } from "@/components/admin/product-form";

export type { ProductFormCategory } from "@/components/admin/product-form";

type ProductCreateFormProps = {
  categories: ProductFormCategory[];
};

/** Тонкая обёртка над `ProductForm` для страницы создания. */
export function ProductCreateForm({ categories }: ProductCreateFormProps) {
  return <ProductForm mode="create" categories={categories} />;
}
