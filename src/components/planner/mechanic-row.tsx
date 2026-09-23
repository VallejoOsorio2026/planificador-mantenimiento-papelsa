"use client";

import { DAY_INDEXES, SHIFTS } from "@/lib/planner-config";
import { cn } from "@/lib/utils";
import type { Mechanic, ScheduleAssignment, WorkOrder } from "@/types/planner";

import { Avatar } from "./avatar";
import { GRID_TEMPLATE, MECHANIC_COL } from "./timeline-layout";
import { WorkOrderCard } from "./work-order-card";

export function MechanicRow({
  mechanic,
  assignments,
  ordersById,
  todayIndex,
  selectedOrderId,
  isDimmed,
  onSelectOrder,
}: {
  mechanic: Mechanic;
  assignments: ScheduleAssignment[];
  ordersById: Map<string, WorkOrder>;
  todayIndex: number | null;
  selectedOrderId: string | null;
  isDimmed: (order: WorkOrder) => boolean;
  onSelectOrder: (id: string) => void;
}) {
  const hours = assignments.reduce((s, a) => s + a.durationHours, 0);

  return (
    <div
      role="row"
      aria-label={mechanic.name}
      className={cn("group/row grid border-b border-border", !mechanic.active && "bg-weekend")}
      style={{ gridTemplateColumns: GRID_TEMPLATE, gridTemplateRows: "repeat(3, minmax(48px, auto))" }}
    >
      {/* Mecánico */}
      <div
        role="rowheader"
        className="sticky left-0 z-10 row-span-3 flex flex-col justify-center gap-2 border-r border-border bg-surface px-3 py-3 transition-colors duration-[var(--duration-hover)] group-hover/row:bg-surface-hover"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar name={mechanic.name} className={cn(!mechanic.active && "grayscale")} />
          <div className="min-w-0">
            <p
              title={mechanic.name}
              className={cn("truncate text-[13px] font-medium text-foreground", !mechanic.active && "text-muted-foreground")}
            >
              {mechanic.name}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">{mechanic.specialty}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 pl-[42px] text-[11px] whitespace-nowrap text-muted-foreground tabular-nums">
          {mechanic.active ? (
            <>
              <span>{assignments.length} OT</span>
              <span aria-hidden>·</span>
              <span title="Horas programadas en la semana">{hours} h</span>
            </>
          ) : (
            <span className="rounded border border-border bg-surface-muted px-1.5 font-medium">Inactivo</span>
          )}
        </div>
      </div>

      {SHIFTS.map((shift, laneIdx) => (
        <ShiftLane
          key={shift.id}
          laneIdx={laneIdx}
          label={shift.id}
          title={shift.label}
          mechanic={mechanic}
          assignments={assignments.filter((a) => a.shift === shift.id)}
          ordersById={ordersById}
          todayIndex={todayIndex}
          selectedOrderId={selectedOrderId}
          isDimmed={isDimmed}
          onSelectOrder={onSelectOrder}
        />
      ))}
    </div>
  );
}

function ShiftLane({
  laneIdx,
  label,
  title,
  mechanic,
  assignments,
  ordersById,
  todayIndex,
  selectedOrderId,
  isDimmed,
  onSelectOrder,
}: {
  laneIdx: number;
  label: string;
  title: string;
  mechanic: Mechanic;
  assignments: ScheduleAssignment[];
  ordersById: Map<string, WorkOrder>;
  todayIndex: number | null;
  selectedOrderId: string | null;
  isDimmed: (order: WorkOrder) => boolean;
  onSelectOrder: (id: string) => void;
}) {
  const lastLane = laneIdx === SHIFTS.length - 1;
  const laneBorder = !lastLane && "border-b border-dashed border-border";
  return (
    <>
      <div
        className={cn(
          "sticky z-10 flex items-center justify-center border-r border-border bg-surface text-[10px] font-semibold tracking-wide text-subtle-foreground transition-colors duration-[var(--duration-hover)] group-hover/row:bg-surface-hover",
          laneBorder,
        )}
        style={{ left: MECHANIC_COL, gridColumn: 2, gridRow: laneIdx + 1 }}
        title={`${title} · horario por definir`}
      >
        {label}
      </div>
      {DAY_INDEXES.map((day) => {
        const items = assignments.filter((a) => a.day === day);
        const weekend = day >= 5;
        return (
          <div
            key={day}
            role="gridcell"
            aria-label={`${mechanic.name}, ${title}, día ${day + 1}: ${items.length} OT`}
            className={cn(
              "flex min-w-0 flex-col gap-1 border-r border-border p-1 transition-colors duration-[var(--duration-hover)] hover:bg-primary-soft/40",
              day === 6 && "border-r-0",
              laneBorder,
              weekend && "bg-weekend",
              todayIndex === day && "bg-primary-soft/30",
            )}
            style={{ gridColumn: day + 3, gridRow: laneIdx + 1 }}
          >
            {items.map((a) => {
              const order = ordersById.get(a.orderId);
              if (!order) return null;
              return (
                <WorkOrderCard
                  key={a.id}
                  order={order}
                  assignment={a}
                  selected={selectedOrderId === order.id}
                  dimmed={isDimmed(order)}
                  onSelect={() => onSelectOrder(order.id)}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}
