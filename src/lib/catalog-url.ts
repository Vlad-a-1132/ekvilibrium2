/** Сборка URL каталога с сохранением ?sub= и ?page= */
export function catalogHref(
  mainCategorySlug: string,
  opts?: { sub?: string | null; page?: number },
) {
  const p = new URLSearchParams();
  if (opts?.sub) p.set("sub", opts.sub);
  if (opts?.page && opts.page > 1) p.set("page", String(opts.page));
  const q = p.toString();
  return q ? `/catalog/${mainCategorySlug}?${q}` : `/catalog/${mainCategorySlug}`;
}
