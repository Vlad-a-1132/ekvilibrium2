import type { Metadata } from "next";

/** Служебные и персональные страницы — не индексируем, ссылки не передаём вес (nofollow). */
export function noIndexMetadata(title: string, description?: string): Metadata {
  return {
    title,
    description: description ?? `Раздел «${title}» на сайте «Эквилибриум».`,
    robots: { index: false, follow: false },
  };
}
