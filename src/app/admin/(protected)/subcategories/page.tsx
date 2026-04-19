import Link from "next/link";

import { DeleteSubcategoryButton } from "@/components/admin/delete-subcategory-button";
import { getAdminSubcategoriesSplit } from "@/lib/queries/admin";

type AdminSubcategoriesPageProps = {
  searchParams: Promise<{ created?: string }>;
};

export default async function AdminSubcategoriesPage({ searchParams }: AdminSubcategoriesPageProps) {
  const sp = await searchParams;
  const created = sp.created === "1";
  const { active, legacy } = await getAdminSubcategoriesSplit();

  return (
    <div>
      {created && (
        <div className="mb-8 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-950">
          Подкатегория создана — она появится в шапке и в каталоге соответствующего раздела.
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#403A34]">Подкатегории</h2>
          <p className="mt-2 text-sm text-[#403A34]/70">
            Под каноническими главными категориями (витрина и каталог).
          </p>
        </div>
        <Link
          href="/admin/subcategories/new"
          className="rounded-lg border border-[#403A34]/20 bg-white px-4 py-2 text-sm font-medium text-[#403A34] transition-colors hover:bg-[#403A34]/5"
        >
          Новая подкатегория
        </Link>
      </div>

      {legacy.length > 0 && (
        <div className="mt-8 rounded-xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          <p className="font-medium">Legacy / привязка к старой главной категории</p>
          <p className="mt-1 text-amber-900/85">
            Эти подкатегории не относятся к актуальным четырём главным разделам. После нормализации БД и
            переноса товаров их можно удалить вручную или дождаться освобождения от товаров и снова
            запустить скрипт очистки.
          </p>
          <div className="mt-4 overflow-x-auto rounded-lg border border-amber-200/60 bg-white/60">
            <table className="w-full min-w-[680px] text-left text-xs">
              <thead className="border-b border-amber-200/80 text-amber-800/80">
                <tr>
                  <th className="px-3 py-2 font-medium">Название</th>
                  <th className="px-3 py-2 font-medium">Slug</th>
                  <th className="px-3 py-2 font-medium">Главная (legacy)</th>
                  <th className="px-3 py-2 font-medium tabular-nums">Товаров</th>
                  <th className="px-3 py-2 font-medium text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {legacy.map((r) => (
                  <tr key={r.id} className="border-b border-amber-100/80 last:border-0">
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2 font-mono">{r.slug}</td>
                    <td className="px-3 py-2">{r.mainCategoryName}</td>
                    <td className="px-3 py-2 tabular-nums">{r.productCount}</td>
                    <td className="px-3 py-2 text-right">
                      <DeleteSubcategoryButton
                        subCategoryId={r.id}
                        subCategoryName={r.name}
                        productCount={r.productCount}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {active.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[#403A34]/20 bg-white/50 p-10 text-center text-sm text-[#403A34]/60">
          Нет подкатегорий под актуальными главными категориями.{" "}
          <Link href="/admin/subcategories/new" className="font-medium text-[#403A34] underline">
            Создать
          </Link>{" "}
          или выполните <code className="rounded bg-[#403A34]/10 px-1">npm run db:seed</code>.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-[#403A34]/10 bg-white/60">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-[#403A34]/10 bg-[#fbf8f4] text-xs uppercase tracking-wide text-[#403A34]/55">
              <tr>
                <th className="px-4 py-3 font-medium">Название</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Главная категория</th>
                <th className="px-4 py-3 font-medium tabular-nums">Товаров</th>
                <th className="px-4 py-3 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {active.map((r) => (
                <tr key={r.id} className="border-b border-[#403A34]/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-[#403A34]">{r.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#403A34]/75">{r.slug}</td>
                  <td className="px-4 py-3 text-[#403A34]/85">{r.mainCategoryName}</td>
                  <td className="px-4 py-3 tabular-nums text-[#403A34]/85">{r.productCount}</td>
                  <td className="px-4 py-3 text-right">
                    <DeleteSubcategoryButton
                      subCategoryId={r.id}
                      subCategoryName={r.name}
                      productCount={r.productCount}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
