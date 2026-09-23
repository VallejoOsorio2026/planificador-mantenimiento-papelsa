"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "relative inline-flex h-[18px] w-8 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-border-strong p-px transition-colors duration-[var(--duration-hover)] outline-none focus-visible:ring-[3px] focus-visible:ring-primary/25 data-checked:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-3.5 rounded-full bg-white shadow-xs transition-transform duration-[var(--duration-hover)] ease-out data-checked:translate-x-3.5" />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
