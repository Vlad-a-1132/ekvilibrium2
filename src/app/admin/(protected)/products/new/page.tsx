import Link from "next/link";

import { ProductCreateForm } from "@/components/admin/product-create-form";
import { getMainCategoriesForProductForm } from "@/lib/queries/categories";

export default async function AdminProductNewPage() {
  const rows = await getMainCategoriesForProductForm();

  if (rows.length === 0) {
    return (
      <div className="max-w-xl">
        <h2 className="font-serif text-2xl text-[#403A34]">Новый товар</h2>
        <p className="mt-4 text-sm leading-relaxed text-[#403A34]/80">
          В базе данных нет главных категорий. Обычно это значит: не выполнены миграции Prisma и сид, или
          неверный <code className="rounded bg-[#403A34]/10 px-1">DATABASE_URL</code>.
        </p>
        <div className="mt-6 rounded-xl border border-[#403A34]/15 bg-[#fbf8f4] p-5 text-sm text-[#403A34]/85">
          <p className="font-medium text-[#403A34]">Что сделать локально</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>
              Откройте терминал в папке проекта:{" "}
              <code className="rounded bg-white/80 px-1.5 py-0.5 text-[#403A34]">equilibrium-web</code>
            </li>
            <li>
              Скопируйте <code className="rounded bg-white/80 px-1">.env.example</code> →{" "}
              <code className="rounded bg-white/80 px-1">.env</code> и укажите рабочий PostgreSQL{" "}
              <code className="rounded bg-white/80 px-1">DATABASE_URL</code>.
            </li>
            <li>
              Примените схему и сид (любой удобный вариант):
              <div className="mt-2 space-y-1 font-mono text-xs text-[#403A34]">
                <div>
                  <code className="block rounded bg-white/90 px-2 py-1.5">npm run db:push</code>
                </div>
                <div className="text-[#403A34]/60">или</div>
                <div>
                  <code className="block rounded bg-white/90 px-2 py-1.5">npm run db:migrate</code>
                </div>
                <div className="pt-1">затем обязательно:</div>
                <div>
                  <code className="block rounded bg-white/90 px-2 py-1.5">npm run db:seed</code>
                </div>
              </div>
            </li>
          </ol>
          <p className="mt-4 text-xs text-[#403A34]/60">
            Сид читает <code className="rounded bg-white/80 px-1">src/data/category-blueprint.ts</code> и
            создаёт главные категории и подкатегории в таблицах Prisma.
          </p>
        </div>
        <Link href="/admin/products" className="mt-8 inline-block text-sm text-[#403A34] underline">
          ← К списку товаров
        </Link>
      </div>
    );
  }

  const categories = rows.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    subcategories: c.subcategories,
  }));

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#403A34]">Новый товар</h2>
          <p className="mt-2 text-sm text-[#403A34]/70">
            Заполните поля и при необходимости загрузите изображения — они сохранятся в{" "}
            <code className="rounded bg-[#403A34]/10 px-1 text-xs">public/uploads/products</code>.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="text-sm text-[#403A34]/80 underline-offset-4 hover:underline"
        >
          Назад к списку
        </Link>
      </div>

      <ProductCreateForm categories={categories} />
    </div>
  );
}
