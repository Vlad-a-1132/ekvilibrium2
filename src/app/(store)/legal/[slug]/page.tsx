import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteContainer } from "@/components/layout/site-container";
import { absoluteUrl } from "@/lib/seo/site";
import { truncateMetaDescription } from "@/lib/seo/truncate";

const PAGES: Record<string, { title: string; intro: string }> = {
  privacy: {
    title: "Политика конфиденциальности",
    intro:
      "Документ готовится. Здесь будет описание обработки персональных данных при использовании сайта и оформлении заказов.",
  },
  terms: {
    title: "Пользовательское соглашение",
    intro:
      "Документ готовится. Здесь будут правила пользования сайтом, оформления заказов и ответственности сторон.",
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return { title: "Правовая информация" };
  const title = `${page.title} — «Эквилибриум»`;
  const description = truncateMetaDescription(page.intro);
  const canonical = absoluteUrl(`/legal/${slug}`);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
    robots: { index: true, follow: true },
  };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  return (
    <div className="py-10 md:py-14">
      <SiteContainer className="max-w-2xl">
        <nav className="text-sm text-[#403A34]/55">
          <Link href="/" className="transition-colors hover:text-[#403A34]">
            Главная
          </Link>
          <span className="mx-2 text-[#403A34]/35">/</span>
          <span className="font-medium text-[#403A34]">{page.title}</span>
        </nav>
        <h1 className="mt-6 font-serif text-3xl tracking-tight text-[#403A34] md:text-4xl">{page.title}</h1>
        <p className="mt-5 text-[15px] leading-relaxed text-[#403A34]/78">{page.intro}</p>
        <p className="mt-8 text-sm text-[#403A34]/55">
          <Link href="/" className="text-[#403A34] underline-offset-2 hover:underline">
            ← На главную
          </Link>
        </p>
      </SiteContainer>
    </div>
  );
}
