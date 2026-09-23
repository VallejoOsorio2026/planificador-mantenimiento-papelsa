"use client";

import { useState } from "react";
import { ClipboardPaste, Info, TableProperties } from "lucide-react";

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
import { Kbd } from "@/components/ui/kbd";
import { Textarea } from "@/components/ui/textarea";

const EXAMPLE_COLUMNS = ["OT", "Descripción", "Prioridad", "Duración (h)", "Área"];
const EXAMPLE_ROWS = [
  ["OT-00001", "Cambio de rodamientos en bomba de ejemplo", "Alta", "4", "Área A"],
  ["OT-00002", "Inspección de ejemplo en reductor", "Media", "2", "Área B"],
];

const STEPS = [
  { title: "Copia las filas", text: "Incluye la fila de encabezados desde tu hoja de cálculo." },
  { title: "Pega aquí", text: "Haz clic en el área y usa Ctrl + V." },
  { title: "Revisa", text: "Verás una vista previa antes de agregar al backlog." },
];

export function PasteOrdersDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[760px]">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <ClipboardPaste className="size-4" aria-hidden />
            </span>
            <div>
              <DialogTitle>Pegar órdenes</DialogTitle>
              <DialogDescription>Agrega órdenes de trabajo al backlog pegando una tabla.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <PasteBody />
        <DialogFooter className="justify-between">
          <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Info className="size-3.5" aria-hidden />
            Vista previa de interfaz · el procesamiento llega en Fase 2
          </span>
          <div className="flex gap-2">
            <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
            <Button disabled>Procesar órdenes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** El contenido se desmonta al cerrar, así que el texto pegado se descarta. */
function PasteBody() {
  const [text, setText] = useState("");

  return (
    <DialogBody className="flex flex-col gap-5">
      <ol className="grid grid-cols-3 gap-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-2.5 rounded-lg border border-border bg-surface-muted/50 p-3">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-surface text-[11px] font-semibold text-primary ring-1 ring-border">
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] font-medium text-foreground">{step.title}</span>
              <span className="block text-[11px] leading-relaxed text-muted-foreground">{step.text}</span>
            </span>
          </li>
        ))}
      </ol>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="paste-area" className="text-[12px] font-medium text-foreground">
            Datos pegados
          </label>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Kbd>Ctrl</Kbd>+<Kbd>V</Kbd>
          </span>
        </div>
        <div className="relative">
          <Textarea
            id="paste-area"
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            className="h-44 border-dashed border-border-strong bg-surface-muted/40 font-mono text-[12px] focus-visible:border-solid focus-visible:bg-surface"
          />
          {text.length === 0 ? (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
              <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface shadow-card">
                <ClipboardPaste className="size-5 text-muted-foreground" aria-hidden />
              </span>
              <p className="text-[13px] font-medium text-foreground">Pega aquí la tabla de órdenes</p>
              <p className="text-[12px] text-muted-foreground">Columnas separadas por tabulación, una OT por fila</p>
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <p className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-foreground">
          <TableProperties className="size-3.5 text-muted-foreground" aria-hidden />
          Formato esperado
          <span className="rounded bg-surface-muted px-1.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Ejemplo
          </span>
        </p>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full table-fixed text-left text-[12px]">
            <thead className="bg-surface-muted text-[11px] text-muted-foreground">
              <tr>
                {EXAMPLE_COLUMNS.map((c, i) => (
                  <th key={c} className={i === 1 ? "w-[40%] px-3 py-2 font-medium" : "px-3 py-2 font-medium"}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EXAMPLE_ROWS.map((row) => (
                <tr key={row[0]} className="border-t border-border text-muted-foreground">
                  {row.map((cell, i) => (
                    <td key={i} className={i === 0 ? "truncate px-3 py-2 font-mono" : "truncate px-3 py-2"}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DialogBody>
  );
}
