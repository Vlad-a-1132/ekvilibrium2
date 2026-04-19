/** Значения stock в БД для режима админки «Мало» / «Много». */
export const ADMIN_STOCK_LOW = 1;
export const ADMIN_STOCK_HIGH = 999;

/** Порог для отображения в форме и на витрине: stock ≤ порога → «Мало», иначе → «Много». */
export const ADMIN_STOCK_UI_THRESHOLD = 5;

/**
 * Человекочитаемый статус наличия для витрины и админки (не выводить сырое stock из БД).
 * 999 и прочие внутренние значения не показываются числом.
 */
export function getStockLabel(stock: number): string {
  if (!Number.isFinite(stock) || stock <= 0) return "Нет в наличии";
  if (stock <= ADMIN_STOCK_UI_THRESHOLD) return "Мало";
  return "Много";
}

export type StockLevel = "low" | "high";

export function stockLevelFromDb(stock: number): StockLevel {
  if (!Number.isFinite(stock) || stock < 0) return "low";
  return stock <= ADMIN_STOCK_UI_THRESHOLD ? "low" : "high";
}

export function stockNumberFromLevel(level: StockLevel): number {
  return level === "low" ? ADMIN_STOCK_LOW : ADMIN_STOCK_HIGH;
}

/**
 * Разбор поля stock из формы: допускаются только 1 и 999;
 * прочие числа нормализуются по порогу (обратная совместимость).
 */
export function parseAdminStockInput(
  raw: string,
): { ok: true; value: number } | { ok: false; error: string } {
  const t = raw.trim();
  if (t === "") {
    return { ok: false, error: "Выберите наличие." };
  }
  if (t === "1") {
    return { ok: true, value: ADMIN_STOCK_LOW };
  }
  if (t === "999") {
    return { ok: true, value: ADMIN_STOCK_HIGH };
  }
  const n = Number.parseInt(t, 10);
  if (Number.isNaN(n) || n < 0) {
    return { ok: false, error: "Некорректное наличие." };
  }
  return {
    ok: true,
    value: n <= ADMIN_STOCK_UI_THRESHOLD ? ADMIN_STOCK_LOW : ADMIN_STOCK_HIGH,
  };
}
