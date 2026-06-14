import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const ADMIN_PRODUCTS_PAGE_SIZE = 25;

export const ADMIN_PRODUCT_SORT_FIELDS = [
  "createdAt",
  "name",
  "category",
  "price",
  "stock",
  "status",
] as const;

export type AdminProductSortField = (typeof ADMIN_PRODUCT_SORT_FIELDS)[number];
export type AdminProductSortDir = "asc" | "desc";

export type AdminProductsListParams = {
  page?: string | number;
  sort?: string;
  dir?: string;
};

export type AdminProductsListResult = {
  items: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    isActive: boolean;
    createdAt: Date;
    mainCategory: { name: string };
  }>;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  sort: AdminProductSortField;
  dir: AdminProductSortDir;
};

export function parseAdminProductsListParams(
  raw: AdminProductsListParams,
): Pick<AdminProductsListResult, "page" | "sort" | "dir"> {
  const page = Math.max(1, Number.parseInt(String(raw.page ?? "1"), 10) || 1);
  const sort = ADMIN_PRODUCT_SORT_FIELDS.includes(raw.sort as AdminProductSortField)
    ? (raw.sort as AdminProductSortField)
    : "createdAt";
  const dir: AdminProductSortDir = raw.dir === "asc" ? "asc" : "desc";
  return { page, sort, dir };
}

export function adminProductsHref(opts?: {
  page?: number;
  sort?: AdminProductSortField;
  dir?: AdminProductSortDir;
}): string {
  const p = new URLSearchParams();
  if (opts?.page && opts.page > 1) p.set("page", String(opts.page));
  if (opts?.sort && opts.sort !== "createdAt") p.set("sort", opts.sort);
  if (opts?.dir && opts.dir !== "desc") p.set("dir", opts.dir);
  const q = p.toString();
  return q ? `/admin/products?${q}` : "/admin/products";
}

function buildOrderBy(
  sort: AdminProductSortField,
  dir: AdminProductSortDir,
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "name":
      return { name: dir };
    case "category":
      return { mainCategory: { name: dir } };
    case "price":
      return { price: dir };
    case "stock":
      return { stock: dir };
    case "status":
      return { isActive: dir };
    case "createdAt":
    default:
      return { createdAt: dir };
  }
}

export async function getAdminProductsList(
  raw: AdminProductsListParams,
): Promise<AdminProductsListResult> {
  const { page, sort, dir } = parseAdminProductsListParams(raw);

  try {
    const [total, items] = await Promise.all([
      prisma.product.count(),
      prisma.product.findMany({
        orderBy: buildOrderBy(sort, dir),
        skip: (page - 1) * ADMIN_PRODUCTS_PAGE_SIZE,
        take: ADMIN_PRODUCTS_PAGE_SIZE,
        include: {
          mainCategory: { select: { name: true } },
        },
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / ADMIN_PRODUCTS_PAGE_SIZE));
    const safePage = Math.min(page, totalPages);

    if (safePage !== page && total > 0) {
      return getAdminProductsList({ page: safePage, sort, dir });
    }

    return {
      items: items.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        stock: p.stock,
        isActive: p.isActive,
        createdAt: p.createdAt,
        mainCategory: p.mainCategory,
      })),
      page: safePage,
      pageSize: ADMIN_PRODUCTS_PAGE_SIZE,
      total,
      totalPages,
      sort,
      dir,
    };
  } catch {
    return {
      items: [],
      page: 1,
      pageSize: ADMIN_PRODUCTS_PAGE_SIZE,
      total: 0,
      totalPages: 1,
      sort,
      dir,
    };
  }
}

export function nextAdminProductSortDir(
  field: AdminProductSortField,
  currentSort: AdminProductSortField,
  currentDir: AdminProductSortDir,
): AdminProductSortDir {
  if (currentSort === field) return currentDir === "asc" ? "desc" : "asc";
  return field === "createdAt" || field === "price" || field === "stock" ? "desc" : "asc";
}
