/**
 * DATOS MOCK — Fase 1.
 * Todo lo que hay en este archivo es ficticio y existe solo para validar la
 * composición visual. No proviene de SAP ni de ninguna fuente real.
 * Los únicos nombres reales son los de los supervisores iniciales.
 */
import type { ChangeLogEntry, Mechanic, ScheduleAssignment, WorkOrder } from "@/types/planner";

export const SUPERVISORS = ["Álvaro Velásquez", "Óscar López", "Jonathan Duarte", "Julián Rugeles"] as const;

const [ALVARO, OSCAR, JONATHAN, JULIAN] = SUPERVISORS;

export const MOCK_MECHANICS: Mechanic[] = [
  { id: "m1", name: "Andrés Carmona", specialty: "Mecánico rotativo", active: true },
  { id: "m2", name: "Luisa Fernanda Ortiz", specialty: "Mecánica general", active: true },
  { id: "m3", name: "Camilo Restrepo", specialty: "Hidráulica", active: true },
  { id: "m4", name: "Diana Marcela Pineda", specialty: "Lubricación", active: true },
  { id: "m5", name: "Esteban Muñoz", specialty: "Soldadura", active: true },
  { id: "m6", name: "Natalia Guerrero", specialty: "Mecánica general", active: true },
  { id: "m7", name: "Felipe Arango", specialty: "Neumática", active: true },
  { id: "m8", name: "Sergio Cárdenas", specialty: "Mecánico rotativo", active: false },
];

export const MOCK_ORDERS: WorkOrder[] = [
  // ——— Programadas ———
  {
    id: "o1",
    number: "OT-10412",
    description: "Cambio de rodamientos lado accionamiento en bomba de pasta B-12",
    priority: "urgente",
    status: "en_ejecucion",
    estimatedHours: 6,
    area: "Preparación de pasta",
    equipment: "Bomba B-12",
    notes: "Vibración elevada reportada por operación. Verificar alineación al terminar.",
    history: [
      { id: "h1", when: "Hace 2 h", author: ALVARO, action: "Cambió el estado a En ejecución" },
      { id: "h2", when: "Ayer", author: ALVARO, action: "Programó en T1 · Lunes" },
      { id: "h3", when: "Hace 3 días", author: "Sistema (mock)", action: "OT creada en backlog" },
    ],
  },
  {
    id: "o2",
    number: "OT-10418",
    description: "Inspección y ajuste de rasquetas del cilindro secador",
    priority: "alta",
    status: "planificada",
    estimatedHours: 4,
    area: "Máquina de papel",
    equipment: "Cilindro secador 3",
    history: [
      { id: "h1", when: "Ayer", author: OSCAR, action: "Programó en T2 · Martes" },
      { id: "h2", when: "Hace 4 días", author: "Sistema (mock)", action: "OT creada en backlog" },
    ],
  },
  {
    id: "o3",
    number: "OT-10421",
    description: "Lubricación general de chumaceras de la sección de prensas",
    priority: "media",
    status: "planificada",
    estimatedHours: 3,
    area: "Máquina de papel",
    equipment: "Sección de prensas",
    history: [{ id: "h1", when: "Hace 2 días", author: JONATHAN, action: "Programó en T1 · Miércoles" }],
  },
  {
    id: "o4",
    number: "OT-10425",
    description:
      "Reparación de fuga en línea hidráulica del cabezal de la bobinadora, incluye reemplazo de mangueras y revisión completa de acoples rápidos",
    priority: "alta",
    status: "planificada",
    estimatedHours: 5,
    area: "Bobinado",
    equipment: "Bobinadora principal",
    notes: "Requiere parada coordinada con producción. Tener kit de mangueras listo antes del turno.",
    history: [
      { id: "h1", when: "Hoy", author: JULIAN, action: "Añadió observaciones" },
      { id: "h2", when: "Ayer", author: JULIAN, action: "Programó en T3 · Jueves" },
    ],
  },
  {
    id: "o5",
    number: "OT-10427",
    description: "Soldadura de refuerzo en soporte de motor del agitador",
    priority: "media",
    status: "planificada",
    estimatedHours: 4,
    area: "Preparación de pasta",
    equipment: "Agitador tanque 2",
    history: [{ id: "h1", when: "Hace 2 días", author: ALVARO, action: "Programó en T2 · Lunes" }],
  },
  {
    id: "o6",
    number: "OT-10430",
    description: "Revisión de válvulas neumáticas de la caja de entrada",
    priority: "baja",
    status: "completada",
    estimatedHours: 2,
    area: "Máquina de papel",
    equipment: "Caja de entrada",
    history: [
      { id: "h1", when: "Hoy", author: OSCAR, action: "Marcó como completada" },
      { id: "h2", when: "Hace 3 días", author: OSCAR, action: "Programó en T1 · Lunes" },
    ],
  },
  {
    id: "o7",
    number: "OT-10433",
    description: "Cambio de filtros del sistema hidráulico de la cortadora",
    priority: "media",
    status: "planificada",
    estimatedHours: 3,
    area: "Conversión",
    equipment: "Cortadora transversal",
    history: [{ id: "h1", when: "Ayer", author: JONATHAN, action: "Programó en T3 · Viernes" }],
  },
  {
    id: "o8",
    number: "OT-10436",
    description: "Alineación láser de motor y reductor del transportador de rollos",
    priority: "alta",
    status: "planificada",
    estimatedHours: 6,
    area: "Bobinado",
    equipment: "Transportador de rollos",
    history: [{ id: "h1", when: "Hace 2 días", author: JULIAN, action: "Programó en T1 · Viernes" }],
  },
  {
    id: "o9",
    number: "OT-10438",
    description: "Engrase de rodillos guía de la sección de secado",
    priority: "baja",
    status: "planificada",
    estimatedHours: 2,
    area: "Máquina de papel",
    equipment: "Rodillos guía",
    history: [{ id: "h1", when: "Hoy", author: OSCAR, action: "Programó en T2 · Sábado" }],
  },
  {
    id: "o10",
    number: "OT-10440",
    description: "Inspección de sellos mecánicos en bomba de agua blanca",
    priority: "urgente",
    status: "planificada",
    estimatedHours: 4,
    area: "Servicios",
    equipment: "Bomba agua blanca 1",
    notes: "Goteo visible en sello lado libre.",
    history: [{ id: "h1", when: "Hace 1 h", author: ALVARO, action: "Programó en T3 · Martes" }],
  },
  // ——— Backlog ———
  {
    id: "o11",
    number: "OT-10442",
    description: "Reemplazo de correas en ventilador de extracción de vapor",
    priority: "alta",
    status: "backlog",
    estimatedHours: 3,
    area: "Máquina de papel",
    equipment: "Ventilador extracción",
    history: [{ id: "h1", when: "Hace 5 h", author: "Sistema (mock)", action: "OT creada en backlog" }],
  },
  {
    id: "o12",
    number: "OT-10445",
    description:
      "Verificación de tensión y estado general de la tela formadora, con registro fotográfico de zonas de desgaste y medición de espesor en tres puntos de referencia",
    priority: "media",
    status: "backlog",
    estimatedHours: 5,
    area: "Máquina de papel",
    equipment: "Mesa de formación",
    history: [{ id: "h1", when: "Ayer", author: "Sistema (mock)", action: "OT creada en backlog" }],
  },
  {
    id: "o13",
    number: "OT-10447",
    description: "Cambio de aceite en reductor del pulper",
    priority: "baja",
    status: "backlog",
    estimatedHours: 2,
    area: "Preparación de pasta",
    equipment: "Pulper",
    history: [{ id: "h1", when: "Ayer", author: "Sistema (mock)", action: "OT creada en backlog" }],
  },
  {
    id: "o14",
    number: "OT-10449",
    description: "Reparación de guarda de seguridad en rebobinadora",
    priority: "urgente",
    status: "backlog",
    estimatedHours: 2,
    area: "Conversión",
    equipment: "Rebobinadora",
    notes: "Condición insegura reportada. Priorizar.",
    history: [{ id: "h1", when: "Hace 30 min", author: "Sistema (mock)", action: "OT creada en backlog" }],
  },
  {
    id: "o15",
    number: "OT-10451",
    description: "Revisión de acoples del sistema de vacío",
    priority: "media",
    status: "backlog",
    estimatedHours: 4,
    area: "Servicios",
    equipment: "Bomba de vacío 2",
    history: [{ id: "h1", when: "Hace 2 días", author: "Sistema (mock)", action: "OT creada en backlog" }],
  },
  {
    id: "o16",
    number: "OT-10453",
    description: "Calibración de cilindros neumáticos de la empacadora",
    priority: "baja",
    status: "backlog",
    estimatedHours: 3,
    area: "Conversión",
    equipment: "Empacadora",
    history: [{ id: "h1", when: "Hace 3 días", author: "Sistema (mock)", action: "OT creada en backlog" }],
  },
];

