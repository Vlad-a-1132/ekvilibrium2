import path from "path";

/**
 * Корень репозитория на диске (рядом с `package.json`, внутри — папка `public/`).
 *
 * На production под PM2 `process.cwd()` иногда указывает не на каталог приложения
 * (например, на домашнюю директорию или на `.next/standalone`), из‑за чего загрузки
 * пишутся «мимо» реального `public/` и по URL `/uploads/...` отдаётся 404.
 *
 * Задайте в окружении **PROJECT_ROOT** абсолютный путь к корню проекта — тогда записи
 * всегда попадут в `PROJECT_ROOT/public/uploads/products/...`.
 */
export function getProjectRoot(): string {
  const fromEnv = process.env.PROJECT_ROOT?.trim();
  if (fromEnv) {
    return path.resolve(fromEnv);
  }
  return path.resolve(process.cwd());
}

export function getPublicDirAbsolute(): string {
  return path.join(getProjectRoot(), "public");
}

/** Абсолютный путь: `{project}/public/uploads/products` */
export function getProductUploadsRootAbsolute(): string {
  return path.join(getPublicDirAbsolute(), "uploads", "products");
}

/**
 * Канонический публичный URL для файла в `public/uploads/products/{segment}/{filename}`.
 * Всегда с ведущим `/`, без лишних слэшей.
 */
export function publicProductImageUrl(segment: string, filename: string): string {
  const seg = segment.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const file = filename.replace(/\\/g, "/").replace(/^\/+/, "");
  return `/uploads/products/${seg}/${file}`;
}
