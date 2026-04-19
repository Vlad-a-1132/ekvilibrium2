"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminAuth } from "@/lib/auth/admin";
import { isCanonicalMainSlug } from "@/lib/category-canonical";
import { parseAdminStockInput } from "@/lib/product-stock-level";
import { prisma } from "@/lib/prisma";
import { generateUniqueProductSlug } from "@/lib/product-slug";

export type CreateProductInput = {
  name: string;
  mainCategoryId: string;
  subcategoryId: string | null;
  price: string;
  oldPrice: string | null;
  sku: string | null;
  stock: string;
  color: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  isActive: boolean;
  imagePaths: string[];
};

export type UpdateProductInput = CreateProductInput & {
  productId: string;
};

/** Результат мутации товара без redirect — стабильный JSON для flight server actions. */
export type ProductMutationResult = { ok: true } | { ok: false; error: string };

function parseMoney(raw: string): { ok: true; value: number } | { ok: false; error: string } {
  const t = raw.trim().replace(",", ".");
  if (!t) return { ok: false, error: "Укажите цену." };
  const n = Number.parseFloat(t);
  if (Number.isNaN(n) || n < 0) return { ok: false, error: "Некорректная цена." };
  return { ok: true, value: n };
}

function parseOptionalMoney(raw: string | null | undefined): number | null {
  const t = raw?.trim();
  if (!t) return null;
  const n = Number.parseFloat(t.replace(",", "."));
  if (Number.isNaN(n) || n < 0) return null;
  return n;
}

async function validateCategories(mainCategoryId: string, subcategoryId: string | null) {
  const main = await prisma.mainCategory.findFirst({
    where: { id: mainCategoryId },
    select: { id: true, slug: true },
  });
  if (!main || !isCanonicalMainSlug(main.slug)) {
    return { ok: false as const, error: "Категория не найдена или не входит в актуальный каталог." };
  }
  const subId = subcategoryId?.trim() || null;
  if (!subId) {
    return { ok: false as const, error: "Выберите подкатегорию." };
  }
  const sub = await prisma.subCategory.findFirst({
    where: { id: subId, mainCategoryId: main.id },
    select: { id: true },
  });
  if (!sub) {
    return { ok: false as const, error: "Подкатегория не принадлежит выбранной категории." };
  }
  return { ok: true as const, main, sub };
}

export async function createProduct(input: CreateProductInput): Promise<ProductMutationResult> {
  await requireAdminAuth();
  const name = input.name.trim();
  if (!name) {
    return { ok: false, error: "Название обязательно." };
  }

  const mainCategoryId = input.mainCategoryId.trim();
  if (!mainCategoryId) {
    return { ok: false, error: "Выберите основную категорию." };
  }

  const priceResult = parseMoney(input.price);
  if (!priceResult.ok) {
    return { ok: false, error: priceResult.error };
  }

  const cat = await validateCategories(mainCategoryId, input.subcategoryId);
  if (!cat.ok) {
    return { ok: false, error: cat.error };
  }

  const stockResult = parseAdminStockInput(input.stock);
  if (!stockResult.ok) {
    return { ok: false, error: stockResult.error };
  }
  const stock = stockResult.value;

  const sku = input.sku?.trim() || null;
  if (!sku) {
    return { ok: false, error: "Укажите SKU." };
  }

  const skuTaken = await prisma.product.findFirst({
    where: { sku },
    select: { id: true },
  });
  if (skuTaken) {
    return { ok: false, error: "Такой SKU уже занят." };
  }

  const slug = await generateUniqueProductSlug(name);
  const oldPrice = parseOptionalMoney(input.oldPrice);
  const seoTitle = input.seoTitle?.trim() || null;
  const seoDescription = input.seoDescription?.trim() || null;

  const paths = Array.from(new Set(input.imagePaths.filter(Boolean)));

  try {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          slug,
          mainCategoryId: cat.main.id,
          subCategoryId: cat.sub.id,
          price: priceResult.value,
          oldPrice,
          sku,
          stock,
          color: input.color?.trim() || null,
          description: input.description?.trim() || null,
          seoTitle,
          seoDescription,
          isActive: input.isActive,
        },
      });

      if (paths.length > 0) {
        await tx.productImage.createMany({
          data: paths.map((p, i) => ({
            productId: product.id,
            url: p,
            isPrimary: i === 0,
          })),
        });
      }
    });
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Не удалось сохранить товар. Проверьте данные и уникальность SKU/slug." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/", "layout");

  return { ok: true };
}

