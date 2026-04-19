import { getAdminMainCategoriesSplit } from "@/lib/queries/admin";

export default async function AdminCategoriesPage() {
  const { active, legacy } = await getAdminMainCategoriesSplit();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#403A34]">Главные категории</h2>
          <p className="mt-2 text-sm text-[#403A34]/70">
            Актуальные разделы витрины (slug из <code className="rounded bg-[#403A34]/10 px-1 text-xs">category-blueprint</code>
            ).
          </p>
        </div>
        <span className="rounded-full border border-[#403A34]/15 bg-[#fbf8f4] px-3 py-1 text-xs text-[#403A34]/65">
          Редактирование — скоро
        </span>
      </div>

      {legacy.length > 0 && (
        <div className="mt-8 rounded-xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          <p className="font-medium">Legacy / требует ручного разбора</p>
          <p className="mt-1 text-amber-900/85">
            Записи не из актуального blueprint (обычно после смены slug). Пока на них есть товары — не
            удаляются. Запустите{" "}
            <code className="rounded bg-white/80 px-1 text-xs">npx tsx prisma/normalize-categories.ts</code>{" "}
            после переноса товаров или выполните{" "}
            <code className="rounded bg-white/80 px-1 text-xs">npm run db:seed</code> для синхронизации имён.
          </p>
          <div className="mt-4 overflow-x-auto rounded-lg border border-amber-200/60 bg-white/60">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead className="border-b border-amber-200/80 text-amber-800/80">
                <tr>
                  <th className="px-3 py-2 font-medium">Название</th>
                  <th className="px-3 py-2 font-medium">Slug</th>
                  <th className="px-3 py-2 font-medium tabular-nums">Товаров</th>
                </tr>
              </thead>
              <tbody>
                {legacy.map((r) => (
                  <tr key={r.id} className="border-b border-amber-100/80 last:border-0">
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2 font-mono">{r.slug}</td>
                    <td className="px-3 py-2 tabular-nums">{r.productCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {active.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[#403A34]/20 bg-white/50 p-10 text-center text-sm text-[#403A34]/60">
          Нет актуальных главных категорий. Выполните <code className="rounded bg-[#403A34]/10 px-1">npm run db:seed</code>.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-[#403A34]/10 bg-white/60">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[#403A34]/10 bg-[#fbf8f4] text-xs uppercase tracking-wide text-[#403A34]/55">
              <tr>
                <th className="px-4 py-3 font-medium">Название</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium tabular-nums">Подкатегорий</th>
                <th className="px-4 py-3 font-medium tabular-nums">Товаров</th>
              </tr>
            </thead>
            <tbody>
              {active.map((r) => (
                <tr key={r.id} className="border-b border-[#403A34]/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-[#403A34]">{r.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#403A34]/75">{r.slug}</td>
                  <td className="px-4 py-3 tabular-nums text-[#403A34]/85">{r.subcategoryCount}</td>
                  <td className="px-4 py-3 tabular-nums text-[#403A34]/85">{r.productCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
