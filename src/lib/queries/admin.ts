import {
  CANONICAL_MAIN_CATEGORY_SLUGS,
  getCanonicalMainSlugSet,
} from "@/lib/category-canonical";
import { prisma } from "@/lib/prisma";

export async function getAdminOverviewStats() {
  try {
    const [productCount, mainCategoryCount, subCategoryCount] = await Promise.all([
      prisma.product.count(),
      prisma.mainCategory.count(),
      prisma.subCategory.count(),
    ]);
    return { productCount, mainCategoryCount, subCategoryCount };
  } catch {
    return { productCount: 0, mainCategoryCount: 0, subCategoryCount: 0 };
  }
}

export type AdminMainCategoryRow = {
  id: string;
  name: string;
  slug: string;
  subcategoryCount: number;
  productCount: number;
};

export type AdminMainCategoriesResult = {
  active: AdminMainCategoryRow[];
  legacy: AdminMainCategoryRow[];
};

export async function getAdminMainCategoriesSplit(): Promise<AdminMainCategoriesResult> {
  try {
    const canonical = getCanonicalMainSlugSet();
    const rows = await prisma.mainCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { subcategories: true, products: true },
        },
      },
    });
    const mapped: AdminMainCategoryRow[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      subcategoryCount: r._count.subcategories,
      productCount: r._count.products,
    }));
    return {
      active: mapped.filter((r) => canonical.has(r.slug)),
      legacy: mapped.filter((r) => !canonical.has(r.slug)),
    };
  } catch {
    return { active: [], legacy: [] };
  }
}

export type AdminSubcategoryRow = {
  id: string;
  name: string;
  slug: string;
  mainCategoryName: string;
  mainCategorySlug: string;
  productCount: number;
};

export type AdminSubcategoriesResult = {
  active: AdminSubcategoryRow[];
  legacy: AdminSubcategoryRow[];
};

export async function getAdminSubcategoriesSplit(): Promise<AdminSubcategoriesResult> {
  try {
    const canonicalMain = getCanonicalMainSlugSet();
    const rows = await prisma.subCategory.findMany({
      orderBy: [{ mainCategory: { name: "asc" } }, { name: "asc" }],
      include: {
        mainCategory: { select: { name: true, slug: true } },
        _count: { select: { products: true } },
      },
    });
    const mapped: AdminSubcategoryRow[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      mainCategoryName: r.mainCategory.name,
      mainCategorySlug: r.mainCategory.slug,
      productCount: r._count.products,
    }));
    return {
      active: mapped.filter((r) => canonicalMain.has(r.mainCategorySlug)),
      legacy: mapped.filter((r) => !canonicalMain.has(r.mainCategorySlug)),
    };
  } catch {
    return { active: [], legacy: [] };
  }
}

/** Список главных категорий для формы создания подкатегории (только канонические slug). */
export async function getCanonicalMainCategoriesForSelect() {
  try {
    return await prisma.mainCategory.findMany({
      where: { slug: { in: [...CANONICAL_MAIN_CATEGORY_SLUGS] } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
  } catch {
    return [];
  }
}
