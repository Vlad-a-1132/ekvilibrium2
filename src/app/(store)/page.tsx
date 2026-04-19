import { HeroSlider } from "@/components/home/hero-slider";
import { HomeCategoryShowcase } from "@/components/home/home-category-showcase";
import { HomeContact } from "@/components/home/home-contact";
import { HomeSpotlight } from "@/components/home/home-spotlight";
import { SiteContainer, StoreFullBleed } from "@/components/layout/site-container";
import { HOME_SHOWCASE_SECTIONS, resolveShowcaseItems } from "@/data/home-showcase";
import { enrichShowcaseTiles, getHomeSpotlightProducts } from "@/lib/queries/home";
import { getWishlistProductIds } from "@/lib/queries/wishlist";

export default async function HomePage() {
  const [wishlistIds, spotlight, showcaseTilesList] = await Promise.all([
    getWishlistProductIds(),
    getHomeSpotlightProducts(8),
    Promise.all(
      HOME_SHOWCASE_SECTIONS.map(async (section) => {
        const items = resolveShowcaseItems(section.mainSlug, section.subSlugs);
        return enrichShowcaseTiles(section.mainSlug, items);
      }),
    ),
  ]);

  return (
    <>
      <StoreFullBleed className="border-b border-[#403A34]/10 bg-gradient-to-b from-[#f6f1eb] via-[#f6f1eb] to-[#ede6dc]/50">
        <SiteContainer className="py-12 md:py-16 lg:py-20">
          <HeroSlider />
        </SiteContainer>
      </StoreFullBleed>

      <div className="space-y-16 py-14 md:space-y-20 md:py-20">
        {HOME_SHOWCASE_SECTIONS.map((section, index) => (
          <HomeCategoryShowcase
            key={section.id}
            section={section}
            tiles={showcaseTilesList[index] ?? []}
          />
        ))}

        <HomeSpotlight products={spotlight} wishlistIds={wishlistIds} />

        <HomeContact />
      </div>
    </>
  );
}