export async function updateProduct(input: UpdateProductInput): Promise<ProductMutationResult> {
  await requireAdminAuth();
  const { productId } = input;
  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, slug: true },
  });
  if (!existing) {
    return { ok: false, error: "Товар не найден." };
  }

  const name = input.name.trim();
  if (!name) {
    return { ok: false, error: "Название обязательно." };
  }

  const mainCategoryId = input.mainCategoryId.trim();
  if (!mainCategoryId) {
    return { ok: false, error: "Выберите основную категорию." };
  }

  const priceResult = parseMoney(input.price);
  if (!priceResult.ok) {
    return { ok: false, error: priceResult.error };
  }

  const cat = await validateCategories(mainCategoryId, input.subcategoryId);
  if (!cat.ok) {
    return { ok: false, error: cat.error };
  }

  const stockResult = parseAdminStockInput(input.stock);
  if (!stockResult.ok) {
    return { ok: false, error: stockResult.error };
  }
  const stock = stockResult.value;

  const skuRaw = input.sku?.trim() || null;
  if (skuRaw) {
    const skuTaken = await prisma.product.findFirst({
      where: { sku: skuRaw, NOT: { id: productId } },
      select: { id: true },
    });
    if (skuTaken) {
      return { ok: false, error: "Такой SKU уже занят другим товаром." };
    }
  }

  const oldPrice = parseOptionalMoney(input.oldPrice);
  const seoTitle = input.seoTitle?.trim() || null;
  const seoDescription = input.seoDescription?.trim() || null;
  const paths = Array.from(new Set(input.imagePaths.filter(Boolean)));

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data: {
          name,
          mainCategoryId: cat.main.id,
          subCategoryId: cat.sub.id,
          price: priceResult.value,
          oldPrice,
          sku: skuRaw,
          stock,
          color: input.color?.trim() || null,
          description: input.description?.trim() || null,
          seoTitle,
          seoDescription,
          isActive: input.isActive,
        },
      });

      await tx.productImage.deleteMany({ where: { productId } });
      if (paths.length > 0) {
        await tx.productImage.createMany({
          data: paths.map((p, i) => ({
            productId,
            url: p,
            isPrimary: i === 0,
          })),
        });
      }
    });
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Не удалось обновить товар." };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath(`/product/${existing.slug}`);
  revalidatePath(`/catalog/${cat.main.slug}`);
  revalidatePath("/", "layout");

  return { ok: true };
}

/** Форма «Копировать» в списке товаров: скрытое поле `productId`. */
export async function copyProductFromForm(formData: FormData): Promise<never> {
  await requireAdminAuth();
  const raw = formData.get("productId");
  const id = typeof raw === "string" ? raw.trim() : "";
  if (!id) {
    redirect("/admin/products");
  }
  return copyProduct(id);
}

export async function copyProduct(sourceId: string): Promise<never> {
  await requireAdminAuth();
  const source = await prisma.product.findUnique({
    where: { id: sourceId },
    include: { images: { orderBy: { id: "asc" } } },
  });

  if (!source) {
    redirect("/admin/products");
  }

  const name = `${source.name} (копия)`;
  const slug = await generateUniqueProductSlug(name);

  let newId: string;
  try {
    newId = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name,
          slug,
          mainCategoryId: source.mainCategoryId,
          subCategoryId: source.subCategoryId,
          price: source.price,
          oldPrice: source.oldPrice,
          sku: null,
          stock: source.stock,
          color: source.color,
          description: source.description,
          seoTitle: source.seoTitle,
          seoDescription: source.seoDescription,
          isActive: source.isActive,
        },
      });

      if (source.images.length > 0) {
        await tx.productImage.createMany({
          data: source.images.map((img, i) => ({
            productId: created.id,
            url: img.url,
            isPrimary: i === 0,
          })),
        });
      }

      return created.id;
    });
  } catch (e) {
    console.error(e);
    redirect("/admin/products?copyError=1");
  }

  revalidatePath("/admin/products");
  revalidatePath("/", "layout");

  redirect(`/admin/products/${newId}/edit?copied=1`);
}

export async function deleteProduct(productId: string): Promise<{ ok: false; error: string } | never> {
  await requireAdminAuth();
  const id = productId.trim();
  if (!id) {
    return { ok: false, error: "Не указан товар." };
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      mainCategory: { select: { slug: true } },
    },
  });

  if (!product) {
    return { ok: false, error: "Товар не найден." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { productId: id } });
      await tx.wishlistItem.deleteMany({ where: { productId: id } });
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
    });
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Не удалось удалить товар." };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/product/${product.slug}`);
  revalidatePath(`/catalog/${product.mainCategory.slug}`);
  revalidatePath("/", "layout");

  redirect("/admin/products?deleted=1");
}
