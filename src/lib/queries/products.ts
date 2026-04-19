import type { Prisma } from "@prisma/client";

import { isCanonicalMainSlug } from "@/lib/category-canonical";
import { prisma } from "@/lib/prisma";
import type { CatalogProduct, PaginatedCatalogProducts } from "@/types/catalog";

function mapProductRow(row: {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  images: { url: string }[];
}): CatalogProduct {
  const primary = row.images[0] ?? null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: row.price,
    oldPrice: row.oldPrice,
    image: primary ? { path: primary.url, alt: null } : null,
  };
}

const relatedProductSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  oldPrice: true,
  images: {
    take: 1,
    orderBy: { id: "asc" as const },
    select: { url: true },
  },
} satisfies import("@prisma/client").Prisma.ProductSelect;

/** Товары той же ветки каталога: сначала та же подкатегория, затем остальные в главной. */
export async function getRelatedProducts(params: {
  productId: string;
  mainCategoryId: string;
  subCategoryId: string;
  limit?: number;
}): Promise<CatalogProduct[]> {
  const limit = Math.min(12, Math.max(1, params.limit ?? 6));

  try {
    const sameSub = await prisma.product.findMany({
      where: {
        id: { not: params.productId },
        isActive: true,
        mainCategoryId: params.mainCategoryId,
        subCategoryId: params.subCategoryId,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: relatedProductSelect,
    });

    if (sameSub.length >= limit) {
      return sameSub.map(mapProductRow);
    }

    const excludeIds = new Set<string>([params.productId, ...sameSub.map((p) => p.id)]);
    const rest = await prisma.product.findMany({
      where: {
        id: { notIn: [...excludeIds] },
        isActive: true,
        mainCategoryId: params.mainCategoryId,
      },
      orderBy: { createdAt: "desc" },
      take: limit - sameSub.length,
      select: relatedProductSelect,
    });

    return [...sameSub, ...rest].map(mapProductRow);
  } catch {
    return [];
  }
}

/** Товар для админ-редактирования (все поля формы + изображения по порядку). */
export async function getProductForAdminEdit(id: string) {
  try {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { id: "asc" } },
      },
    });
  } catch {
    return null;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        mainCategory: true,
        subCategory: true,
        images: { orderBy: { id: "asc" } },
      },
    });
  } catch {
    return null;
  }
}

export type GetProductsByCategoryParams = {
  mainCategorySlug: string;
  subcategorySlug?: string | null;
  page?: number;
  limit?: number;
};

export async function getProductsByCategory(
  params: GetProductsByCategoryParams,
): Promise<PaginatedCatalogProducts> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(48, Math.max(1, params.limit ?? 12));
  const offset = (page - 1) * limit;
  const subSlug = params.subcategorySlug?.trim() || null;

  if (!isCanonicalMainSlug(params.mainCategorySlug)) {
    return { products: [], total: 0, page, limit, totalPages: 0 };
  }

  try {
    const main = await prisma.mainCategory.findFirst({
      where: { slug: params.mainCategorySlug },
      select: { id: true },
    });

    if (!main) {
      return { products: [], total: 0, page, limit, totalPages: 0 };
    }

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      mainCategoryId: main.id,
    };

    if (subSlug) {
      const sub = await prisma.subCategory.findFirst({
        where: {
          slug: subSlug,
          mainCategoryId: main.id,
        },
        select: { id: true },
      });
      if (!sub) {
        return { products: [], total: 0, page, limit, totalPages: 0 };
      }
      where.subCategoryId = sub.id;
    }

    const [total, rows] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          oldPrice: true,
          images: {
            take: 1,
            orderBy: { id: "asc" },
            select: { url: true },
          },
        },
      }),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      products: rows.map(mapProductRow),
      total,
      page,
      limit,
      totalPages,
    };
  } catch {
    return { products: [], total: 0, page, limit, totalPages: 0 };
  }
}

/** Поиск по названию, описанию и SKU; только активные товары. */
export async function searchProducts(rawQuery: string): Promise<{
  products: CatalogProduct[];
  total: number;
}> {
  const q = rawQuery.trim();
  if (q.length === 0) {
    return { products: [], total: 0 };
  }

  try {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
      ],
    };

    const [total, rows] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { name: "asc" },
        take: 48,
        select: relatedProductSelect,
      }),
    ]);

    return {
      products: rows.map(mapProductRow),
      total,
    };
  } catch {
    return { products: [], total: 0 };
  }
}
