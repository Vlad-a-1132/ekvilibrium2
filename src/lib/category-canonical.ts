import { categoryBlueprint } from "@/data/category-blueprint";

/**
 * Единственный источник канонических slug — `src/data/category-blueprint.ts`.
 * Main: ровно четыре slug; sub: объединение всех подкатегорий из blueprint (глобально уникальны).
 * При смене структуры категорий править только blueprint; этот модуль остаётся производным.
 */

/** Актуальные slug главных категорий. */
export const CANONICAL_MAIN_CATEGORY_SLUGS = categoryBlueprint.map((c) => c.slug) as readonly string[];

/** Все актуальные slug подкатегорий из финального blueprint. */
export function getCanonicalSubcategorySlugSet(): Set<string> {
  const set = new Set<string>();
  for (const m of categoryBlueprint) {
    for (const s of m.subcategories) {
      set.add(s.slug);
    }
  }
  return set;
}

export function getCanonicalMainSlugSet(): Set<string> {
  return new Set(CANONICAL_MAIN_CATEGORY_SLUGS);
}

export function isCanonicalMainSlug(slug: string): boolean {
  return getCanonicalMainSlugSet().has(slug);
}

export function isCanonicalSubSlug(slug: string): boolean {
  return getCanonicalSubcategorySlugSet().has(slug);
}
