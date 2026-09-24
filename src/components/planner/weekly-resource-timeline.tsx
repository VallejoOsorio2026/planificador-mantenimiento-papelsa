"use client";

import { CalendarX2, ClipboardPaste, Clock, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { addDays, formatWeekday, isSameDay } from "@/lib/dates";
import { DAY_INDEXES } from "@/lib/planner-config";
import { cn } from "@/lib/utils";
import type { Mechanic, ScheduleAssignment, WorkOrder } from "@/types/planner";

import { EmptyState } from "./empty-state";
import { MechanicRow } from "./mechanic-row";
import { GRID_MIN_WIDTH, GRID_TEMPLATE, MECHANIC_COL } from "./timeline-layout";

export function WeeklyResourceTimeline({
  weekStart,
  today,
  mechanics,
  assignments,
  ordersById,
  loading,
  empty,
  isCurrentWeek,
  selectedOrderId,
  isDimmed,
  onSelectOrder,
  onOpenPaste,
}: {
  weekStart: Date | null;
  today: Date | null;
  mechanics: Mechanic[];
  assignments: ScheduleAssignment[];
  ordersById: Map<string, WorkOrder>;
  loading: boolean;
  empty: boolean;
  isCurrentWeek: boolean;
  selectedOrderId: string | null;
  isDimmed: (order: WorkOrder) => boolean;
  onSelectOrder: (id: string) => void;
  onOpenPaste: () => void;
}) {
  const days = weekStart ? DAY_INDEXES.map((d) => addDays(weekStart, d)) : [];
  const todayIndex = today ? days.findIndex((d) => isSameDay(d, today)) : -1;
  const totalHours = assignments.reduce((s, a) => s + a.durationHours, 0);

  return (
    <section aria-label="Planificador semanal" className="flex min-w-0 flex-1 flex-col">
      {/* Resumen de semana */}
      <div className="flex h-11 shrink-0 items-center gap-3 overflow-hidden border-b border-border bg-background px-4 text-[12px] whitespace-nowrap">
        {loading ? (
          <Skeleton className="h-3.5 w-56" />
        ) : (
          <>
            <span className="font-medium text-foreground tabular-nums">{assignments.length} OT programadas</span>
            <span className="text-subtle-foreground" aria-hidden>
              ·
            </span>
            <span className="text-muted-foreground tabular-nums">{totalHours} h</span>
            <span className="text-subtle-foreground" aria-hidden>
              ·
            </span>
            <span className="text-muted-foreground tabular-nums">
              {mechanics.filter((m) => m.active).length} mecánicos activos
            </span>
          </>
        )}
        <span
          className="ml-auto flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground"
          title="T1 · T2 · T3 son turnos conceptuales — horarios por definir"
        >
          <Info className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">T1 · T2 · T3 son turnos conceptuales — horarios por definir</span>
        </span>
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="scroll-thin absolute inset-0 overflow-auto">
          <div role="grid" aria-busy={loading} style={{ minWidth: GRID_MIN_WIDTH }} className="bg-background">
            {/* Cabecera de días */}
            <div
              role="row"
              className="sticky top-0 z-20 grid border-b border-border bg-surface"
              style={{ gridTemplateColumns: GRID_TEMPLATE }}
            >
              <div
                role="columnheader"
                className="label-tech sticky left-0 z-10 flex items-center border-r border-border bg-surface px-3"
              >
                Mecánico
              </div>
              <div
                role="columnheader"
                className="sticky z-10 flex items-center justify-center border-r border-border bg-surface text-[10px] font-medium tracking-wide text-subtle-foreground uppercase"
                style={{ left: MECHANIC_COL }}
                title="Turno"
              >
                <Clock className="size-3.5" aria-hidden />
                <span className="sr-only">Turno</span>
              </div>
              {DAY_INDEXES.map((d) => {
                const date = days[d];
                const isToday = todayIndex === d;
                const count = assignments.filter((a) => a.day === d).length;
                return (
                  <div
                    key={d}
                    role="columnheader"
                    className={cn(
                      "flex h-12 min-w-0 items-center gap-2 border-r border-border px-3 last:border-r-0",
                      d >= 5 && "bg-weekend",
                      isToday && "bg-primary-soft/50",
                    )}
                  >
                    {date ? (
                      <>
                        <span
                          className={cn(
                            "flex size-7 items-center justify-center rounded-md text-[13px] font-semibold tabular-nums",
                            isToday ? "bg-primary text-white ring-1 ring-accent-live/70" : "text-foreground",
                          )}
                        >
                          {date.getDate()}
                        </span>
                        <span className="flex min-w-0 flex-col leading-tight">
                          <span className={cn("text-[12px] font-medium", isToday ? "text-primary-text" : "text-foreground")}>
                            {formatWeekday(date)}
                            {isToday ? <span className="ml-1 text-[11px] font-normal">· Hoy</span> : null}
                          </span>
                          <span className="text-[11px] text-subtle-foreground tabular-nums">
                            {loading ? "—" : `${count} OT`}
                          </span>
                        </span>
                      </>
                    ) : (
                      <Skeleton className="h-4 w-20" />
                    )}
                  </div>
                );
              })}
            </div>

            {loading
              ? Array.from({ length: 6 }, (_, i) => <SkeletonRow key={i} />)
              : mechanics.map((m) => (
                  <MechanicRow
                    key={m.id}
                    mechanic={m}
                    assignments={assignments.filter((a) => a.mechanicId === m.id)}
                    ordersById={ordersById}
                    todayIndex={todayIndex >= 0 ? todayIndex : null}
                    selectedOrderId={selectedOrderId}
                    isDimmed={isDimmed}
                    onSelectOrder={onSelectOrder}
                  />
                ))}
          </div>
        </div>

        {!loading && (empty || !isCurrentWeek) && assignments.length === 0 ? (
          <div className="pointer-events-none absolute inset-0 top-12 flex items-center justify-center p-6">
            <div className="pointer-events-auto animate-fade-in rounded-2xl border border-border bg-surface">
              {empty ? (
                <EmptyState
                  icon={ClipboardPaste}
                  title="Aún no hay órdenes para planificar"
                  description="Cuando existan órdenes en el backlog podrás programarlas por mecánico, día y turno."
                  action={
                    <Button size="sm" onClick={onOpenPaste}>
                      <ClipboardPaste />
                      Pegar órdenes
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  icon={CalendarX2}
                  title="Semana sin programación"
                  description="Los datos mock solo cubren la semana actual. Usa «Hoy» para volver."
                />
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SkeletonRow() {
  return (
    <div
      className="grid border-b border-border"
      style={{ gridTemplateColumns: GRID_TEMPLATE, gridTemplateRows: "repeat(3, 48px)" }}
      aria-hidden
    >
      <div className="sticky left-0 z-10 row-span-3 flex items-center gap-2.5 border-r border-border bg-surface px-3">
        <Skeleton className="size-8 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-1.5 h-2.5 w-20" />
        </div>
      </div>
      <div className="sticky z-10 row-span-3 border-r border-border bg-surface" style={{ left: MECHANIC_COL }} />
      {DAY_INDEXES.map((d) => (
        <div key={d} className="row-span-3 flex flex-col gap-2 border-r border-border p-2 last:border-r-0">
          {(d + 1) % 3 === 0 ? <Skeleton className="h-9 w-full rounded-lg" /> : null}
          {d === 1 ? <Skeleton className="mt-auto h-9 w-4/5 rounded-lg" /> : null}
        </div>
      ))}
    </div>
  );
}
