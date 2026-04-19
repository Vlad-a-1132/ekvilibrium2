import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-md border border-[#403A34]/20 bg-white px-3 py-2 text-sm text-[#403A34] shadow-sm",
        "placeholder:text-[#403A34]/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403A34]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1eb]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
