import Link from "next/link";

import { AdminProductsPagination } from "@/components/admin/admin-products-pagination";
import { AdminProductsSortLink } from "@/components/admin/admin-products-sort-link";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { copyProductFromForm } from "@/lib/actions/product";
import { Button } from "@/components/ui/button";
import { getStockLabel } from "@/lib/product-stock-level";
import { getAdminProductsList } from "@/lib/queries/admin-products";

type AdminProductsPageProps = {
  searchParams: Promise<{
    created?: string;
    copyError?: string;
    deleted?: string;
    page?: string;
    sort?: string;
    dir?: string;
  }>;
};

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const sp = await searchParams;
  const justCreated = sp.created === "1";
  const copyError = sp.copyError === "1";
  const justDeleted = sp.deleted === "1";
  const list = await getAdminProductsList({
    page: sp.page,
    sort: sp.sort,
    dir: sp.dir,
  });

  return (
    <div>
      {justCreated && (
        <div className="mb-8 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-950">
          <p className="font-medium">Товар создан.</p>
          <p className="mt-1 text-emerald-900/85">
            Проверьте витрину:{" "}
            <Link href="/" className="underline underline-offset-2">
              главная
            </Link>
            {" · "}
            <Link href="/catalog/kanctovary" className="underline underline-offset-2">
              каталог «Канцтовары»
            </Link>
            .
          </p>
        </div>
      )}
      {copyError && (
        <div className="mb-8 rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-950">
          <p className="font-medium">Не удалось скопировать товар.</p>
          <p className="mt-1 text-red-900/85">Попробуйте ещё раз или проверьте лог сервера.</p>
        </div>
      )}
      {justDeleted && (
        <div className="mb-8 rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          <p className="font-medium">Товар удалён.</p>
          <p className="mt-1 text-amber-900/85">Карточка снята с витрины, связи с корзиной и избранным очищены.</p>
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#403A34]">Товары</h2>
          <p className="mt-2 text-sm text-[#403A34]/70">
            {list.total === 0
              ? "Список пуст."
              : `Всего ${list.total} поз. · по ${list.pageSize} на странице · сортировка по заголовкам таблицы.`}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">Новый товар</Link>
        </Button>
      </div>

      {list.items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[#403A34]/20 bg-white/50 p-10 text-center text-sm text-[#403A34]/60">
          Пока нет товаров.{" "}
          <Link href="/admin/products/new" className="font-medium text-[#403A34] underline">
            Создать первый
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-[#403A34]/10 bg-white/60">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[#403A34]/10 bg-[#fbf8f4] text-xs uppercase tracking-wide text-[#403A34]/55">
              <tr>
                <th className="px-4 py-3 font-medium">
                  <AdminProductsSortLink
                    label="Название"
                    field="name"
                    currentSort={list.sort}
                    currentDir={list.dir}
                  />
                </th>
                <th className="px-4 py-3 font-medium">
                  <AdminProductsSortLink
                    label="Категория"
                    field="category"
                    currentSort={list.sort}
                    currentDir={list.dir}
                  />
                </th>
                <th className="px-4 py-3 font-medium">
                  <AdminProductsSortLink
                    label="Цена"
                    field="price"
                    currentSort={list.sort}
                    currentDir={list.dir}
                  />
                </th>
                <th className="px-4 py-3 font-medium">
                  <AdminProductsSortLink
                    label="Наличие"
                    field="stock"
                    currentSort={list.sort}
                    currentDir={list.dir}
                  />
                </th>
                <th className="px-4 py-3 font-medium">
                  <AdminProductsSortLink
                    label="Статус"
                    field="status"
                    currentSort={list.sort}
                    currentDir={list.dir}
                  />
                </th>
                <th className="px-4 py-3 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {list.items.map((p) => (
                <tr key={p.id} className="border-b border-[#403A34]/5 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/product/${p.slug}`}
                      className="font-medium text-[#403A34] hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#403A34]/75">{p.mainCategory.name}</td>
                  <td className="px-4 py-3 tabular-nums text-[#403A34]">
                    {Number(p.price).toLocaleString("ru-RU", {
                      style: "currency",
                      currency: "RUB",
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="px-4 py-3 text-[#403A34]/80">{getStockLabel(p.stock)}</td>
                  <td className="px-4 py-3 text-[#403A34]/70">{p.isActive ? "Активен" : "Скрыт"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/products/${p.id}/edit`}>Редактировать</Link>
                      </Button>
                      <form action={copyProductFromForm} className="inline">
                        <input type="hidden" name="productId" value={p.id} />
                        <Button type="submit" variant="secondary" size="sm">
                          Копировать
                        </Button>
                      </form>
                      <DeleteProductButton productId={p.id} productName={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-4">
            <AdminProductsPagination
              page={list.page}
              totalPages={list.totalPages}
              total={list.total}
              sort={list.sort}
              dir={list.dir}
            />
          </div>
        </div>
      )}
    </div>
  );
}
