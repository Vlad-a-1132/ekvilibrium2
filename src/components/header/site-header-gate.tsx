"use client";

import { usePathname } from "next/navigation";

import { SiteHeader, type SiteHeaderProps } from "@/components/header/site-header";

/** Временно: true — не рендерить шапку на /checkout (контрольный тест .map). После проверки выставить false. */
export const TEMP_HIDE_SITE_HEADER_ON_CHECKOUT = true;

export function SiteHeaderGate(props: SiteHeaderProps) {
  const pathname = usePathname();
  if (TEMP_HIDE_SITE_HEADER_ON_CHECKOUT && pathname === "/checkout") {
    return null;
  }
  return <SiteHeader {...props} />;
}
