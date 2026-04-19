import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { siteContact } from "@/data/site-contact";

export function HomeContact() {
  return (
    <section
      className="overflow-hidden rounded-3xl border border-[#403A34]/10 bg-gradient-to-br from-white/90 via-[#fbf8f4] to-[#f6f1eb] shadow-[0_24px_70px_-36px_rgba(64,58,52,0.35)]"
      aria-labelledby="home-contact-heading"
    >
      <div className="grid gap-0 lg:grid-cols-[1fr_minmax(0,1.1fr)]">
        <div className="space-y-6 p-6 md:p-10 lg:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#403A34]/45">Связь</p>
            <h2 id="home-contact-heading" className="mt-3 font-serif text-2xl text-[#403A34] md:text-3xl">
              {siteContact.title}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#403A34]/72">{siteContact.lead}</p>
          </div>

          <ul className="space-y-5 text-sm text-[#403A34]/85">
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#403A34]/10 bg-white/80 text-[#403A34]/65">
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
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#403A34]/10 bg-white/80 text-[#403A34]/65">
                <Phone className="size-4" aria-hidden />
              </span>
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2">
                <span className="font-medium text-[#403A34]">{siteContact.phoneContactName}</span>
                <a href={siteContact.phoneHref} className="font-medium underline-offset-2 hover:underline">
                  {siteContact.phone}
                </a>
                <Link
                  href={`mailto:${siteContact.email}?subject=Заказ%20с%20сайта`}
                  className="inline-flex w-fit items-center justify-center rounded-xl border border-[#403A34]/20 bg-[#403A34] px-4 py-2 text-xs font-semibold text-[#f6f1eb] shadow-sm transition-colors hover:bg-[#2f2a25] sm:text-sm"
                >
                  Написать нам
                </Link>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#403A34]/10 bg-white/80 text-[#403A34]/65">
                <Mail className="size-4" aria-hidden />
              </span>
              <a href={`mailto:${siteContact.email}`} className="font-medium hover:underline">
                {siteContact.email}
              </a>
            </li>
          </ul>

          <p className="text-xs text-[#403A34]/50">{siteContact.hours}</p>
        </div>

        <div className="relative min-h-[280px] border-t border-[#403A34]/10 bg-[#f6f1eb]/40 lg:min-h-[min(100%,440px)] lg:border-l lg:border-t-0">
          <iframe
            title="Карта — как добраться до магазина Equilibrium"
            src={siteContact.yandexMapIframeSrc}
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
