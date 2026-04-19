import { SITE_BRAND, SITE_CITY_LOCATIVE } from "@/lib/seo/site";

/**
 * Видимый H1 и короткий SEO-текст на главной (без «простыней»).
 */
export function HomeSeoHero() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl tracking-tight text-[#403A34] md:text-[1.75rem] md:leading-snug">
        Канцелярия в {SITE_CITY_LOCATIVE} — магазин канцтоваров «{SITE_BRAND}»
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-[#403A34]/76">
        «{SITE_BRAND}» — интернет-магазин канцелярии в Пятигорске: канцтовары, бумажная продукция, товары для творчества,
        рюкзаки и аксессуары для школы и офиса. Подбираем ассортимент спокойно и аккуратно, без визуального шума —
        оформите заказ на сайте или загляните к нам по адресу в разделе контактов.
      </p>
    </div>
  );
}
