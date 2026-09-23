"use client";

import { History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { MOCK_CHANGELOG } from "@/lib/mock-data";

import { Avatar } from "./avatar";

export function ChangesPopover() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="ghost" />}>
        <History />
        Cambios
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <PopoverTitle className="text-[13px] font-semibold text-foreground">Cambios recientes</PopoverTitle>
          <span className="text-[11px] text-subtle-foreground">Historial mock</span>
        </div>
        <ol className="scroll-thin max-h-80 overflow-y-auto py-1.5">
          {MOCK_CHANGELOG.map((entry) => (
            <li key={entry.id} className="flex gap-3 px-4 py-2">
              <Avatar name={entry.author} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] leading-snug text-foreground">
                  <span className="font-medium">{entry.author}</span>{" "}
                  <span className="text-muted-foreground">{entry.summary.toLowerCase()}</span>
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-subtle-foreground">
                  {entry.orderNumber ? <span className="font-mono text-muted-foreground">{entry.orderNumber}</span> : null}
                  <span aria-hidden>·</span>
                  {entry.when}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </PopoverContent>
    </Popover>
  );
}
