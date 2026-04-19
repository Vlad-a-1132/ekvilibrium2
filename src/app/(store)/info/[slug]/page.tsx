import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { notFound } from "next/navigation";

import { SiteContainer } from "@/components/layout/site-container";
import { infoPages } from "@/data/info-pages";
import { siteContact } from "@/data/site-contact";

type Props = { params: Promise<{ slug: string }> };

const CONTACTS_SLUG = "contacts";

export function generateStaticParams() {
  return [{ slug: "order" }, { slug: CONTACTS_SLUG }];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (slug === CONTACTS_SLUG) {
    return { title: "Контакты — Эквилибриум" };
  }
  const page = infoPages[slug as keyof typeof infoPages];
  if (!page) return { title: "Информация" };
  return { title: `${page.title} — Эквилибриум` };
}

export default async function InfoPage({ params }: Props) {
  const { slug } = await params;

  if (slug === CONTACTS_SLUG) {
    return (
      <div className="py-10 md:py-14">
        <SiteContainer className="max-w-2xl">
          <nav className="text-sm text-[#403A34]/55">
            <Link href="/" className="transition-colors hover:text-[#403A34]">
              Главная
            </Link>
            <span className="mx-2 text-[#403A34]/35">/</span>
            <span className="font-medium text-[#403A34]">Контакты</span>
          </nav>
          <h1 className="mt-6 font-serif text-3xl tracking-tight text-[#403A34] md:text-4xl">Контакты</h1>
          <p className="mt-5 text-[15px] leading-relaxed text-[#403A34]/78">{siteContact.lead}</p>

          <ul className="mt-8 space-y-6 text-[15px] leading-relaxed text-[#403A34]/85">
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#403A34]/10 bg-[#fbf8f4] text-[#403A34]/65">
                <MapPin className="size-4" aria-hidden />
              </span>
              <span>
                {siteContact.addressLines.map((line, i) => (
                  <span key={`${i}-${line}`} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#403A34]/10 bg-[#fbf8f4] text-[#403A34]/65">
                <Phone className="size-4" aria-hidden />
              </span>
              <a href={siteContact.phoneHref} className="font-medium text-[#403A34] underline-offset-2 hover:underline">
                {siteContact.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#403A34]/10 bg-[#fbf8f4] text-[#403A34]/65">
                <Mail className="size-4" aria-hidden />
              </span>
              <a href={`mailto:${siteContact.email}`} className="font-medium text-[#403A34] underline-offset-2 hover:underline">
                {siteContact.email}
              </a>
            </li>
          </ul>

          <p className="mt-6 text-sm text-[#403A34]/55">{siteContact.hours}</p>

          <div className="mt-8">
            <Link
              href={`mailto:${siteContact.email}?subject=Вопрос%20с%20сайта%20Эквилибриум`}
              className="inline-flex items-center justify-center rounded-2xl bg-[#403A34] px-6 py-3 text-sm font-semibold text-[#f6f1eb] shadow-lg shadow-[#403A34]/18 transition-colors hover:bg-[#2f2a25]"
            >
              Написать нам
            </Link>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-[#403A34]/10 bg-[#f6f1eb]/40">
            <div className="relative aspect-[16/10] min-h-[240px] w-full sm:aspect-[16/9]">
              <iframe
                title="Карта — как добраться до магазина Эквилибриум"
                src={siteContact.yandexMapIframeSrc}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
              />
            </div>
          </div>

          <p className="mt-8 text-sm text-[#403A34]/55">
            <Link href="/" className="text-[#403A34] underline-offset-2 hover:underline">
              ← На главную
            </Link>
          </p>
        </SiteContainer>
      </div>
    );
  }

  const page = infoPages[slug as keyof typeof infoPages];
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
        <p className="mt-5 text-[15px] leading-relaxed text-[#403A34]/78">{page.lead}</p>

        <ol className="mt-8 list-decimal space-y-4 pl-5 text-[15px] leading-relaxed text-[#403A34]/85 marker:font-medium marker:text-[#403A34]">
          {page.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>

        <p className="mt-10 text-sm text-[#403A34]/55">
          <Link href="/" className="text-[#403A34] underline-offset-2 hover:underline">
            ← На главную
          </Link>
        </p>
      </SiteContainer>
    </div>
  );
}
