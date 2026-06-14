/** Публичный URL сайта (canonical, OG, sitemap). Задаётся в .env на проде. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/+$/, "");
  return "https://equilibriumkanz.ru";
}

/** Favicon и apple-touch icon — наследуются всеми страницами из корневого layout. */
export const siteIconsMetadata = {
  icon: [
    { url: "/favicon.ico", sizes: "any" },
    { url: "/icon.png", type: "image/png", sizes: "192x192" },
  ],
  apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  shortcut: "/favicon.ico",
} as const;

export function absoluteUrl(pathname: string, searchParams?: Record<string, string | undefined>): string {
  const base = getSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (!searchParams) return `${base}${path}`;
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (v != null && v !== "") q.set(k, v);
  }
  const qs = q.toString();
  return qs ? `${base}${path}?${qs}` : `${base}${path}`;
}

export const SITE_BRAND = "Эквилибриум";
export const SITE_CITY = "Пятигорск";
export const SITE_CITY_LOCATIVE = "Пятигорске";
