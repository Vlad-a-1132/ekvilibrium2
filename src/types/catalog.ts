export type SubcategoryNav = {
  id: string;
  name: string;
  slug: string;
};

export type MainCategoryNav = {
  id: string;
  name: string;
  slug: string;
  subcategories: SubcategoryNav[];
};

/** Товар для списков каталога (без тяжёлых связей). */
export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  image: { path: string; alt: string | null } | null;
};

export type PaginatedCatalogProducts = {
  products: CatalogProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
