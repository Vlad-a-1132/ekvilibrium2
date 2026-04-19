"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type GalleryImage = {
  id: string;
  path: string;
  alt: string | null;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [];
  const main = list[active] ?? null;

  if (list.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#403A34]/10 bg-gradient-to-br from-[#fbf8f4] to-[#ede6dc] shadow-[0_20px_50px_-24px_rgba(64,58,52,0.35)]">
          <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
            <span className="font-serif text-lg text-[#403A34]/55">Нет фото</span>
            <span className="max-w-xs text-sm text-[#403A34]/45">
              Изображение появится после загрузки в админке.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        key={main?.id}
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-[#403A34]/10 bg-[#fbf8f4] p-4 shadow-[0_24px_60px_-28px_rgba(64,58,52,0.4)] md:p-6"
      >
        {main && (
          <Image
            src={main.path}
            alt={main.alt ?? productName}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}
      </motion.div>

      {list.length > 1 && (
        <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5">
          {list.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border bg-[#fbf8f4] p-1 transition-all",
                  i === active
                    ? "border-[#403A34] ring-2 ring-[#403A34]/25"
                    : "border-[#403A34]/10 opacity-90 hover:opacity-100",
                )}
                aria-label={`Фото ${i + 1}`}
                aria-current={i === active}
              >
                <Image
                  src={img.path}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
