/** Путь карточки товара на витрине (без домена). */
export function productPublicPath(slug: string | null | undefined): string | null {
  const s = slug?.trim();
  if (!s) return null;
  return `/product/${encodeURIComponent(s)}`;
}

/** Описание для админки: из актуального товара, либо заглушки. */
export function orderItemDescriptionDisplay(
  product: { description: string | null } | null | undefined,
): string {
  if (product == null) return "Описание недоступно";
  const d = product.description?.trim();
  if (d) return d;
  return "Без описания";
}

/** Обрезка для списков заказов / уведомлений. */
export function truncateDescriptionForList(text: string, maxChars: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= maxChars) return flat;
  return flat.slice(0, maxChars).trimEnd() + "…";
}
