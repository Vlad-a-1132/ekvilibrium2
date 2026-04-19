import { cn } from "@/lib/utils";

type PlaceholderPanelProps = {
  children: React.ReactNode;
  className?: string;
};

/** Унифицированная панель-заглушка для пустых секций витрины и админки. */
export function PlaceholderPanel({ children, className }: PlaceholderPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-[#403A34]/20 bg-[#fbf8f4]/80 p-10 text-center text-sm text-[#403A34]/60",
        className,
      )}
    >
      {children}
    </div>
  );
}
