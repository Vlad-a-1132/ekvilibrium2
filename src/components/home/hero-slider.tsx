"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
  cta: string;
  /** Уникальный градиент + декор */
  gradient: string;
  decorClass: string;
  /** Опционально: фото справа (и на мобильных под текстом) */
  heroImage?: string;
};

const SLIDES: Slide[] = [
  {
    id: "office-school",
    eyebrow: "Канцтовары",
    title: "Школа и офис — в одном ритме",
    subtitle:
      "Ручки, тетради и мелочи для учёбы и работы: функционально, спокойно, без визуального шума.",
    href: "/catalog/kanctovary",
    cta: "Перейти в каталог",
    gradient: "from-[#ede6dc] via-[#f6f1eb] to-[#fbf8f4]",
    decorClass: "bg-[#8b7355]/12",
    heroImage: "/slaider/523f6938-2738-499f-8c3a-3c8ebecbb21b.png",
  },
  {
    id: "creativity",
    eyebrow: "Творчество",
    title: "Материалы, которым доверяют руки",
    subtitle:
      "Краски, карандаши и всё для вдохновения — подборка для художников, студентов и тех, кто рисует для себя.",
    href: "/catalog/tvorchestvo",
    cta: "В раздел творчества",
    gradient: "from-[#e8e2db] via-[#f6f1eb] to-[#f0ebe4]",
    decorClass: "bg-[#6b8f7a]/14",
    heroImage: "/slaider/ba0f98ab-ca17-4fb9-8a39-f7bd99b7974b.png",
  },
  {
    id: "bags",
    eyebrow: "Рюкзаки и аксессуары",
    title: "С собой — только нужное",
    subtitle:
      "Рюкзаки, пеналы и сумки для школы, города и дороги — удобные формы и тихая премиальная эстетика.",
    href: "/catalog/ryukzaki",
    cta: "Смотреть коллекцию",
    gradient: "from-[#e5dfd8] via-[#f6f1eb] to-[#faf7f3]",
    decorClass: "bg-[#7a6b8f]/12",
    heroImage: "/slaider/00a186a6-9816-4226-ac24-823c1afa3366.png",
  },
];

const AUTO_MS = 5500;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const n = SLIDES.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + n) % n);
    },
    [n],
  );

  useEffect(() => {
    const t = window.setInterval(() => go(1), AUTO_MS);
    return () => window.clearInterval(t);
  }, [go]);

  const slide = SLIDES[index];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#403A34]/10 shadow-[0_24px_70px_-30px_rgba(64,58,52,0.45)]">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-95", slide.gradient)} aria-hidden />
      <div
        className={cn(
          "pointer-events-none absolute -right-20 -top-24 size-[min(55vw,420px)] rounded-full blur-3xl",
          slide.decorClass,
        )}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/4 size-[min(40vw,280px)] rounded-full bg-[#403A34]/6 blur-3xl"
        aria-hidden
      />

      <div className="relative grid min-h-[min(72vh,520px)] grid-cols-1 gap-8 px-6 py-12 sm:px-10 sm:py-14 md:min-h-[400px] md:grid-cols-[1fr_minmax(0,0.85fr)] md:items-center md:gap-12 lg:px-14 lg:py-16">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-w-xl flex-col justify-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#403A34]/50">{slide.eyebrow}</p>
            <h2 className="mt-4 font-serif text-3xl leading-[1.12] tracking-tight text-[#403A34] sm:text-4xl md:text-[2.35rem]">
              {slide.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#403A34]/75 sm:text-[17px]">{slide.subtitle}</p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-[#403A34] px-8 text-[#f6f1eb] shadow-lg shadow-[#403A34]/20 hover:bg-[#2f2a25]"
              >
                <Link href={slide.href}>{slide.cta}</Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`visual-${slide.id}`}
            className={cn(
              "relative flex min-h-[200px] items-center justify-center",
              slide.heroImage ? "mt-6 block md:mt-0" : "hidden md:flex",
            )}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {slide.heroImage ? (
              <div className="relative aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl border border-[#403A34]/10 bg-[#fbf8f4] shadow-[0_20px_50px_-24px_rgba(64,58,52,0.35)]">
                <Image
                  src={slide.heroImage}
                  alt=""
                  fill
                  className="object-contain object-center p-3 sm:p-5"
                  sizes="(max-width: 768px) 100vw, 45vw"
                  priority
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative aspect-square w-full max-w-[280px] rounded-2xl border border-[#403A34]/8 bg-white/40 p-6 shadow-inner backdrop-blur-[2px]">
                  <div className="absolute inset-2 rounded-xl border border-dashed border-[#403A34]/10" />
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                    <span className="font-serif text-lg text-[#403A34]/85">Эквилибриум</span>
                    <span className="text-xs uppercase tracking-[0.18em] text-[#403A34]/45">канцелярия</span>
                  </div>
                </div>
                <div
                  className={cn(
                    "absolute -bottom-4 right-4 h-24 w-40 rotate-[-8deg] rounded-2xl border border-[#403A34]/10 bg-white/50 shadow-lg",
                    "hidden lg:block",
                  )}
                />
                <div
                  className={cn(
                    "absolute -top-2 right-8 h-16 w-16 rotate-12 rounded-xl border border-[#403A34]/8 bg-[#f6f1eb]/90 shadow-md",
                    "hidden lg:block",
                  )}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative flex items-center justify-between gap-4 border-t border-[#403A34]/8 bg-[#f6f1eb]/40 px-4 py-3 sm:px-6">
        <div className="flex gap-1.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === index ? "w-8 bg-[#403A34]" : "w-2 bg-[#403A34]/22 hover:bg-[#403A34]/35",
              )}
              aria-label={`Слайд ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-[#403A34]/15 bg-white/80 text-[#403A34] shadow-sm transition-colors hover:bg-white"
            aria-label="Предыдущий слайд"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-[#403A34]/15 bg-white/80 text-[#403A34] shadow-sm transition-colors hover:bg-white"
            aria-label="Следующий слайд"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
