"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

type YandexMetrikaTrackerProps = {
  counterId: number;
};

export function YandexMetrikaTracker({ counterId }: YandexMetrikaTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstHit = useRef(true);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    if (isFirstHit.current) {
      isFirstHit.current = false;
      return;
    }

    if (typeof window.ym !== "function") return;

    window.ym(counterId, "hit", url, {
      title: document.title,
      referer: window.location.href,
    });
  }, [counterId, pathname, searchParams]);

  return null;
}
