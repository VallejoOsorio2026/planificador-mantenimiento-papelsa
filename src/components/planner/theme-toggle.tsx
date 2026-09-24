"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ThemeName } from "@/types/planner";

/** Alterna tema claro/oscuro. El estado vive en PlannerShell (sin persistencia). */
export function ThemeToggle({
  theme,
  onToggle,
  className,
}: {
  theme: ThemeName;
  onToggle: () => void;
  className?: string;
}) {
  const label = theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro";
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      aria-label={label}
      title={label}
      data-theme-toggle
      className={cn(className)}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
