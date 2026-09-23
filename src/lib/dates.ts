const dayFormatter = new Intl.DateTimeFormat("es-CO", { weekday: "short" });
const dayLongFormatter = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" });
const shortFormatter = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" });
const yearFormatter = new Intl.DateTimeFormat("es-CO", { year: "numeric" });

/** Lunes de la semana de `date` (hora local, 00:00). */
export function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - offset);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function clean(text: string): string {
  return text.replace(".", "");
}

export function formatWeekday(date: Date): string {
  const w = clean(dayFormatter.format(date));
  return w.charAt(0).toUpperCase() + w.slice(1);
}

export function formatDayLong(date: Date): string {
  const t = dayLongFormatter.format(date);
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function formatWeekRange(weekStart: Date): string {
  const end = addDays(weekStart, 6);
  return `${clean(shortFormatter.format(weekStart))} – ${clean(shortFormatter.format(end))} ${yearFormatter.format(end)}`;
}

/** Número de semana ISO‑8601. */
export function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
