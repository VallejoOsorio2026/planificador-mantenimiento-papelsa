"use client";

import { useEffect } from "react";
import { CalendarDays, Clock, Link2, MapPin, MessageSquareText, Settings2, User, X, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addDays, formatDayLong } from "@/lib/dates";
import { SHIFTS } from "@/lib/planner-config";
import type { Mechanic, ScheduleAssignment, WorkOrder } from "@/types/planner";

import { Avatar } from "./avatar";
import { PriorityBadge } from "./priority";
import { StatusBadge } from "./status";

export function OrderInspector({
  order,
  assignment,
  mechanic,
  weekStart,
  onClose,
}: {
  order: WorkOrder;
  assignment: ScheduleAssignment | null;
  mechanic: Mechanic | null;
  weekStart: Date | null;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const shift = assignment ? SHIFTS.find((s) => s.id === assignment.shift) : null;
  const dayLabel = assignment && weekStart ? formatDayLong(addDays(weekStart, assignment.day)) : null;
  const isT3 = assignment?.shift === "T3";

  return (
    <aside
      key={order.id}
      aria-label={`Detalle de ${order.number}`}
      className="flex w-[360px] shrink-0 animate-panel-in flex-col border-l border-border bg-surface"
    >
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
        <span className="font-mono text-[12px] font-medium text-muted-foreground">{order.number}</span>
        <StatusBadge status={order.status} />
        <Button variant="ghost" size="icon-sm" className="ml-auto" aria-label="Cerrar inspector" onClick={onClose}>
          <X />
        </Button>
      </div>

      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
        <div className="px-5 pt-4 pb-5">
          <h2 className="text-[16px] leading-snug font-semibold tracking-[-0.01em] break-words text-foreground">
            {order.description}
          </h2>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {order.area} · {order.equipment}
          </p>

          <dl className="mt-5 flex flex-col gap-0.5">
            <Property icon={Settings2} label="Prioridad">
              <PriorityBadge priority={order.priority} />
            </Property>
            <Property icon={User} label="Mecánico">
              {mechanic ? (
                <span className="flex min-w-0 items-center gap-2">
                  <Avatar name={mechanic.name} size="sm" />
                  <span className="truncate">{mechanic.name}</span>
                </span>
              ) : (
                <Muted>Sin asignar</Muted>
              )}
            </Property>
            <Property icon={CalendarDays} label="Día">
              {dayLabel ?? <Muted>Sin programar</Muted>}
            </Property>
            <Property icon={Clock} label="Turno">
              {shift ? (
                <span className="flex items-center gap-2">
                  <span className="rounded border border-border bg-surface-muted px-1.5 font-mono text-[11px] font-semibold">
                    {shift.id}
                  </span>
                  <span className="text-[12px] text-muted-foreground">Horario por definir</span>
                </span>
              ) : (
                <Muted>—</Muted>
              )}
            </Property>
            <Property icon={Clock} label="Duración">
              <span className="tabular-nums">
                {assignment ? assignment.durationHours : order.estimatedHours} h
                {!assignment ? <span className="ml-1 text-[12px] text-muted-foreground">estimadas</span> : null}
              </span>
            </Property>
            <Property icon={MapPin} label="Área">
              <span className="truncate">{order.area}</span>
            </Property>
          </dl>
        </div>

        <Section title="Observaciones" icon={MessageSquareText}>
          {order.notes ? (
            <p className="rounded-lg border border-border bg-surface-muted/60 px-3 py-2.5 text-[13px] leading-relaxed break-words text-foreground">
              {order.notes}
            </p>
          ) : (
            <p className="text-[12px] text-muted-foreground">Sin observaciones.</p>
          )}
        </Section>

        <Section title="Requerimiento previo" icon={Link2}>
          {isT3 ? (
            <div className="rounded-lg border border-dashed border-border-strong px-3 py-3">
              <p className="text-[12px] font-medium text-foreground">Sin requerimiento previo asociado</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                Las OT de T3 podrán asociar una preparación previa (materiales, permisos, bloqueos).
              </p>
              <Button variant="outline" size="sm" className="mt-2.5" disabled>
                <Link2 />
                Asociar requerimiento · fase posterior
              </Button>
            </div>
          ) : (
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              Aplica únicamente a OT programadas en T3.
            </p>
          )}
        </Section>

        <Section title="Historial">
          <ol className="relative flex flex-col gap-3 before:absolute before:top-1.5 before:bottom-1.5 before:left-[11px] before:w-px before:bg-border">
            {order.history.map((h) => (
              <li key={h.id} className="relative flex gap-3">
                <span className="relative z-[1] mt-1 flex size-[23px] shrink-0 items-center justify-center">
                  <span className="size-2 rounded-full border-2 border-surface bg-border-strong ring-1 ring-border" />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] leading-snug text-foreground">
                    <span className="font-medium">{h.author}</span>{" "}
                    <span className="text-muted-foreground">{h.action.toLowerCase()}</span>
                  </p>
                  <p className="text-[11px] text-subtle-foreground">{h.when}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[11px] text-subtle-foreground">Historial de demostración.</p>
        </Section>
      </div>

      <div className="flex h-11 shrink-0 items-center border-t border-border bg-surface-muted/50 px-5 text-[11px] text-muted-foreground">
        Vista de solo lectura · la edición llegará en fases posteriores
      </div>
    </aside>
  );
}

function Property({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-8 grid-cols-[112px_1fr] items-center gap-2">
      <dt className="flex items-center gap-2 text-[12px] text-muted-foreground">
        <Icon className="size-3.5 text-subtle-foreground" aria-hidden />
        {label}
      </dt>
      <dd className="flex min-w-0 items-center text-[13px] text-foreground">{children}</dd>
    </div>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}

function Section({ title, icon: Icon, children }: { title: string; icon?: LucideIcon; children: React.ReactNode }) {
  return (
    <section className="border-t border-border px-5 py-4">
      <h3 className="label-tech mb-2.5 flex items-center gap-1.5">
        {Icon ? <Icon className="size-3.5 text-muted-foreground" aria-hidden /> : null}
        {title}
      </h3>
      {children}
    </section>
  );
}
