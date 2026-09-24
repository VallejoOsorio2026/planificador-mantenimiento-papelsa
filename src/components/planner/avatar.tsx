import { cn } from "@/lib/utils";

const TONES = [
  "bg-brand-teal-2-soft text-primary-text",
  "bg-info-soft text-info-text",
  "bg-success-soft text-success-text",
  "bg-warning-soft text-warning-text",
  "bg-surface-muted text-foreground",
  "bg-brand-green/15 text-brand-green",
];

function initials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length > 2 ? 2 : 1]?.[0] ?? "")).toUpperCase();
}

function tone(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return TONES[hash % TONES.length];
}

export function Avatar({ name, size = "md", className }: { name: string; size?: "sm" | "md"; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold select-none",
        size === "sm" ? "size-6 text-[10px]" : "size-8 text-[11px]",
        tone(name),
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
