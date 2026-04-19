import { HOME_SHOWCASE_TILE_IMAGE_OVERRIDES } from "@/data/home-showcase";
import { prisma } from "@/lib/prisma";
import type { CatalogProduct } from "@/types/catalog";

export type HomeShowcaseTile = {
  slug: string;
  title: string;
  href: string;
  imageUrl: string | null;
};

function withShowcaseImageOverrides(tiles: HomeShowcaseTile[]): HomeShowcaseTile[] {
  return tiles.map((tile) => {
    const override = HOME_SHOWCASE_TILE_IMAGE_OVERRIDES[tile.slug];
    return override ? { ...tile, imageUrl: override } : tile;
  });
}

/**
 * Плитки витрины главной: имена из blueprint, обложка — первое фото товара в подкатегории (если есть).
 */
export async function enrichShowcaseTiles(
  mainSlug: string,
  items: { slug: string; title: string }[],
): Promise<HomeShowcaseTile[]> {
  if (items.length === 0) return [];

  try {
    const main = await prisma.mainCategory.findUnique({
      where: { slug: mainSlug },
      select: { id: true },
    });

    const base = items.map((item) => ({
      slug: item.slug,
      title: item.title,
      href: `/catalog/${mainSlug}?sub=${encodeURIComponent(item.slug)}`,
      imageUrl: null as string | null,
    }));

    if (!main) return withShowcaseImageOverrides(base);

    const enriched = await Promise.all(
      base.map(async (tile) => {
        const sub = await prisma.subCategory.findFirst({
          where: { slug: tile.slug, mainCategoryId: main.id },
          select: { id: true },
        });
        if (!sub) return tile;

        const product = await prisma.product.findFirst({
          where: { isActive: true, subCategoryId: sub.id },
          orderBy: { createdAt: "desc" },
          select: {
            images: { take: 1, orderBy: { id: "asc" }, select: { url: true } },
          },
        });
        const url = product?.images[0]?.url ?? null;
        return { ...tile, imageUrl: url };
      }),
    );

    return withShowcaseImageOverrides(enriched);
  } catch {
    return withShowcaseImageOverrides(
      items.map((item) => ({
        slug: item.slug,
        title: item.title,
        href: `/catalog/${mainSlug}?sub=${encodeURIComponent(item.slug)}`,
        imageUrl: null,
      })),
    );
  }
}

/** Небольшая подборка для главной (не каталог). */
export async function getHomeSpotlightProducts(limit = 8): Promise<CatalogProduct[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
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
    });

    return rows.map((row) => {
      const primary = row.images[0] ?? null;
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        price: Number(row.price),
        oldPrice: row.oldPrice != null ? Number(row.oldPrice) : null,
        image: primary ? { path: primary.url, alt: null } : null,
      };
    });
  } catch {
    return [];
  }
}
