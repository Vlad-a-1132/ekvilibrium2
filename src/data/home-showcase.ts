import { categoryBlueprint } from "@/data/category-blueprint";

export type ShowcaseSectionId = "kanctovary" | "bumaga" | "tvorchestvo" | "ryukzaki";

export type HomeShowcaseSectionMeta = {
  id: ShowcaseSectionId;
  mainSlug: string;
  headline: string;
  subheadline: string;
  /** Curated подкатегории из blueprint (порядок = порядок на витрине). */
  subSlugs: readonly string[];
  ctaLabel: string;
  /** «Живая» секция — чуть теплее фон и карточки. */
  tone: "default" | "creative";
};

/** Обложки плиток витрины: ключ — slug подкатегории, значение — URL из `/public` (напр. `/vitrina/...`). */
export const HOME_SHOWCASE_TILE_IMAGE_OVERRIDES: Partial<Record<string, string>> = {
  ruchki: "/vitrina/pens.png",
  markery: "/vitrina/1f315ce2-de19-4aed-94d2-ae8f1afe377d.png",
  "kanctovary-karandashi": "/vitrina/pebn.png",
  papki: "/vitrina/papki.png",
  steplery: "/vitrina/step.png",
  nozhnitsy: "/vitrina/njks.png",
  "klejkie-lenty": "/vitrina/lenta.png",
  tochilki: "/vitrina/sad.png",
  "tetradi-i-bloknoty": "/vitrina/Bumazhnaya%20produktsiya/Tetradi%20i%20bloknoty.webp",
  "zapisnye-knizhki": "/vitrina/Bumazhnaya%20produktsiya/Zapisnyye%20knizhki.webp",
  "albomy-dlya-risovaniya": "/vitrina/Bumazhnaya%20produktsiya/Albomy%20dlya%20risovaniya.webp",
  "planingi-i-ezhednevniki": "/vitrina/Bumazhnaya%20produktsiya/Planingi%20i%20ezhednevniki.webp",
  "tetradi-na-spirali-i-bloknoty": "/vitrina/Bumazhnaya%20produktsiya/Tetradi%20na%20spirali%20i%20bloknoty.webp",
  "tetradi-predmetnye": "/vitrina/Bumazhnaya%20produktsiya/Tetradi%20predmetnyye.webp",
  nakleyki: "/vitrina/Bumazhnaya%20produktsiya/Nakleyki.webp",
  "raspisaniya-urokov": "/vitrina/Bumazhnaya%20produktsiya/Raspisaniya%20urokov.webp",
  kraski: "/vitrina/Tovary%20dlya%20tvorchestva/Kraski.webp",
  "cvetnye-karandashi": "/vitrina/Tovary%20dlya%20tvorchestva/Tsvetnyye%20karandashi.webp",
  "akvarelnye-kraski": "/vitrina/Tovary%20dlya%20tvorchestva/Akvarelnyye-kraski.webp",
  plastilin: "/vitrina/Tovary%20dlya%20tvorchestva/Plastilin.webp",
  "melki-i-pastel": "/vitrina/Tovary%20dlya%20tvorchestva/Melki-i-pastel.webp",
  "flomastery-i-markery": "/vitrina/Tovary%20dlya%20tvorchestva/Flomastery-i-markery.webp",
  "aksessuary-dlya-tvorchestva": "/vitrina/Tovary%20dlya%20tvorchestva/Aksessuary-dlya-tvorchestva.webp",
  "tvorchestvo-lastiki": "/vitrina/Tovary%20dlya%20tvorchestva/Lastiki.webp",
  penaly: "/vitrina/Tovary%20dlya%20tvorchestva/Penaly%20(1).webp",
  "ryukzaki-universalnye": "/vitrina/Tovary%20dlya%20tvorchestva/Rantsy%20i%20ryukzaki%20uchenicheskiye.webp",
  sumki: "/vitrina/Tovary%20dlya%20tvorchestva/Sumki.webp",
  "meshki-dlya-obuvi": "/vitrina/Tovary%20dlya%20tvorchestva/Meshki%20dlya%20obuvi.webp",
  "mini-ryukzaki-dlya-detey": "/vitrina/Tovary%20dlya%20tvorchestva/Mini-ryukzaki%20dlya%20detey.webp",
  "sumki-shopper": "/vitrina/Tovary%20dlya%20tvorchestva/Sumki-shoppery.webp",
};

export const HOME_SHOWCASE_SECTIONS: HomeShowcaseSectionMeta[] = [
  {
    id: "kanctovary",
    mainSlug: "kanctovary",
    headline: "Канцтовары",
    subheadline:
      "Ручки, организация рабочего места и школьные мелочи — всё для офиса и учёбы в спокойной подаче.",
    subSlugs: [
      "ruchki",
      "markery",
      "kanctovary-karandashi",
      "papki",
      "steplery",
      "nozhnitsy",
      "klejkie-lenty",
      "tochilki",
    ],
    ctaLabel: "Перейти в раздел",
    tone: "default",
  },
  {
    id: "bumaga",
    mainSlug: "bumaga",
    headline: "Бумажная продукция",
    subheadline: "Тетради, блокноты, альбомы и бумага — аккуратная база для записей и творчества.",
    subSlugs: [
      "tetradi-i-bloknoty",
      "zapisnye-knizhki",
      "albomy-dlya-risovaniya",
      "planingi-i-ezhednevniki",
      "tetradi-na-spirali-i-bloknoty",
      "tetradi-predmetnye",
      "nakleyki",
      "raspisaniya-urokov",
    ],
    ctaLabel: "Перейти в раздел",
    tone: "default",
  },
  {
    id: "tvorchestvo",
    mainSlug: "tvorchestvo",
    headline: "Товары для творчества",
    subheadline: "Краски, карандаши, пластилин и материалы для вдохновения — яркая витрина без крика.",
    subSlugs: [
      "kraski",
      "cvetnye-karandashi",
      "akvarelnye-kraski",
      "plastilin",
      "melki-i-pastel",
      "flomastery-i-markery",
      "aksessuary-dlya-tvorchestva",
      "tvorchestvo-lastiki",
    ],
    ctaLabel: "Перейти в раздел",
    tone: "creative",
  },
  {
    id: "ryukzaki",
    mainSlug: "ryukzaki",
    headline: "Рюкзаки и аксессуары",
    subheadline: "Пеналы, рюкзаки, сумки и школьные мелочи — удобно носить и приятно выбирать.",
    subSlugs: [
      "penaly",
      "ryukzaki-universalnye",
      "sumki",
      "meshki-dlya-obuvi",
      "mini-ryukzaki-dlya-detey",
      "sumki-shopper",
    ],
    ctaLabel: "Перейти в раздел",
    tone: "default",
  },
];

/** Имена и slug из актуального blueprint (без запроса к БД). */
export function resolveShowcaseItems(mainSlug: string, subSlugs: readonly string[]) {
  const main = categoryBlueprint.find((m) => m.slug === mainSlug);
  if (!main) return [];
  const out: { slug: string; title: string }[] = [];
  for (const slug of subSlugs) {
    const sub = main.subcategories.find((s) => s.slug === slug);
    if (sub) out.push({ slug: sub.slug, title: sub.name });
  }
  return out;
}
