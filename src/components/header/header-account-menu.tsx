"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeaderAccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative inline-flex size-10 items-center justify-center rounded-2xl border border-transparent text-[#403A34] transition-all duration-200",
          "hover:border-[#403A34]/12 hover:bg-white/80 hover:shadow-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403A34]/25 focus-visible:ring-offset-2",
          open && "border-[#403A34]/12 bg-white/90 shadow-sm",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Меню аккаунта"
      >
        <UserRound className="size-[1.35rem]" strokeWidth={1.5} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1.5 min-w-[200px] rounded-2xl border border-[#403A34]/12 bg-[#f6f1eb]/98 py-2 shadow-[0_16px_40px_-20px_rgba(64,58,52,0.35)] backdrop-blur-xl"
          role="menu"
        >
          <Link
            href="/account"
            className="block px-4 py-2.5 text-sm font-medium text-[#403A34] hover:bg-white/80"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Профиль
          </Link>
          <Link
            href="/account?tab=orders"
            className="block px-4 py-2.5 text-sm font-medium text-[#403A34] hover:bg-white/80"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Мои заказы
          </Link>
          <div className="my-1 border-t border-[#403A34]/10" />
          <form action={logoutAction} className="px-2 pb-1 pt-0.5">
            <Button type="submit" variant="ghost" className="h-auto w-full justify-start rounded-xl py-2 text-sm text-[#403A34]/85">
              Выйти
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
