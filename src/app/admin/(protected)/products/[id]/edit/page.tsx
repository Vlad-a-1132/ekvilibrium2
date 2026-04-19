import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductForm, type ProductFormInitialValues } from "@/components/admin/product-form";
import { getMainCategoriesForProductForm } from "@/lib/queries/categories";
import { getProductForAdminEdit } from "@/lib/queries/products";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; copied?: string }>;
};

export default async function AdminProductEditPage({ params, searchParams }: EditProductPageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const saved = sp.saved === "1";
  const copied = sp.copied === "1";

  const [product, rows] = await Promise.all([getProductForAdminEdit(id), getMainCategoriesForProductForm()]);

  if (!product) {
    notFound();
  }

  if (rows.length === 0) {
    return (
      <div className="max-w-xl">
        <h2 className="font-serif text-2xl text-[#403A34]">Редактирование товара</h2>
        <p className="mt-4 text-sm text-[#403A34]/80">
          Категории не загружены — проверьте БД и сид категорий.
        </p>
        <Link href="/admin/products" className="mt-6 inline-block text-sm text-[#403A34] underline">
          ← К списку товаров
        </Link>
      </div>
    );
  }

  const categories = rows.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    subcategories: c.subcategories.map((s) => ({ id: s.id, name: s.name, slug: s.slug })),
  }));

  const initialValues: ProductFormInitialValues = {
    name: product.name,
    mainCategoryId: product.mainCategoryId,
    subcategoryId: product.subCategoryId,
    price: String(product.price),
    oldPrice: product.oldPrice != null ? String(product.oldPrice) : "",
    sku: product.sku ?? "",
    stock: String(product.stock),
    color: product.color ?? "",
    description: product.description ?? "",
    seoTitle: product.seoTitle ?? "",
    seoDescription: product.seoDescription ?? "",
    isActive: product.isActive,
    images: product.images.map((img) => ({ key: img.id, path: img.url })),
  };

  return (
    <div>
      {saved && (
        <div className="mb-8 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-950">
          <p className="font-medium">Изменения сохранены.</p>
        </div>
      )}
      {copied && (
        <div className="mb-8 rounded-xl border border-sky-200/80 bg-sky-50/90 px-4 py-3 text-sm text-sky-950">
          <p className="font-medium">Создана копия товара.</p>
          <p className="mt-1 text-sky-900/85">
            Укажите уникальный SKU и при необходимости поправьте название — затем сохраните.
          </p>
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#403A34]">Редактирование товара</h2>
          <p className="mt-2 text-sm text-[#403A34]/70">
            Slug на витрине:{" "}
            <code className="rounded bg-[#403A34]/10 px-1.5 py-0.5 text-xs">{product.slug}</code> — при
            смене названия не меняется автоматически.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/product/${product.slug}`}
            className="text-sm text-[#403A34]/80 underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Открыть на витрине
          </Link>
          <Link href="/admin/products" className="text-sm text-[#403A34]/80 underline-offset-4 hover:underline">
            Назад к списку
          </Link>
        </div>
      </div>

      <ProductForm
        key={product.id}
        mode="edit"
        categories={categories}
        productId={product.id}
        initialValues={initialValues}
      />
    </div>
  );
}
