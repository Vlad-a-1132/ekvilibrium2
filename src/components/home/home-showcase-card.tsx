import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export type HomeShowcaseCardProps = {
  href: string;
  title: string;
  imageUrl: string | null;
  tone?: "default" | "creative";
};

export function HomeShowcaseCard({ href, title, imageUrl, tone = "default" }: HomeShowcaseCardProps) {
  /** Локальные `/public` и загрузки: без `/_next/image`, иначе часть PNG на Windows/Turbopack даёт пустой кадр. */
  const unoptimized = Boolean(imageUrl?.startsWith("/"));

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-[#403A34]/10 bg-white shadow-[0_8px_28px_-16px_rgba(64,58,52,0.22)] transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-[#403A34]/18 hover:shadow-[0_18px_44px_-22px_rgba(64,58,52,0.32)]",
      )}
    >
      <div className="relative aspect-[4/3] w-full bg-white">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            unoptimized={unoptimized}
            className="object-cover object-center"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div
            className={cn(
              "flex h-full items-center justify-center bg-gradient-to-br p-4",
              tone === "creative"
                ? "from-[#fdf6ee] via-[#f8f0e8] to-[#ebe2d8]"
                : "from-[#f6f1eb] to-[#ede6dc]",
            )}
            aria-hidden
          >
            <span className="select-none font-serif text-2xl tracking-tight text-[#403A34]/25">
              {title.slice(0, 1)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col border-t border-[#403A34]/6 px-4 py-3.5">
        <span className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#403A34] transition-colors group-hover:text-[#2f2a25]">
          {title}
        </span>
      </div>
    </Link>
  );
}
