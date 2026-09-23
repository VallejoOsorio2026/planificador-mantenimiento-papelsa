import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-px text-[11px] font-medium leading-4 [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        neutral: "border-border bg-surface-muted text-muted-foreground",
        outline: "border-border bg-surface text-muted-foreground",
        primary: "border-primary/15 bg-primary-soft text-primary",
        info: "border-info/15 bg-info-soft text-[#1570cd]",
        success: "border-success/20 bg-success-soft text-[#067647]",
        warning: "border-warning/20 bg-warning-soft text-[#b54708]",
        danger: "border-danger/20 bg-danger-soft text-[#b42318]",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
