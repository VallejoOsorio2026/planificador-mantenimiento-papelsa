"use client";

import { Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PRIORITY_META } from "@/lib/planner-config";
import { cn } from "@/lib/utils";
import type { ScheduleAssignment, WorkOrder } from "@/types/planner";

import { PriorityBadge, PriorityIcon } from "./priority";
import { STATUS_ICON } from "./status";

const cardBase =
  "group relative w-full min-w-0 overflow-hidden rounded-lg border bg-surface text-left outline-none transition-[border-color,box-shadow,transform,opacity] duration-[var(--duration-hover)] hover:-translate-y-px hover:border-border-strong hover:shadow-raised focus-visible:ring-[3px] focus-visible:ring-primary/25";

/** Tarjeta compacta de una OT programada dentro de la grilla semanal. */
export function WorkOrderCard({
  order,
  assignment,
  selected,
  dimmed,
  onSelect,
}: {
  order: WorkOrder;
  assignment: ScheduleAssignment;
  selected: boolean;
  dimmed: boolean;
  onSelect: () => void;
}) {
  const StatusIcon = STATUS_ICON[order.status];
  const done = order.status === "completada";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${order.number}: ${order.description}`}
      className={cn(
        cardBase,
        "py-1.5 pr-2 pl-3 shadow-xs",
        selected ? "border-primary shadow-raised ring-[3px] ring-primary/15" : "border-border",
        dimmed && !selected && "opacity-35 hover:opacity-100",
      )}
    >
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-[3px]", PRIORITY_META[order.priority].accent)} />
      <span className="flex items-center gap-1.5">
        <PriorityIcon priority={order.priority} className="size-3" />
        <span className={cn("font-mono text-[11px] font-medium text-foreground", done && "text-muted-foreground line-through")}>
          {order.number}
        </span>
        {order.status === "en_ejecucion" || done ? (
          <StatusIcon
            aria-label={order.status === "en_ejecucion" ? "En ejecución" : "Completada"}
            className={cn("size-3", done ? "text-success" : "text-info")}
          />
        ) : null}
        <span className="ml-auto flex shrink-0 items-center gap-0.5 text-[11px] text-muted-foreground tabular-nums">
          <Clock className="size-3" aria-hidden />
          {assignment.durationHours} h
        </span>
      </span>
      <span className="mt-0.5 block truncate text-[12px] leading-4 text-muted-foreground">{order.description}</span>
    </button>
  );
}

/** Tarjeta de una OT en el backlog (sin programación). */
export function BacklogOrderCard({
  order,
  selected,
  onSelect,
}: {
  order: WorkOrder;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        cardBase,
        "block p-3 shadow-card",
        selected ? "border-primary ring-[3px] ring-primary/15" : "border-border",
      )}
    >
      <span className="flex items-center gap-2">
        <span className="font-mono text-[11px] font-medium text-muted-foreground">{order.number}</span>
        <PriorityBadge priority={order.priority} className="ml-auto" />
      </span>
      <span className="mt-1.5 line-clamp-2 text-[13px] leading-[18px] font-medium break-words text-foreground">
        {order.description}
      </span>
      <span className="mt-2 flex items-center gap-2">
        <span className="min-w-0 truncate text-[11px] text-muted-foreground">
          {order.area} · {order.equipment}
        </span>
        <Badge variant="outline" className="ml-auto tabular-nums">
          <Clock aria-hidden />
          {order.estimatedHours} h
        </Badge>
      </span>
    </button>
  );
}
