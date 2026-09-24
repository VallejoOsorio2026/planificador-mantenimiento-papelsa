import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, ...props }: React.ComponentProps<typeof InputPrimitive>) {
  return (
    <InputPrimitive
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-md border border-input bg-surface px-2.5 text-[13px] text-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-[var(--duration-hover)] placeholder:text-subtle-foreground hover:border-border-strong focus-visible:border-accent-live focus-visible:ring-[3px] focus-visible:ring-ring/45 focus-visible:outline-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
