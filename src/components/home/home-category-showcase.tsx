import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { HomeShowcaseSectionMeta } from "@/data/home-showcase";
import type { HomeShowcaseTile } from "@/lib/queries/home";
import { cn } from "@/lib/utils";

import { HomeShowcaseCard } from "./home-showcase-card";

type HomeCategoryShowcaseProps = {
  section: HomeShowcaseSectionMeta;
  tiles: HomeShowcaseTile[];
};

export function HomeCategoryShowcase({ section, tiles }: HomeCategoryShowcaseProps) {
  if (tiles.length === 0) return null;

  const sectionHref = `/catalog/${section.mainSlug}`;

  return (
    <section
      aria-labelledby={`showcase-${section.id}-heading`}
      className={cn(
        "scroll-mt-8 rounded-3xl border border-[#403A34]/10 p-6 shadow-[0_20px_60px_-40px_rgba(64,58,52,0.35)] md:p-8 lg:p-10",
        section.tone === "creative"
          ? "bg-gradient-to-br from-[#fffbf7] via-[#fbf8f4] to-[#f0ebe4]"
          : "bg-[#fbf8f4]/90",
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#403A34]/45">
            Витрина
          </p>
          <h2
            id={`showcase-${section.id}-heading`}
            className="mt-3 font-serif text-2xl tracking-tight text-[#403A34] md:text-3xl lg:text-[2rem]"
          >
            {section.headline}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#403A34]/72 md:text-[15px]">
            {section.subheadline}
          </p>
        </div>
        <Link
          href={sectionHref}
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-2xl border border-[#403A34]/15 bg-white px-5 py-3 text-sm font-semibold text-[#403A34] shadow-sm transition-all hover:border-[#403A34]/25 hover:bg-[#f6f1eb] lg:self-auto"
        >
          {section.ctaLabel}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <ul className="mt-10 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <li key={tile.slug}>
            <HomeShowcaseCard
              href={tile.href}
              title={tile.title}
              imageUrl={tile.imageUrl}
              tone={section.tone === "creative" ? "creative" : "default"}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