/** Programación mock, válida solo para la semana actual. */
export const MOCK_ASSIGNMENTS: ScheduleAssignment[] = [
  { id: "a1", orderId: "o1", mechanicId: "m1", day: 0, shift: "T1", durationHours: 6 },
  { id: "a2", orderId: "o6", mechanicId: "m7", day: 0, shift: "T1", durationHours: 2 },
  { id: "a3", orderId: "o5", mechanicId: "m5", day: 0, shift: "T2", durationHours: 4 },
  { id: "a4", orderId: "o2", mechanicId: "m2", day: 1, shift: "T2", durationHours: 4 },
  { id: "a5", orderId: "o10", mechanicId: "m1", day: 1, shift: "T3", durationHours: 4 },
  { id: "a6", orderId: "o3", mechanicId: "m4", day: 2, shift: "T1", durationHours: 3 },
  { id: "a7", orderId: "o4", mechanicId: "m3", day: 3, shift: "T3", durationHours: 5 },
  { id: "a8", orderId: "o8", mechanicId: "m6", day: 4, shift: "T1", durationHours: 6 },
  { id: "a9", orderId: "o7", mechanicId: "m3", day: 4, shift: "T3", durationHours: 3 },
  { id: "a10", orderId: "o9", mechanicId: "m4", day: 5, shift: "T2", durationHours: 2 },
];

export const MOCK_CHANGELOG: ChangeLogEntry[] = [
  { id: "c1", when: "Hace 1 h", author: ALVARO, summary: "Programó OT en T3 · Martes", orderNumber: "OT-10440" },
  { id: "c2", when: "Hace 2 h", author: ALVARO, summary: "Cambió estado a En ejecución", orderNumber: "OT-10412" },
  { id: "c3", when: "Hoy", author: OSCAR, summary: "Marcó como completada", orderNumber: "OT-10430" },
  { id: "c4", when: "Hoy", author: JULIAN, summary: "Añadió observaciones", orderNumber: "OT-10425" },
  { id: "c5", when: "Ayer", author: JONATHAN, summary: "Programó OT en T3 · Viernes", orderNumber: "OT-10433" },
  { id: "c6", when: "Ayer", author: OSCAR, summary: "Programó OT en T2 · Martes", orderNumber: "OT-10418" },
];

export const MOCK_AREAS = Array.from(new Set(MOCK_ORDERS.map((o) => o.area))).sort();
