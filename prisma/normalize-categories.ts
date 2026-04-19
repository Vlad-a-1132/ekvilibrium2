/**
 * Нормализация категорий: legacy main и (опционально) лишние sub под каноническими main.
 * Канон списка main/sub — `src/data/category-blueprint.ts` (см. `src/lib/category-canonical.ts`).
 *
 * STRICT_SUBCLEAN=1 — удаляет подкатегории под каноническими main, если slug ∉ blueprint и 0 товаров.
 * Подкатегории с товарами не удаляются (ручной перенос при необходимости).
 *
 * Запуск: npm run db:normalize
 * Строго: STRICT_SUBCLEAN=1 npm run db:normalize
 */

import { PrismaClient } from "@prisma/client";

import {
  CANONICAL_MAIN_CATEGORY_SLUGS,
  getCanonicalSubcategorySlugSet,
} from "../src/lib/category-canonical";

const prisma = new PrismaClient();

const strictSubClean = process.env.STRICT_SUBCLEAN === "1";

async function countProductsForMainBranch(mainId: string): Promise<number> {
  return prisma.product.count({ where: { mainCategoryId: mainId } });
}

async function main() {
  const stats = {
    legacyMainDeleted: 0,
    legacyMainSkippedProducts: 0,
    legacySubDeleted: 0,
    legacySubSkippedProducts: 0,
    strictSubDeleted: 0,
    strictSubSkippedProducts: 0,
  };

  console.log("🧹 Category normalization");
  console.log("Canonical main slugs:", CANONICAL_MAIN_CATEGORY_SLUGS.join(", "));
  console.log("Blueprint sub slugs count:", getCanonicalSubcategorySlugSet().size);
  console.log("STRICT_SUBCLEAN:", strictSubClean);

  const canonicalMainSet = new Set<string>(CANONICAL_MAIN_CATEGORY_SLUGS);
  const canonicalSubSet = getCanonicalSubcategorySlugSet();

  const allMains = await prisma.mainCategory.findMany({
    select: { id: true, slug: true, name: true },
  });

  const legacyMains = allMains.filter((m) => !canonicalMainSet.has(m.slug));

  for (const main of legacyMains) {
    const branchCount = await countProductsForMainBranch(main.id);
    if (branchCount > 0) {
      stats.legacyMainSkippedProducts += 1;
      console.warn(
        `⚠️  Skip legacy main "${main.name}" (${main.slug}): ${branchCount} product(s) — перенесите товары вручную.`,
      );
      continue;
    }

    const subs = await prisma.subCategory.findMany({
      where: { mainCategoryId: main.id },
      select: { id: true, slug: true, name: true },
    });

    for (const sub of subs) {
      const pc = await prisma.product.count({ where: { subCategoryId: sub.id } });
      if (pc > 0) {
        stats.legacySubSkippedProducts += 1;
        console.warn(
          `⚠️  Skip sub "${sub.name}" (${sub.slug}) under legacy main ${main.slug}: ${pc} product(s).`,
        );
        continue;
      }
      await prisma.subCategory.delete({ where: { id: sub.id } });
      stats.legacySubDeleted += 1;
      console.log(`   Deleted sub ${sub.slug} (legacy main ${main.slug})`);
    }

    const remaining = await prisma.subCategory.count({ where: { mainCategoryId: main.id } });
    if (remaining > 0) {
      console.warn(
        `⚠️  Skip deleting legacy main ${main.slug}: ${remaining} sub(s) still linked (see warnings above).`,
      );
      continue;
    }

    await prisma.mainCategory.delete({ where: { id: main.id } });
    stats.legacyMainDeleted += 1;
    console.log(`✓ Deleted legacy main ${main.slug}`);
  }

  if (strictSubClean) {
    const canonicalMains = await prisma.mainCategory.findMany({
      where: { slug: { in: [...canonicalMainSet] } },
      select: { id: true, slug: true },
    });

    for (const m of canonicalMains) {
      const subs = await prisma.subCategory.findMany({
        where: { mainCategoryId: m.id },
        select: { id: true, slug: true, name: true },
      });
      for (const sub of subs) {
        if (canonicalSubSet.has(sub.slug)) continue;
        const pc = await prisma.product.count({ where: { subCategoryId: sub.id } });
        if (pc > 0) {
          stats.strictSubSkippedProducts += 1;
          console.warn(
            `⚠️  Skip non-blueprint sub "${sub.name}" (${sub.slug}) under ${m.slug}: ${pc} product(s).`,
          );
          continue;
        }
        await prisma.subCategory.delete({ where: { id: sub.id } });
        stats.strictSubDeleted += 1;
        console.log(`   STRICT: removed sub ${sub.slug} under ${m.slug} (not in blueprint, 0 products)`);
      }
    }
  } else {
    console.log("ℹ️  STRICT_SUBCLEAN off — подкатегории вне blueprint под каноническими main не удаляются.");
  }

  console.log("\n── Summary ──");
  console.log(`Legacy main deleted:              ${stats.legacyMainDeleted}`);
  console.log(`Legacy main skipped (products):   ${stats.legacyMainSkippedProducts}`);
  console.log(`Subs deleted (under legacy main): ${stats.legacySubDeleted}`);
  console.log(`Subs skipped under legacy (prod): ${stats.legacySubSkippedProducts}`);
  if (strictSubClean) {
    console.log(`STRICT sub deleted:               ${stats.strictSubDeleted}`);
    console.log(`STRICT sub skipped (products):    ${stats.strictSubSkippedProducts}`);
  }
  console.log("✅ Done. Next: npm run db:seed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
