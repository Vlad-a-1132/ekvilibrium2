"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useId, useState } from "react";

import { cn } from "@/lib/utils";

export function HeaderSearch() {
  const router = useRouter();
  const panelId = useId();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  function submit(trimmed: string) {
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setMobileOpen(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submit(q.trim());
  }

  const fieldClass =
    "w-full rounded-2xl border border-[#403A34]/12 bg-white/90 py-2.5 pl-10 pr-3 text-sm text-[#403A34] shadow-sm outline-none transition-[box-shadow,border-color] placeholder:text-[#403A34]/40 focus:border-[#403A34]/28 focus:ring-2 focus:ring-[#403A34]/12";

  return (
    <div className="relative min-w-0 w-full">
      <form
        onSubmit={onSubmit}
        className="relative hidden w-full lg:block"
        role="search"
      >
        <label htmlFor={`${panelId}-desktop`} className="sr-only">
          Поиск по каталогу
        </label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-[1.1rem] -translate-y-1/2 text-[#403A34]/40"
          strokeWidth={1.5}
          aria-hidden
        />
        <input
          id={`${panelId}-desktop`}
          name="q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по каталогу…"
          autoComplete="off"
          className={fieldClass}
        />
      </form>

      <div className="flex justify-end lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-2xl border border-transparent text-[#403A34] transition-all duration-200",
            "hover:border-[#403A34]/12 hover:bg-white/80 hover:shadow-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403A34]/25 focus-visible:ring-offset-2",
            mobileOpen && "border-[#403A34]/12 bg-white/90 shadow-sm",
          )}
          aria-expanded={mobileOpen}
          aria-controls={panelId}
          aria-label="Открыть поиск"
        >
          <Search className="size-[1.35rem]" strokeWidth={1.5} />
        </button>
      </div>

      {mobileOpen && (
        <div
          id={panelId}
          className="absolute left-0 right-0 top-full z-50 mt-1 border-b border-[#403A34]/10 bg-[#f6f1eb]/98 px-4 py-3 shadow-[0_12px_32px_-16px_rgba(64,58,52,0.35)] backdrop-blur-xl sm:left-auto sm:right-0 sm:w-[min(100vw-2rem,24rem)] lg:hidden"
        >
          <form onSubmit={onSubmit} role="search">
            <label htmlFor={`${panelId}-mobile`} className="sr-only">
              Поиск по каталогу
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-[1.1rem] -translate-y-1/2 text-[#403A34]/40"
                strokeWidth={1.5}
                aria-hidden
              />
              <input
                id={`${panelId}-mobile`}
                name="q"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Название, артикул…"
                autoComplete="off"
                autoFocus
                className={fieldClass}
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
