import type { Metadata } from "next";

import { noIndexMetadata } from "@/lib/seo/private-pages";

/** Корневой layout /admin: без проверки авторизации (страница входа). Защищённые страницы — в группе `(protected)`. */
export const metadata: Metadata = noIndexMetadata(
  "Админ-панель",
  "Служебный раздел администратора «Эквилибриум». Не индексируется.",
);

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
