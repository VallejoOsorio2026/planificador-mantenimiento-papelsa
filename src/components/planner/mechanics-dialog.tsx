"use client";

import { useState } from "react";
import { Info, Plus, Trash2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MOCK_MECHANICS, SUPERVISORS } from "@/lib/mock-data";
import type { Mechanic } from "@/types/planner";

import { Avatar } from "./avatar";

export function MechanicsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[720px]">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Users className="size-4" aria-hidden />
            </span>
            <div>
              <DialogTitle>Mecánicos</DialogTitle>
              <DialogDescription>Personal disponible para la planificación semanal.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <MechanicsEditor />
        <DialogFooter className="justify-between">
          <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Info className="size-3.5" aria-hidden />
            Datos mock · los cambios no se guardan en Fase 1
          </span>
          <div className="flex gap-2">
            <DialogClose render={<Button variant="outline" />}>Cerrar</DialogClose>
            <Button disabled>Guardar cambios</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Estado local descartable: se reinicia cada vez que se abre el diálogo. */
function MechanicsEditor() {
  const [rows, setRows] = useState<Mechanic[]>(MOCK_MECHANICS);

  function update(id: string, patch: Partial<Mechanic>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  return (
    <DialogBody className="flex flex-col gap-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[12px] font-medium text-foreground">
            Equipo <span className="text-muted-foreground tabular-nums">· {rows.filter((r) => r.active).length} activos</span>
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setRows((prev) => [
                ...prev,
                { id: crypto.randomUUID(), name: "", specialty: "", active: true },
              ])
            }
          >
            <Plus />
            Agregar mecánico
          </Button>
        </div>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-[1fr_180px_72px_36px] items-center gap-3 bg-surface-muted px-3 py-2 text-[11px] font-medium text-muted-foreground">
            <span>Nombre</span>
            <span>Especialidad</span>
            <span>Activo</span>
            <span className="sr-only">Acciones</span>
          </div>
          <ul>
            {rows.map((m) => (
              <li
                key={m.id}
                className="grid grid-cols-[1fr_180px_72px_36px] items-center gap-3 border-t border-border px-3 py-2 transition-colors duration-[var(--duration-hover)] hover:bg-surface-hover"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Avatar name={m.name || "?"} size="sm" />
                  <Input
                    value={m.name}
                    placeholder="Nombre del mecánico"
                    aria-label="Nombre"
                    onChange={(e) => update(m.id, { name: e.target.value })}
                    className="h-7"
                  />
                </span>
                <Input
                  value={m.specialty}
                  placeholder="Especialidad"
                  aria-label={`Especialidad de ${m.name || "nuevo mecánico"}`}
                  onChange={(e) => update(m.id, { specialty: e.target.value })}
                  className="h-7"
                />
                <Switch
                  checked={m.active}
                  onCheckedChange={(checked) => update(m.id, { active: checked })}
                  aria-label={`${m.name || "Nuevo mecánico"} activo`}
                />
                <Button
                  variant="destructive"
                  size="icon-sm"
                  aria-label={`Quitar ${m.name || "nuevo mecánico"}`}
                  onClick={() => setRows((prev) => prev.filter((r) => r.id !== m.id))}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[12px] font-medium text-foreground">Supervisores</p>
        <ul className="flex flex-wrap gap-2">
          {SUPERVISORS.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pr-3 pl-1 text-[12px] text-foreground"
            >
              <Avatar name={name} size="sm" />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </DialogBody>
  );
}
