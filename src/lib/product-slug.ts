import slugify from "slugify";

import { prisma } from "@/lib/prisma";

function baseSlugFromName(name: string): string {
  const s = slugify(name, { lower: true, strict: true, locale: "ru", trim: true });
  return s || "tovar";
}

/** Уникальный slug для products.slug */
export async function generateUniqueProductSlug(name: string): Promise<string> {
  const base = baseSlugFromName(name);
  for (let i = 0; i < 1000; i++) {
    const candidate = i === 0 ? base : `${base}-${i}`;
    const exists = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
  }
  return `${base}-${Date.now()}`;
}
