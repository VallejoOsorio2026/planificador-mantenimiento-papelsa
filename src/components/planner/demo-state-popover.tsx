"use client";

import { FlaskConical } from "lucide-react";

import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DemoState } from "@/types/planner";

const OPTIONS: { value: DemoState; label: string; hint: string }[] = [
  { value: "datos", label: "Con datos", hint: "Órdenes y programación mock" },
  { value: "cargando", label: "Cargando", hint: "Skeleton de carga" },
  { value: "vacio", label: "Sin órdenes", hint: "Estado vacío" },
];

/**
 * Indicador explícito de que la vista usa datos de demostración, con un
 * selector para revisar los estados visuales de Fase 1.
 */
export function DemoStatePopover({ value, onChange }: { value: DemoState; onChange: (value: DemoState) => void }) {
  return (
    <Popover>
      <PopoverTrigger className="inline-flex h-6 items-center gap-1.5 rounded-full border border-warning/25 bg-warning-soft px-2.5 text-[11px] font-medium text-[#b54708] outline-none transition-colors duration-[var(--duration-hover)] hover:border-warning/50 focus-visible:ring-[3px] focus-visible:ring-warning/25">
        <FlaskConical className="size-3" aria-hidden />
        Datos mock
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3">
        <PopoverTitle className="text-[13px] font-semibold text-foreground">Vista de demostración</PopoverTitle>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          Fase 1: la información es ficticia y ningún cambio se guarda. Elige un estado para revisar la interfaz.
        </p>
        <div role="radiogroup" aria-label="Estado de la vista" className="mt-3 flex flex-col gap-1">
          {OPTIONS.map((opt) => {
            const selected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(opt.value)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left outline-none transition-colors duration-[var(--duration-hover)] focus-visible:ring-[3px] focus-visible:ring-primary/20",
                  selected ? "border-primary/40 bg-primary-soft" : "border-border hover:bg-surface-muted",
                )}
              >
                <span
                  className={cn(
                    "flex size-3.5 items-center justify-center rounded-full border",
                    selected ? "border-primary" : "border-border-strong",
                  )}
                >
                  {selected ? <span className="size-1.5 rounded-full bg-primary" /> : null}
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-medium text-foreground">{opt.label}</span>
                  <span className="block text-[11px] text-muted-foreground">{opt.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
