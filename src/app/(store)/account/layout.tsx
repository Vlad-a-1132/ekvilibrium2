import type { Metadata } from "next";

import { requireUser } from "@/lib/auth/user";
import { noIndexMetadata } from "@/lib/seo/private-pages";

export const metadata: Metadata = noIndexMetadata(
  "Личный кабинет",
  "Кабинет покупателя «Эквилибриум»: профиль и заказы. Раздел доступен после входа и не индексируется.",
);

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <>{children}</>;
}
