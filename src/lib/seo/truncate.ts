/** Обрезка для meta description (≈155–165 символов, без обрыва посередине слова по возможности). */
export function truncateMetaDescription(text: string, max = 158): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const safe = lastSpace > 40 ? cut.slice(0, lastSpace) : cut;
  return `${safe.trimEnd()}…`;
}
