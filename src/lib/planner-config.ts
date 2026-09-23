import type { DayIndex, OrderStatus, Priority, ShiftId } from "@/types/planner";

export const SHIFTS: { id: ShiftId; label: string }[] = [
  // Solo etiquetas conceptuales: las horas reales de T1/T2/T3 no se definen en Fase 1.
  { id: "T1", label: "Turno 1" },
  { id: "T2", label: "Turno 2" },
  { id: "T3", label: "Turno 3" },
];

export const DAY_INDEXES: DayIndex[] = [0, 1, 2, 3, 4, 5, 6];

export const PRIORITY_ORDER: Priority[] = ["urgente", "alta", "media", "baja"];

export const PRIORITY_META: Record<
  Priority,
  { label: string; badge: "danger" | "warning" | "info" | "neutral"; accent: string }
> = {
  urgente: { label: "Urgente", badge: "danger", accent: "bg-danger" },
  alta: { label: "Alta", badge: "warning", accent: "bg-warning" },
  media: { label: "Media", badge: "info", accent: "bg-info" },
  baja: { label: "Baja", badge: "neutral", accent: "bg-subtle-foreground" },
};

export const STATUS_META: Record<
  OrderStatus,
  { label: string; badge: "neutral" | "primary" | "info" | "success" | "danger" }
> = {
  backlog: { label: "Backlog", badge: "neutral" },
  planificada: { label: "Planificada", badge: "primary" },
  en_ejecucion: { label: "En ejecución", badge: "info" },
  completada: { label: "Completada", badge: "success" },
  cancelada: { label: "Cancelada", badge: "danger" },
};
