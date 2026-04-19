import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Единая сетка витрины: max 1400px, по центру, горизонтальные отступы. Для layout и шапки/подвала. */
export const storeCanvasClassName =
  "mx-auto box-border w-full min-w-0 max-w-[1400px] px-4 sm:px-6 lg:px-8";

export type SiteContainerProps = HTMLAttributes<HTMLDivElement>;

export function SiteContainer({ className, ...props }: SiteContainerProps) {
  return <div className={cn(storeCanvasClassName, className)} {...props} />;
}

/** Полоса на всю ширину viewport (фон/бордер), внутри — контент через `SiteContainer`. */
export function StoreFullBleed({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2",
        className,
      )}
    >
      {children}
    </div>
  );
}
