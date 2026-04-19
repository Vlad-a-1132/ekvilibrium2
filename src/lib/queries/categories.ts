import { categoryBlueprint } from "@/data/category-blueprint";
import {
  CANONICAL_MAIN_CATEGORY_SLUGS,
  isCanonicalMainSlug,
} from "@/lib/category-canonical";
import { prisma } from "@/lib/prisma";
import type { MainCategoryNav } from "@/types/catalog";

function navFromBlueprint(): MainCategoryNav[] {
  return categoryBlueprint.map((c) => ({
    id: `blueprint:${c.slug}`,
    name: c.name,
    slug: c.slug,
    subcategories: c.subcategories.map((s) => ({
      id: `blueprint:${c.slug}:${s.slug}`,
      name: s.name,
      slug: s.slug,
    })),
  }));
}

export async function getMainCategoriesForNav(): Promise<MainCategoryNav[]> {
  try {
    const rows = await prisma.mainCategory.findMany({
      where: { slug: { in: [...CANONICAL_MAIN_CATEGORY_SLUGS] } },
      orderBy: { name: "asc" },
      include: {
        subcategories: {
          orderBy: { name: "asc" },
          select: { id: true, name: true, slug: true },
        },
      },
    });
    if (rows.length > 0) {
      return rows.map((m) => ({
        id: m.id,
        name: m.name,
        slug: m.slug,
        subcategories: m.subcategories.map((s) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
        })),
      }));
    }
  } catch {
    // БД может быть недоступна — показываем blueprint.
  }
  return navFromBlueprint();
}

export type CatalogMainCategory = {
  id: string;
  name: string;
  slug: string;
  subcategories: { id: string; name: string; slug: string }[];
};

export async function getMainCategoryForCatalog(slug: string): Promise<CatalogMainCategory | null> {
  if (!isCanonicalMainSlug(slug)) {
    return null;
  }

  try {
    const row = await prisma.mainCategory.findFirst({
      where: { slug },
      include: {
        subcategories: {
          orderBy: { name: "asc" },
          select: { id: true, name: true, slug: true },
        },
      },
    });
    if (row) {
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        subcategories: row.subcategories,
      };
    }
  } catch {
    // fallback ниже
  }

  const fromBlueprint = categoryBlueprint.find((c) => c.slug === slug);
  if (!fromBlueprint) return null;
  return {
    id: `blueprint:${fromBlueprint.slug}`,
    name: fromBlueprint.name,
    slug: fromBlueprint.slug,
    subcategories: fromBlueprint.subcategories.map((s) => ({
      id: `blueprint:${fromBlueprint.slug}:${s.slug}`,
      name: s.name,
      slug: s.slug,
    })),
  };
}

/** Подкатегории активной главной категории (БД или blueprint). */
export async function getSubcategoriesByMainCategorySlug(slug: string) {
  const main = await getMainCategoryForCatalog(slug);
  return main?.subcategories ?? [];
}

/** Только БД — для форм админки (реальные id), только канонические главные категории и все их подкатегории. */
export async function getMainCategoriesForProductForm() {
  try {
    return await prisma.mainCategory.findMany({
      where: { slug: { in: [...CANONICAL_MAIN_CATEGORY_SLUGS] } },
      include: {
        subcategories: {
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}
