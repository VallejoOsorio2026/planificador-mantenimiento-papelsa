import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-w-0 resize-none rounded-lg border border-input bg-surface px-3 py-2.5 text-[13px] text-foreground outline-none transition-[border-color,box-shadow] duration-[var(--duration-hover)] placeholder:text-subtle-foreground hover:border-border-strong focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/15 focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
