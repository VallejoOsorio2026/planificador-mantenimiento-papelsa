"use client";

import { Check, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { MOCK_AREAS } from "@/lib/mock-data";
import { PRIORITY_META, PRIORITY_ORDER } from "@/lib/planner-config";
import { cn } from "@/lib/utils";
import type { PlannerFilters, Priority } from "@/types/planner";

import { PriorityIcon } from "./priority";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function FilterOption({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-[13px] text-foreground outline-none transition-colors duration-[var(--duration-hover)] hover:bg-surface-muted focus-visible:bg-surface-muted"
    >
      <span
        className={cn(
          "flex size-4 items-center justify-center rounded border transition-colors",
          selected ? "border-primary bg-primary text-white" : "border-border-strong bg-surface",
        )}
      >
        {selected ? <Check className="size-3" strokeWidth={3} /> : null}
      </span>
      {children}
    </button>
  );
}

export function FiltersPopover({
  filters,
  onChange,
}: {
  filters: PlannerFilters;
  onChange: (filters: PlannerFilters) => void;
}) {
  const active = filters.priorities.length + filters.areas.length;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" className={cn(active > 0 && "bg-primary-soft text-primary hover:bg-primary-soft")} />
        }
      >
        <SlidersHorizontal />
        Filtros
        {active > 0 ? (
          <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
            {active}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-1.5">
        <div className="flex items-center justify-between px-2 pt-1 pb-1.5">
          <PopoverTitle className="text-[12px] font-semibold text-foreground">Filtros de vista</PopoverTitle>
          <button
            type="button"
            disabled={active === 0}
            onClick={() => onChange({ priorities: [], areas: [] })}
            className="rounded text-[12px] text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/30 disabled:text-subtle-foreground disabled:no-underline"
          >
            Limpiar
          </button>
        </div>
        <p className="px-2 pt-1 pb-1 text-[11px] font-medium tracking-wide text-subtle-foreground uppercase">
          Prioridad
        </p>
        <div role="group" aria-label="Prioridad">
          {PRIORITY_ORDER.map((p: Priority) => (
            <FilterOption
              key={p}
              selected={filters.priorities.includes(p)}
              onClick={() => onChange({ ...filters, priorities: toggle(filters.priorities, p) })}
            >
              <PriorityIcon priority={p} />
              {PRIORITY_META[p].label}
            </FilterOption>
          ))}
        </div>
        <div className="my-1.5 h-px bg-border" />
        <p className="px-2 pt-1 pb-1 text-[11px] font-medium tracking-wide text-subtle-foreground uppercase">
          Área
        </p>
        <div role="group" aria-label="Área">
          {MOCK_AREAS.map((area) => (
            <FilterOption
              key={area}
              selected={filters.areas.includes(area)}
              onClick={() => onChange({ ...filters, areas: toggle(filters.areas, area) })}
            >
              <span className="truncate">{area}</span>
            </FilterOption>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
