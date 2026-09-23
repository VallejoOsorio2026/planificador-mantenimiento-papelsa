/**
 * Tipos del dominio del planificador (Fase 1 — solo UI).
 * La orden de trabajo (OT) y su programación son conceptos distintos:
 * una OT existe en backlog aunque no tenga programación asociada.
 */

export type Priority = "urgente" | "alta" | "media" | "baja";

export type OrderStatus = "backlog" | "planificada" | "en_ejecucion" | "completada" | "cancelada";

/** Turnos conceptuales. Las horas reales de cada turno aún no están definidas. */
export type ShiftId = "T1" | "T2" | "T3";

/** 0 = lunes … 6 = domingo, relativo a la semana mostrada. */
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface HistoryEntry {
  id: string;
  /** Texto relativo ya formateado (mock). */
  when: string;
  author: string;
  action: string;
}

export interface WorkOrder {
  id: string;
  /** Número de OT ficticio. */
  number: string;
  description: string;
  priority: Priority;
  status: OrderStatus;
  estimatedHours: number;
  area: string;
  equipment: string;
  notes?: string;
  history: HistoryEntry[];
}

export interface Mechanic {
  id: string;
  name: string;
  specialty: string;
  active: boolean;
}

/** Programación de una OT: mecánico + día + turno + duración. */
export interface ScheduleAssignment {
  id: string;
  orderId: string;
  mechanicId: string;
  day: DayIndex;
  shift: ShiftId;
  durationHours: number;
}

export interface ChangeLogEntry {
  id: string;
  when: string;
  author: string;
  summary: string;
  orderNumber?: string;
}

/** Filtros de vista (solo cliente, no persistidos). */
export interface PlannerFilters {
  priorities: Priority[];
  areas: string[];
}

/** Estado de demostración para revisar estados visuales en Fase 1. */
export type DemoState = "datos" | "cargando" | "vacio";
