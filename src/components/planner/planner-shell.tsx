"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

import { addDays, startOfWeek } from "@/lib/dates";
import { MOCK_ASSIGNMENTS, MOCK_MECHANICS, MOCK_ORDERS } from "@/lib/mock-data";
import { PRIORITY_ORDER } from "@/lib/planner-config";
import type { DemoState, PlannerFilters, WorkOrder } from "@/types/planner";

import { BacklogPanel } from "./backlog-panel";
import { BrandHero } from "./brand-hero";
import { MechanicsDialog } from "./mechanics-dialog";
import { OrderInspector } from "./order-inspector";
import { PasteOrdersDialog } from "./paste-orders-dialog";
import { PlannerToolbar } from "./planner-toolbar";
import { WeeklyResourceTimeline } from "./weekly-resource-timeline";

// "Hoy" solo se conoce en el cliente; en el servidor se renderiza el skeleton.
let clientToday: Date | null = null;
const subscribeNoop = () => () => {};
const getClientToday = () => (clientToday ??= new Date());
const getServerToday = () => null;

const ORDERS_BY_ID = new Map(MOCK_ORDERS.map((o) => [o.id, o]));
const SCHEDULED_IDS = new Set(MOCK_ASSIGNMENTS.map((a) => a.orderId));

function matchesFilters(order: WorkOrder, filters: PlannerFilters): boolean {
  return (
    (filters.priorities.length === 0 || filters.priorities.includes(order.priority)) &&
    (filters.areas.length === 0 || filters.areas.includes(order.area))
  );
}

function matchesSearch(order: WorkOrder, query: string): boolean {
  if (!query) return true;
  const q = query.toLocaleLowerCase("es");
  return [order.number, order.description, order.equipment, order.area].some((f) =>
    f.toLocaleLowerCase("es").includes(q),
  );
}

export function PlannerShell() {
  const today = useSyncExternalStore(subscribeNoop, getClientToday, getServerToday);

  const [weekOffset, setWeekOffset] = useState(0);
  const [demoState, setDemoState] = useState<DemoState>("datos");
  const [filters, setFilters] = useState<PlannerFilters>({ priorities: [], areas: [] });
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [mechanicsOpen, setMechanicsOpen] = useState(false);
  // Bienvenida beta: se muestra en cada carga (sin persistencia); `key` permite repetirla.
  const [welcome, setWelcome] = useState({ open: true, key: 0 });

  const loading = today === null || demoState === "cargando";
  const empty = demoState === "vacio";
  const isCurrentWeek = weekOffset === 0;
  const weekStart = today ? addDays(startOfWeek(today), weekOffset * 7) : null;

  const backlogAll = useMemo(
    () =>
      empty
        ? []
        : MOCK_ORDERS.filter((o) => !SCHEDULED_IDS.has(o.id)).sort(
            (a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority),
          ),
    [empty],
  );
  const backlog = useMemo(
    () => backlogAll.filter((o) => matchesFilters(o, filters) && matchesSearch(o, search.trim())),
    [backlogAll, filters, search],
  );

  // La programación mock solo existe para la semana actual.
  const assignments = empty || !isCurrentWeek ? [] : MOCK_ASSIGNMENTS;

  const isDimmed = useCallback((order: WorkOrder) => !matchesFilters(order, filters), [filters]);

  const selectedOrder = !empty && selectedOrderId ? (ORDERS_BY_ID.get(selectedOrderId) ?? null) : null;
  const selectedAssignment = selectedOrder
    ? (assignments.find((a) => a.orderId === selectedOrder.id) ?? null)
    : null;
  const selectedMechanic = selectedAssignment
    ? (MOCK_MECHANICS.find((m) => m.id === selectedAssignment.mechanicId) ?? null)
    : null;

  function changeWeek(offset: number) {
    setWeekOffset(offset);
    setSelectedOrderId(null);
  }

  const closeInspector = useCallback(() => setSelectedOrderId(null), []);
  const closeWelcome = useCallback(() => setWelcome((w) => ({ ...w, open: false })), []);
  const toggleSelect = useCallback(
    (id: string) => setSelectedOrderId((current) => (current === id ? null : id)),
    [],
  );

  return (
    <>
      <div className="flex h-dvh min-w-0 flex-col" inert={welcome.open}>
        <PlannerToolbar
          weekStart={weekStart}
          isCurrentWeek={isCurrentWeek}
          onPrevWeek={() => changeWeek(weekOffset - 1)}
          onNextWeek={() => changeWeek(weekOffset + 1)}
          onToday={() => changeWeek(0)}
          filters={filters}
          onFiltersChange={setFilters}
          demoState={demoState}
          onDemoStateChange={setDemoState}
          onOpenPaste={() => setPasteOpen(true)}
          onOpenMechanics={() => setMechanicsOpen(true)}
          onReplayWelcome={() => setWelcome((w) => ({ open: true, key: w.key + 1 }))}
        />

        <div className="flex min-h-0 flex-1">
          <BacklogPanel
            orders={backlog}
            totalCount={backlogAll.length}
            loading={loading}
            search={search}
            onSearchChange={setSearch}
            filters={filters}
            onFiltersChange={setFilters}
            selectedOrderId={selectedOrderId}
            onSelectOrder={toggleSelect}
            onOpenPaste={() => setPasteOpen(true)}
          />

          <WeeklyResourceTimeline
            weekStart={weekStart}
            today={today}
            mechanics={MOCK_MECHANICS}
            assignments={assignments}
            ordersById={ORDERS_BY_ID}
            loading={loading}
            empty={empty}
            isCurrentWeek={isCurrentWeek}
            selectedOrderId={selectedOrderId}
            isDimmed={isDimmed}
            onSelectOrder={toggleSelect}
            onOpenPaste={() => setPasteOpen(true)}
          />

          {selectedOrder && !loading ? (
            <OrderInspector
              order={selectedOrder}
              assignment={selectedAssignment}
              mechanic={selectedMechanic}
              weekStart={weekStart}
              onClose={closeInspector}
            />
          ) : null}
        </div>

        <PasteOrdersDialog open={pasteOpen} onOpenChange={setPasteOpen} />
        <MechanicsDialog open={mechanicsOpen} onOpenChange={setMechanicsOpen} />
      </div>

      {welcome.open ? <BrandHero key={welcome.key} onClose={closeWelcome} /> : null}
    </>
  );
}
