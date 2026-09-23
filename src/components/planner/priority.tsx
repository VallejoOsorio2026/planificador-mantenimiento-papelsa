import { OctagonAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PRIORITY_META } from "@/lib/planner-config";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types/planner";

/**
 * Cada prioridad se distingue por forma + color + texto, nunca solo por color:
 * urgente = octógono de alerta; alta/media/baja = 3/2/1 barras rellenas.
 */
const LEVEL: Record<Exclude<Priority, "urgente">, { filled: number; color: string }> = {
  alta: { filled: 3, color: "text-warning" },
  media: { filled: 2, color: "text-info" },
  baja: { filled: 1, color: "text-muted-foreground" },
};

function PriorityGlyph({ priority, className }: { priority: Priority; className?: string }) {
  if (priority === "urgente") {
    return <OctagonAlert aria-hidden className={cn("size-3.5 text-danger", className)} strokeWidth={2.25} />;
  }
  const { filled, color } = LEVEL[priority];
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={cn("size-3.5", color, className)} fill="currentColor">
      {[
        { x: 1.5, y: 9, h: 5 },
        { x: 6.25, y: 5.5, h: 8.5 },
        { x: 11, y: 2, h: 12 },
      ].map((bar, i) => (
        <rect key={i} x={bar.x} y={bar.y} width="3.5" height={bar.h} rx="1" opacity={i < filled ? 1 : 0.22} />
      ))}
    </svg>
  );
}

export function PriorityIcon({ priority, className }: { priority: Priority; className?: string }) {
  const label = `Prioridad ${PRIORITY_META[priority].label.toLowerCase()}`;
  return (
    <span title={label} className="inline-flex shrink-0">
      <PriorityGlyph priority={priority} className={className} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const meta = PRIORITY_META[priority];
  return (
    <Badge variant={meta.badge} className={className}>
      <PriorityGlyph priority={priority} className="size-3" />
      {meta.label}
    </Badge>
  );
}
