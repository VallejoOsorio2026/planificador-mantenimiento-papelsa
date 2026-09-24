"use client";

import Image from "next/image";
import { CalendarDays, ChevronLeft, ChevronRight, ClipboardPaste, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatWeekRange, isoWeekNumber } from "@/lib/dates";
import type { DemoState, PlannerFilters } from "@/types/planner";

import { ChangesPopover } from "./changes-popover";
import { DemoStatePopover } from "./demo-state-popover";
import { FiltersPopover } from "./filters-popover";

export function PlannerToolbar({
  weekStart,
  isCurrentWeek,
  onPrevWeek,
  onNextWeek,
  onToday,
  filters,
  onFiltersChange,
  demoState,
  onDemoStateChange,
  onOpenPaste,
  onOpenMechanics,
  onReplayWelcome,
}: {
  weekStart: Date | null;
  isCurrentWeek: boolean;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  filters: PlannerFilters;
  onFiltersChange: (filters: PlannerFilters) => void;
  demoState: DemoState;
  onDemoStateChange: (value: DemoState) => void;
  onOpenPaste: () => void;
  onOpenMechanics: () => void;
  onReplayWelcome: () => void;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b-2 border-brand-green bg-background px-3 whitespace-nowrap">
      {/* Identidad PAPELSA: logotipo negativo oficial (vector extraído del manual, p.17) */}
      <div className="flex shrink-0 items-center gap-2.5">
        <Image
          src="/brand/papelsa-logo-negative.svg"
          alt="PAPELSA"
          width={170}
          height={33}
          loading="eager"
          unoptimized
          className="mx-1 h-auto w-[106px] shrink-0 select-none"
          draggable={false}
        />
        <div className="h-7 w-px shrink-0 bg-border max-[1365px]:hidden" aria-hidden />
        {/* Por debajo de 1366 px el logo identifica la app y se libera ancho para la toolbar */}
        <div className="leading-tight max-[1365px]:sr-only">
          <h1 className="font-brand text-[13px] font-semibold text-foreground">Planificador semanal</h1>
          <p className="truncate text-[11px] text-muted-foreground">Mantenimiento mecánico</p>
        </div>
        <DemoStatePopover value={demoState} onChange={onDemoStateChange} onReplayWelcome={onReplayWelcome} />
      </div>

      <div className="mx-1 h-6 w-px bg-border" aria-hidden />

      {/* Navegación semanal */}
      <nav aria-label="Navegación de semanas" className="flex items-center gap-1.5">
        <Button variant="outline" size="icon" aria-label="Semana anterior" onClick={onPrevWeek}>
          <ChevronLeft />
        </Button>
        <div className="flex h-8 min-w-[208px] items-center justify-center gap-2 rounded-md px-2 text-[13px]" aria-live="polite">
          <CalendarDays className="size-4 text-muted-foreground" aria-hidden />
          {weekStart ? (
            <>
              <span className="font-semibold text-foreground tabular-nums">{formatWeekRange(weekStart)}</span>
              <span className="rounded bg-surface-muted px-1.5 py-px text-[11px] font-medium text-muted-foreground tabular-nums">
                S{isoWeekNumber(weekStart)}
              </span>
            </>
          ) : (
            <span className="h-4 w-36 animate-pulse rounded bg-surface-muted" />
          )}
        </div>
        <Button variant="outline" size="icon" aria-label="Semana siguiente" onClick={onNextWeek}>
          <ChevronRight />
        </Button>
        <Button variant="outline" onClick={onToday} disabled={isCurrentWeek} className="ml-1">
          Hoy
        </Button>
      </nav>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <FiltersPopover filters={filters} onChange={onFiltersChange} />
        <ChangesPopover />
      </div>

      <div className="h-6 w-px bg-border" aria-hidden />

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onOpenMechanics}>
          <Users />
          Mecánicos
        </Button>
        <Button onClick={onOpenPaste}>
          <ClipboardPaste />
          Pegar órdenes
        </Button>
      </div>
    </header>
  );
}
