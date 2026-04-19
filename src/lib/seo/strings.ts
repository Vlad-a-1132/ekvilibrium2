import { SITE_BRAND, SITE_CITY_LOCATIVE } from "@/lib/seo/site";

/** Title и meta description для главных категорий (slug из blueprint). Только для meta-тегов, не выводится на странице. */
export const mainCategorySeo: Record<string, { title: string; description: string }> = {
  kanctovary: {
    title: `Канцтовары в ${SITE_CITY_LOCATIVE} — купить в «${SITE_BRAND}»`,
    description:
      `Канцелярские мелочи, письменные принадлежности и органайзеры для офиса и школы. Интернет-магазин «${SITE_BRAND}» в ${SITE_CITY_LOCATIVE} — подборка без лишнего шума, доставка и самовывоз по согласованию.`,
  },
  bumaga: {
    title: `Бумажная продукция в ${SITE_CITY_LOCATIVE} — тетради и блокноты «${SITE_BRAND}»`,
    description:
      `Тетради, блокноты, альбомы и планинги в Пятигорске. Купить бумажную продукцию для школы, творчества и планирования — в каталоге «${SITE_BRAND}».`,
  },
  tvorchestvo: {
    title: `Товары для творчества в ${SITE_CITY_LOCATIVE} — краски, карандаши «${SITE_BRAND}»`,
    description:
      `Краски, карандаши, фломастеры и материалы для рисования в Пятигорске. Интернет-магазин «${SITE_BRAND}» — спокойный выбор для художников, школьников и творческих проектов.`,
  },
  ryukzaki: {
    title: `Рюкзаки и сумки в ${SITE_CITY_LOCATIVE} — школьные ранцы «${SITE_BRAND}»`,
    description:
      `Рюкзаки, ранцы, пеналы и сумки в Пятигорске. Купить аксессуары для школы и города — в магазине канцелярии «${SITE_BRAND}».`,
  },
};
