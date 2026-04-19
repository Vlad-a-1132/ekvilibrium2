import Link from "next/link";

import { SubcategoryCreateForm } from "@/components/admin/subcategory-create-form";
import { getCanonicalMainCategoriesForSelect } from "@/lib/queries/admin";

export default async function AdminSubcategoryNewPage() {
  const mains = await getCanonicalMainCategoriesForSelect();

  if (mains.length === 0) {
    return (
      <div className="max-w-xl">
        <h2 className="font-serif text-2xl text-[#403A34]">Новая подкатегория</h2>
        <p className="mt-4 text-sm text-[#403A34]/80">
          Сначала создайте главные категории через сид:{" "}
          <code className="rounded bg-[#403A34]/10 px-1">npm run db:seed</code>
        </p>
        <Link href="/admin/subcategories" className="mt-6 inline-block text-sm text-[#403A34] underline">
          ← Назад
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#403A34]">Новая подкатегория</h2>
          <p className="mt-2 text-sm text-[#403A34]/70">
            Slug — для URL и фильтров; лучше латиница и дефисы.
          </p>
        </div>
        <Link
          href="/admin/subcategories"
          className="text-sm text-[#403A34]/80 underline-offset-4 hover:underline"
        >
          Назад к списку
        </Link>
      </div>

      <SubcategoryCreateForm mainCategories={mains} />
    </div>
  );
}
