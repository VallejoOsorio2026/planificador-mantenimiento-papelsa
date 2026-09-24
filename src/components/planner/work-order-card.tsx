"use client";

import { useEffect, useRef } from "react";
import { Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PRIORITY_META } from "@/lib/planner-config";
import { cn } from "@/lib/utils";
import type { ScheduleAssignment, WorkOrder } from "@/types/planner";

import { PriorityBadge, PriorityIcon } from "./priority";
import { STATUS_ICON } from "./status";

const cardBase =
  "group relative w-full min-w-0 overflow-hidden rounded-lg border bg-surface text-left outline-none transition-[background-color,border-color,box-shadow,opacity] duration-[var(--duration-hover)] hover:border-border-strong hover:bg-surface-hover focus-visible:ring-[3px] focus-visible:ring-ring/45";

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
  const ref = useRef<HTMLButtonElement>(null);

  // Al abrir el inspector la grilla se estrecha: mantener visible la tarjeta seleccionada.
  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${order.number}: ${order.description}`}
      className={cn(
        cardBase,
        "scroll-mt-14 scroll-ml-[208px] scroll-mr-2 py-1.5 pr-2 pl-2.5 shadow-xs",
        selected ? "border-accent-live bg-surface-hover ring-2 ring-ring/25 hover:border-accent-live" : "border-border",
        dimmed && !selected && "opacity-35 hover:opacity-100",
      )}
    >
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-[3px]", PRIORITY_META[order.priority].accent)} />
      <span className="flex items-center gap-1">
        <PriorityIcon priority={order.priority} className="size-3" />
        <span
          className={cn(
            "min-w-0 truncate font-mono text-[11px] font-medium whitespace-nowrap text-foreground",
            done && "text-muted-foreground line-through",
          )}
        >
          {order.number}
        </span>
        <span
          className="ml-auto shrink-0 text-[11px] text-muted-foreground tabular-nums"
          title={`Duración: ${assignment.durationHours} h`}
        >
          {assignment.durationHours} h
        </span>
      </span>
      <span className="mt-0.5 flex items-center gap-1 text-[12px] leading-4 text-muted-foreground">
        {order.status === "en_ejecucion" || done ? (
          <StatusIcon
            aria-label={order.status === "en_ejecucion" ? "En ejecución" : "Completada"}
            className={cn("size-3 shrink-0", done ? "text-success" : "text-info")}
          />
        ) : null}
        <span className="min-w-0 truncate">{order.description}</span>
      </span>
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
        selected ? "border-accent-live bg-surface-hover ring-2 ring-ring/25 hover:border-accent-live" : "border-border",
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
