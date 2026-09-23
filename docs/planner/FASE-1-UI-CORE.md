# Fase 1 — Fundación + UI Core

## Objetivo

Validar visualmente el planificador semanal de mantenimiento (estructura, jerarquía, densidad, navegación e interacción básica) con datos mock, **sin backend, persistencia ni reglas operativas reales**.

## Stack utilizado

| Pieza | Versión |
| --- | --- |
| Next.js (App Router, `src/`) | 16.3.6 |
| React / React DOM | 19.2.8 |
| TypeScript | 5.9 |
| Tailwind CSS | 4.3 |
| shadcn/ui (convención, estilo `base-nova`) sobre Base UI (`@base-ui/react`) | 1.8.0 |
| Iconos | lucide-react |
| Utilidades | clsx, tailwind-merge, class-variance-authority |
| Gestor de paquetes | pnpm 10 (`pnpm-lock.yaml`) |

No se instalaron `motion`, `sonner`, `dnd-kit`, Supabase ni herramientas de pruebas: las transiciones son CSS puro.

## Estructura visual

```
Toolbar: identidad · «Datos mock» · ‹ semana › · Hoy · Filtros · Cambios · Mecánicos · Pegar órdenes
├─ Backlog (296 px): búsqueda («/»), chips de prioridad, tarjetas OT, totales
├─ Grilla semanal (scroll controlado en X/Y):
│    filas = mecánicos · columnas = lunes–domingo · 3 carriles por fila = T1/T2/T3
│    cabecera y columna de mecánico sticky; hoy resaltado; fin de semana rayado
└─ Inspector lateral (360 px) al seleccionar una OT (Esc o ✕ para cerrar)
```

## Componentes

- `src/components/ui/`: `button`, `badge`, `input`, `textarea`, `dialog`, `popover`, `switch`, `skeleton`, `kbd` (convención shadcn sobre primitivas de Base UI).
- `src/components/planner/`:
  - `planner-shell` — estado de la vista y composición.
  - `planner-toolbar`, `filters-popover`, `changes-popover`, `demo-state-popover`.
  - `backlog-panel`, `work-order-card` (tarjeta de backlog y tarjeta compacta de la grilla).
  - `weekly-resource-timeline`, `mechanic-row`, `timeline-layout`.
  - `order-inspector`, `paste-orders-dialog`, `mechanics-dialog`.
  - `priority`, `status`, `avatar`, `empty-state`.
- `src/types/planner.ts` — dominio: `WorkOrder` y `ScheduleAssignment` separados (OT ≠ programación); estados `backlog | planificada | en_ejecucion | completada | cancelada`; turnos `T1 | T2 | T3`.
- `src/lib/`: `mock-data.ts`, `planner-config.ts` (turnos, prioridades, estados), `dates.ts`, `utils.ts`.

## Decisiones de diseño

- Tokens centralizados en `src/app/globals.css` (paleta de referencia, radios 6–16 px, sombras suaves, duraciones 140 ms hover / 200 ms paneles, `prefers-reduced-motion`).
- Tipografía Inter + Geist Mono (números de OT).
- Prioridad codificada por **forma + color + texto**: urgente = octógono de alerta; alta/media/baja = 3/2/1 barras.
- Filtros de vista **atenúan** las OT de la grilla que no coinciden (mantienen contexto) y **ocultan** las del backlog.
- «Hoy» se calcula solo en el cliente (`useSyncExternalStore`); el HTML estático muestra el skeleton.
- Columnas 168 + 32 + 7×134 px: la semana completa cabe en 1440 px sin inspector; en 1366 px o con inspector abierto la grilla usa scroll horizontal propio.

## Qué es mock

- 8 mecánicos, 16 OT (6 en backlog, 10 programadas), historial y cambios: **todo ficticio**. Solo son reales los nombres de los 4 supervisores; no hay correos ni teléfonos.
- La programación mock existe solo para la semana actual; otras semanas muestran «Semana sin programación».
- La píldora **«Datos mock»** permite alternar entre *Con datos*, *Cargando* (skeleton) y *Sin órdenes* (empty state).
- `Pegar órdenes`: textarea sin parser; «Procesar órdenes» deshabilitado.
- `Mecánicos`: edición local descartable al cerrar; «Guardar cambios» deshabilitado.
- Horarios de T1/T2/T3 marcados como «por definir». «Requerimiento previo» es un marcador visual para OT en T3.

## Fuera de alcance

Supabase/PostgreSQL, migraciones, autenticación, persistencia, parser TSV/Excel, drag & drop, motor de conflictos, disponibilidad, realtime, notificaciones/email, lógica de supervisores y de preparación T3, KPIs, SAP e integraciones.

## Validación ejecutada

```
pnpm lint       → sin errores ni avisos
pnpm typecheck  → OK (next typegen && tsc --noEmit)
pnpm build      → OK, ruta / estática
```

Revisión visual con el Chromium/Playwright ya presente en el entorno (no añadido al proyecto) a 1366×768 y 1440×900: vista principal, inspector, ambos diálogos, filtros, cambios, skeleton, empty state y semana siguiente. Sin overflow horizontal de página (`scrollWidth` = ancho de viewport) y sin errores ni avisos de consola.

## Riesgos y diferencias respecto al plan

- **`shadcn init` no pudo ejecutarse**: la política de red del entorno bloquea `ui.shadcn.com`. Los componentes `ui/` se escribieron a mano siguiendo la convención shadcn sobre Base UI y `components.json` se creó manualmente (estilo `base-nova`), de modo que `shadcn add` debería funcionar en un entorno con acceso.
- El repositorio estaba vacío: se creó `main` con un commit inicial vacío como línea base.
- El script `typecheck` ejecuta `next typegen` antes de `tsc`, porque Next 16 genera los tipos globales `LayoutProps`/`PageProps`.
- `AGENTS.md`/`CLAUDE.md` provienen de `create-next-app` 16 (el propio `next dev` los regenera).
