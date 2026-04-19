import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-[#403A34]/20 bg-white px-3 py-2 text-sm text-[#403A34] shadow-sm transition-colors",
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
Input.displayName = "Input";

export { Input };
