/**
 * Единый источник структуры категорий для сидов и навигации.
 * Slug подкатегорий глобально уникальны; при совпадении имён в разных разделах — префикс по main (напр. kanctovary-*, tvorchestvo-*).
 */

export type SubcategoryBlueprint = {
  name: string;
  slug: string;
};

export type MainCategoryBlueprint = {
  name: string;
  slug: string;
  subcategories: SubcategoryBlueprint[];
};

export const categoryBlueprint: MainCategoryBlueprint[] = [
  {
    name: "Канцтовары",
    slug: "kanctovary",
    subcategories: [
      { name: "Ручки", slug: "ruchki" },
      { name: "Маркеры", slug: "markery" },
      { name: "Карандаши", slug: "kanctovary-karandashi" },
      { name: "Грифели", slug: "grifeli" },
      { name: "Точилки", slug: "tochilki" },
      { name: "Ластики", slug: "kanctovary-lastiki" },
      { name: "Корректоры", slug: "korrektory" },
      { name: "Клей", slug: "kley" },
      { name: "Клейкие ленты", slug: "klejkie-lenty" },
      { name: "Клейкие закладки", slug: "klejkie-zakladki" },
      { name: "Бумага для заметок", slug: "bumaga-dlya-zametok" },
      { name: "Папки", slug: "papki" },
      { name: "Перфофайлы", slug: "perfofayly" },
      { name: "Подкладки настольные", slug: "podkladki-nastolnye" },
      { name: "Лотки и накопители", slug: "lotki-i-nakopiteli" },
      { name: "Планшеты", slug: "planshety" },
      { name: "Штемпельная продукция", slug: "shtempelnaya-produktsiya" },
      { name: "Степлеры", slug: "steplery" },
      { name: "Клейкие ленты и диспенсеры", slug: "klejkie-lenty-i-dispensery" },
      { name: "Канцелярские наборы", slug: "kantselyarskie-nabory" },
      { name: "ZIP-пакеты", slug: "zip-pakety" },
      { name: "Чертежные принадлежности", slug: "chertezhnye-prinadlezhnosti" },
      { name: "Ножи и резаки", slug: "nozhi-i-rezaki" },
      { name: "Ножницы", slug: "nozhnitsy" },
      { name: "Обложки", slug: "oblozhki" },
    ],
  },
  {
    name: "Бумажная продукция",
    slug: "bumaga",
    subcategories: [
      { name: "Альбомы для рисования", slug: "albomy-dlya-risovaniya" },
      { name: "Бумага для рисования в папке", slug: "bumaga-dlya-risovaniya-v-papke" },
      { name: "Записные книжки", slug: "zapisnye-knizhki" },
      { name: "Наборы для творчества", slug: "nabory-dlya-tvorchestva" },
      { name: "Наклейки", slug: "nakleyki" },
      { name: "Планинги и ежедневники", slug: "planingi-i-ezhednevniki" },
      { name: "Расписания уроков", slug: "raspisaniya-urokov" },
      { name: "Тетради FolderBook", slug: "tetradi-folderbook" },
      { name: "Тетради для записи иностранных слов", slug: "tetradi-dlya-zapisi-inostrannyh-slov" },
      { name: "Тетради для нот", slug: "tetradi-dlya-not" },
      { name: "Тетради и блокноты", slug: "tetradi-i-bloknoty" },
      { name: "Тетради и блокноты с пластиковой обложкой", slug: "tetradi-i-bloknoty-s-plastikovoy-oblozhkoy" },
      { name: "Тетради на кольцах", slug: "tetradi-na-koltsah" },
      { name: "Тетради на скобе с картонной обложкой", slug: "tetradi-na-skobe-s-kartonnoj-oblozhkoy" },
      { name: "Тетради на спирали и блокноты", slug: "tetradi-na-spirali-i-bloknoty" },
      { name: "Тетради предметные", slug: "tetradi-predmetnye" },
    ],
  },
  {
    name: "Товары для творчества",
    slug: "tvorchestvo",
    subcategories: [
      { name: "Краски", slug: "kraski" },
      { name: "Акварельные краски", slug: "akvarelnye-kraski" },
      { name: "Акриловые краски", slug: "akrilovye-kraski" },
      { name: "Цветные карандаши", slug: "cvetnye-karandashi" },
      { name: "Карандаши чернографитные", slug: "tvorchestvo-karandashi-chernografitnye" },
      { name: "Ластики", slug: "tvorchestvo-lastiki" },
      { name: "Мелки и пастель", slug: "melki-i-pastel" },
      { name: "Фломастеры и маркеры", slug: "flomastery-i-markery" },
      { name: "Пластилин", slug: "plastilin" },
      { name: "Аксессуары для творчества", slug: "aksessuary-dlya-tvorchestva" },
    ],
  },
  {
    name: "Рюкзаки и аксессуары",
    slug: "ryukzaki",
    subcategories: [
      { name: "Пеналы", slug: "penaly" },
      { name: "Сумки", slug: "sumki" },
      { name: "Ранцы и рюкзаки ученические", slug: "rantsy-i-ryukzaki-uchenicheskie" },
      { name: "Рюкзаки", slug: "ryukzaki-universalnye" },
      { name: "Мини-рюкзаки для детей", slug: "mini-ryukzaki-dlya-detey" },
      { name: "Мешки для обуви", slug: "meshki-dlya-obuvi" },
      { name: "Сумки-шопперы", slug: "sumki-shopper" },
    ],
  },
];
