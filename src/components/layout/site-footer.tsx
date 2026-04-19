import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { SiteContainer } from "@/components/layout/site-container";
import { siteContact } from "@/data/site-contact";
import { cn } from "@/lib/utils";

function FooterColumn({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#403A34]/50">{title}</h2>
      <div className="mt-4 flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-[15px] leading-snug text-[#403A34]/78 transition-colors hover:text-[#403A34]"
    >
      {children}
    </Link>
  );
}

const catalogLinks = [
  { href: "/catalog/bumaga", label: "Бумажная продукция" },
  { href: "/catalog/kanctovary", label: "Канцтовары" },
  { href: "/catalog/ryukzaki", label: "Рюкзаки и аксессуары" },
  { href: "/catalog/tvorchestvo", label: "Товары для творчества" },
] as const;

const customerLinks = [
  { href: "/info/order", label: "Как оформить заказ" },
  { href: "/info/contacts", label: "Контакты" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#403A34]/10 bg-[#ede6dc]">
      <SiteContainer className="py-12 md:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8 xl:gap-10">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="group relative inline-flex h-10 w-[10.75rem] sm:h-11 sm:w-[11.75rem]"
            >
              <Image
                src="/vitrina/Tovary%20dlya%20tvorchestva/logo.webp"
                alt="Эквилибриум — канцелярия"
                fill
                className="object-contain object-left transition-opacity duration-200 group-hover:opacity-90"
                sizes="(max-width: 768px) 172px, 188px"
                unoptimized
              />
            </Link>
            <p className="mt-5 max-w-[22rem] text-[15px] leading-relaxed text-[#403A34]/72">
              Интернет-магазин канцелярских товаров для школы, офиса и творчества. Аккуратный подбор,
              спокойная эстетика и внимание к деталям.
            </p>
          </div>

          <FooterColumn title="Каталог">
            {catalogLinks.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Покупателям">
            {customerLinks.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Сервис">
            <FooterLink href="/cart">Корзина</FooterLink>
            <FooterLink href="/wishlist">Избранное</FooterLink>
            <FooterLink href="/account?tab=orders">Мои заказы</FooterLink>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-[15px] text-[#403A34]/78">
              <Link href="/login" className="transition-colors hover:text-[#403A34]">
                Вход
              </Link>
              <span className="text-[#403A34]/35" aria-hidden>
                /
              </span>
              <Link href="/account" className="transition-colors hover:text-[#403A34]">
                Аккаунт
              </Link>
            </div>
          </FooterColumn>

          <FooterColumn title="Контакты">
            <p className="text-[15px] leading-relaxed text-[#403A34]/72">
              Телефон:{" "}
              <a
                href={siteContact.phoneHref}
                className="whitespace-nowrap font-medium text-[#403A34]/85 underline-offset-2 transition-colors hover:text-[#403A34] hover:underline"
              >
                {siteContact.phone}
              </a>
            </p>
            <p className="text-[15px] leading-relaxed text-[#403A34]/72">
              Email:{" "}
              <a
                href={`mailto:${siteContact.email}`}
                className="font-medium text-[#403A34]/85 underline-offset-2 transition-colors hover:text-[#403A34] hover:underline"
              >
                {siteContact.email}
              </a>
            </p>
          </FooterColumn>
        </div>
      </SiteContainer>

      <div className="border-t border-[#403A34]/10 bg-[#e8e0d6]/80">
        <SiteContainer className="flex flex-col gap-4 py-5 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-6 md:gap-y-3">
          <p className="text-center text-[13px] text-[#403A34]/58 md:text-left">
            © 2026 Все права защищены.
          </p>
          <nav
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] md:justify-end"
            aria-label="Правовая информация"
          >
            <Link
              href="/legal/privacy"
              className="text-[#403A34]/65 underline-offset-2 transition-colors hover:text-[#403A34] hover:underline"
            >
              Политика конфиденциальности
            </Link>
            <Link
              href="/legal/terms"
              className="text-[#403A34]/65 underline-offset-2 transition-colors hover:text-[#403A34] hover:underline"
            >
              Пользовательское соглашение
            </Link>
          </nav>
        </SiteContainer>
      </div>
    </footer>
  );
}
