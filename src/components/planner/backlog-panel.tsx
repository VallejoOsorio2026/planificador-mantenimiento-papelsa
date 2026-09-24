"use client";

import { useEffect, useRef } from "react";
import { ClipboardPaste, Inbox, Search, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Skeleton } from "@/components/ui/skeleton";
import { PRIORITY_META, PRIORITY_ORDER } from "@/lib/planner-config";
import { cn } from "@/lib/utils";
import type { PlannerFilters, WorkOrder } from "@/types/planner";

import { EmptyState } from "./empty-state";
import { PriorityIcon } from "./priority";
import { BacklogOrderCard } from "./work-order-card";

export function BacklogPanel({
  orders,
  totalCount,
  loading,
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  selectedOrderId,
  onSelectOrder,
  onOpenPaste,
}: {
  orders: WorkOrder[];
  totalCount: number;
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  filters: PlannerFilters;
  onFiltersChange: (filters: PlannerFilters) => void;
  selectedOrderId: string | null;
  onSelectOrder: (id: string) => void;
  onOpenPaste: () => void;
}) {
  const searchRef = useRef<HTMLInputElement>(null);

  // Atajo "/" para enfocar la búsqueda.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (e.key !== "/" || target?.closest("input, textarea, [contenteditable]")) return;
      e.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hours = orders.reduce((sum, o) => sum + o.estimatedHours, 0);
  const hasQuery = search.trim().length > 0 || filters.priorities.length > 0 || filters.areas.length > 0;

  return (
    <aside aria-label="Backlog de órdenes" className="flex w-[296px] shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex flex-col gap-3 border-b border-border px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-brand text-[14px] font-semibold text-foreground">Backlog</h2>
          <span className="rounded-full bg-surface-muted px-1.5 text-[11px] font-medium text-muted-foreground tabular-nums">
            {loading ? "–" : totalCount}
          </span>
          <span className="label-tech ml-auto">Sin programar</span>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-subtle-foreground" aria-hidden />
          <Input
            ref={searchRef}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar OT, equipo o descripción"
            aria-label="Buscar en backlog"
            className="pr-8 pl-8"
            disabled={loading}
          />
          <Kbd className="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2">/</Kbd>
        </div>
        <div role="group" aria-label="Filtrar por prioridad" className="flex flex-wrap gap-1">
          <button
            type="button"
            aria-pressed={filters.priorities.length === 0}
            onClick={() => onFiltersChange({ ...filters, priorities: [] })}
            className={chipClass(filters.priorities.length === 0)}
          >
            Todas
          </button>
          {PRIORITY_ORDER.map((p) => {
            const active = filters.priorities.includes(p);
            return (
              <button
                key={p}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    priorities: active ? filters.priorities.filter((x) => x !== p) : [...filters.priorities, p],
                  })
                }
                className={chipClass(active)}
              >
                <PriorityIcon priority={p} className="size-3" />
                {PRIORITY_META[p].label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto bg-surface-recessed px-3 py-3">
        {loading ? (
          <div className="flex flex-col gap-2" aria-busy="true" aria-label="Cargando backlog">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface p-3">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-14" />
                </div>
                <Skeleton className="mt-2.5 h-3.5 w-full" />
                <Skeleton className="mt-1.5 h-3.5 w-3/4" />
                <Skeleton className="mt-3 h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : totalCount === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No hay órdenes en backlog"
            description="Pega órdenes copiadas desde tu hoja de cálculo para empezar a planificar la semana."
            action={
              <Button variant="outline" size="sm" onClick={onOpenPaste}>
                <ClipboardPaste />
                Pegar órdenes
              </Button>
            }
          />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Sin resultados"
            description="Ninguna orden coincide con la búsqueda o los filtros activos."
            action={
              hasQuery ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onSearchChange("");
                    onFiltersChange({ priorities: [], areas: [] });
                  }}
                >
                  Limpiar filtros
                </Button>
              ) : null
            }
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {orders.map((order) => (
              <li key={order.id} className="animate-fade-in">
                <BacklogOrderCard
                  order={order}
                  selected={selectedOrderId === order.id}
                  onSelect={() => onSelectOrder(order.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex h-10 shrink-0 items-center justify-between border-t border-border px-4 text-[11px] text-muted-foreground">
        {loading ? (
          <Skeleton className="h-3 w-32" />
        ) : (
          <>
            <span className="tabular-nums">
              {orders.length} de {totalCount} órdenes
            </span>
            <span className="tabular-nums">{hours} h estimadas</span>
          </>
        )}
      </div>
    </aside>
  );
}

function chipClass(active: boolean) {
  return cn(
    "inline-flex h-6 items-center gap-1 rounded-md border px-2 text-[11px] font-medium outline-none transition-colors duration-[var(--duration-hover)] focus-visible:ring-[3px] focus-visible:ring-ring/45",
    active
      ? "border-primary/30 bg-primary-soft text-primary-text"
      : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
  );
}
