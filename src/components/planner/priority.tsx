import { OctagonAlert, SignalHigh, SignalLow, SignalMedium, type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PRIORITY_META } from "@/lib/planner-config";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types/planner";

/** Cada prioridad usa forma + color + texto: nunca solo color. */
const PRIORITY_ICON: Record<Priority, { icon: LucideIcon; color: string }> = {
  urgente: { icon: OctagonAlert, color: "text-danger" },
  alta: { icon: SignalHigh, color: "text-warning" },
  media: { icon: SignalMedium, color: "text-info" },
  baja: { icon: SignalLow, color: "text-muted-foreground" },
};

export function PriorityIcon({ priority, className }: { priority: Priority; className?: string }) {
  const { icon: Icon, color } = PRIORITY_ICON[priority];
  const label = `Prioridad ${PRIORITY_META[priority].label.toLowerCase()}`;
  return (
    <span title={label} className="inline-flex shrink-0">
      <Icon aria-hidden className={cn("size-3.5", color, className)} strokeWidth={2.25} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const { icon: Icon } = PRIORITY_ICON[priority];
  const meta = PRIORITY_META[priority];
  return (
    <Badge variant={meta.badge} className={className}>
      <Icon aria-hidden strokeWidth={2.25} />
      {meta.label}
    </Badge>
  );
}
