import { CircleCheck, CircleDashed, CircleDot, CircleX, CirclePlay, type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { STATUS_META } from "@/lib/planner-config";
import type { OrderStatus } from "@/types/planner";

export const STATUS_ICON: Record<OrderStatus, LucideIcon> = {
  backlog: CircleDashed,
  planificada: CircleDot,
  en_ejecucion: CirclePlay,
  completada: CircleCheck,
  cancelada: CircleX,
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const Icon = STATUS_ICON[status];
  const meta = STATUS_META[status];
  return (
    <Badge variant={meta.badge}>
      <Icon aria-hidden />
      {meta.label}
    </Badge>
  );
}
