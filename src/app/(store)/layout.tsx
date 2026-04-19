import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeaderGate } from "@/components/header/site-header-gate";
import { storeCanvasClassName } from "@/components/layout/site-container";
import { getCurrentUser } from "@/lib/auth/user";
import { getMainCategoriesForNav } from "@/lib/queries/categories";
import { getStoreHeaderCounts } from "@/lib/queries/store-header";
import { cn } from "@/lib/utils";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [categories, counts, user] = await Promise.all([
    getMainCategoriesForNav(),
    getStoreHeaderCounts(),
    getCurrentUser(),
  ]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#f6f1eb] text-[#403A34]">
      <SiteHeaderGate
        categories={categories}
        cartCount={counts.cartCount}
        wishlistCount={counts.wishlistCount}
        isAuthenticated={user != null}
      />
      <main className="flex-1 w-full min-w-0">
        <div className={cn(storeCanvasClassName)}>{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
