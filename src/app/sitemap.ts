import type { MetadataRoute } from "next";

import { categoryBlueprint } from "@/data/category-blueprint";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/info/order`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/info/contacts`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/legal/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/legal/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const catalogEntries: MetadataRoute.Sitemap = categoryBlueprint.map((m) => ({
    url: `${base}/catalog/${m.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, createdAt: true },
    });
    productEntries = rows.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    productEntries = [];
  }

  return [...staticEntries, ...catalogEntries, ...productEntries];
}
