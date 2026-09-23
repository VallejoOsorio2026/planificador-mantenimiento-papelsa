# Cierre — Fase 1: Fundación + UI Core

**Fecha:** 2026-09-23  
**Estado:** CERRADO  
**Proyecto:** Planificador Semanal de Mantenimiento  
**Repositorio:** VallejoOsorio2026/planificador-mantenimiento-papelsa

## 1. Objetivo

Construir una interfaz desktop que permita validar visualmente la experiencia del planificador semanal de mantenimiento (estructura, jerarquía, densidad, navegación e interacción básica) **antes** de introducir backend, persistencia o reglas operativas reales. Todos los datos operativos de esta fase son mock.

## 2. Alcance

- Planner Shell como página inicial de la aplicación.
- Toolbar semanal: semana anterior/siguiente, rango de fechas con número de semana, botón `Hoy`, `Filtros`, `Cambios` (historial mock), `Mecánicos`, `Pegar órdenes`.
- Backlog de órdenes: búsqueda, filtros de prioridad, tarjetas OT.
- Grilla semanal lunes–domingo por mecánico, con carriles T1/T2/T3 y órdenes programadas mock.
- Inspector lateral de OT.
- Diálogo `Pegar órdenes` (solo visual) y diálogo `Mecánicos` (edición local mock).
- Estados empty y skeleton/loading.
- Sistema de diseño centralizado y documentación funcional de la fase (`docs/planner/FASE-1-UI-CORE.md`).

## 3. Fuera de alcance

No se implementó en Fase 1: Supabase, PostgreSQL, base de datos, migraciones, autenticación, RLS, persistencia, realtime, Copy/Paste funcional, parser TSV, importación Excel, Drag & Drop (dnd-kit no instalado), motor de conflictos, disponibilidad real, horarios definitivos de T1/T2/T3, lógica real de supervisores, lógica real de requerimiento previo/preparación T3, correos, notificaciones, integraciones (SAP, Microsoft Graph, Resend), dashboards KPI, aplicación móvil, multiempresa ni IA.

## 4. Estado inicial

El repositorio comenzó vacío: sin rama `main`, sin commits, sin frontend, sin `package.json` y sin lockfile.

Con autorización del responsable se creó un commit base inicial vacío en `main`:

- SHA base: `9b7b17ef38b5a0846b6caef67875acaccaa3d4af`

La implementación se realizó en la rama `feat/planner-fase1-ui-core`.

## 5. Decisiones adoptadas

**Stack fijado:**

| Pieza | Versión / decisión |
| --- | --- |
| Next.js (App Router, `src/`) | 16.3.6 |
| React / React DOM | 19.2.8 |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4 |
| Primitivas UI | Base UI (`@base-ui/react`) |
| Convención de componentes | compatible con shadcn (`components.json`) |
| Iconos | Lucide |
| Utilidades | clsx, tailwind-merge, class-variance-authority |
| Gestor de paquetes | pnpm (`pnpm-lock.yaml` versionado) |

**Decisiones funcionales representadas:**

- La OT (`WorkOrder`) y su programación (`ScheduleAssignment`: mecánico + día + turno + duración) son conceptos separados.
- Estados de OT modelados: backlog, planificada, en ejecución, completada, cancelada.
- T1/T2/T3 son turnos conceptuales; sus horarios reales **siguen sin definirse** y la UI los rotula «horario por definir».
- La gestión de mecánicos es mock/local: los cambios se descartan al cerrar el diálogo.
- `Pegar órdenes` es exclusivamente visual (sin parser, «Procesar» deshabilitado).
- «Requerimiento previo» es un marcador visual para OT programadas en T3, sin lógica.
- No existen persistencia, backend, Supabase, Drag & Drop funcional, parser TSV/Excel ni notificaciones reales.

**Desviación shadcn / Base UI:**

- El entorno bloqueó `ui.shadcn.com` mediante proxy HTTP 403.
- `shadcn init` no pudo consumir el registro remoto.
- Los componentes de `src/components/ui/` se implementaron manualmente sobre `@base-ui/react`.
- Se mantuvo `components.json` (creado manualmente) con la convención shadcn para conservar compatibilidad futura con `shadcn add`.
- Esta desviación es de herramienta de instalación y **no debe reinterpretarse como fallo funcional de la Fase 1**.

## 6. Implementación realizada

- **Planner Shell** (`planner-shell`): estado de vista y composición.
- **Toolbar semanal**: navegación semana anterior/siguiente, botón `Hoy`, filtros (prioridad y área), popover de cambios mock, accesos a `Mecánicos` y `Pegar órdenes`.
- **Píldora visible «Datos mock»** con selector de **estados demo** (con datos / cargando / sin órdenes) para revisión visual.
- **Backlog**: búsqueda (atajo `/`), chips de prioridad, tarjetas OT con número, prioridad, descripción, área/equipo y duración; estado «Sin resultados».
- **Grilla semanal**: filas por mecánico, columnas lunes–domingo, carriles T1/T2/T3 por fila, cabecera y columna de mecánico fijas, día actual resaltado, fin de semana diferenciado.
- **Órdenes programadas mock** en tarjetas compactas; la prioridad se distingue por forma + color + texto.
- **Inspector lateral**: OT, estado, descripción, prioridad, mecánico, día, turno, duración, área, observaciones, sección «Requerimiento previo» e historial mock; cierre con ✕ o Escape.
- **Diálogo `Pegar órdenes`**: pasos, área amplia de pegado con estado vacío, tabla de ejemplo; sin procesamiento.
- **Diálogo `Mecánicos`**: lista editable localmente (nombre, especialidad, activo, agregar/quitar) y supervisores; «Guardar» deshabilitado.
- **Estados empty** (backlog, grilla, semana sin programación) y **skeleton/loading**.

**Datos mock:**

- 8 mecánicos ficticios iniciales.
- 16 OT ficticias (según auditoría final).
- Cuatro supervisores: Álvaro Velásquez, Óscar López, Jonathan Duarte, Julián Rugeles.
- Sin emails ni teléfonos.
- `WorkOrder` separado de `ScheduleAssignment`.

## 7. Pruebas y evidencia

Validaciones de código ejecutadas **localmente** antes del PR y antes del merge:

```text
pnpm lint
→ OK

pnpm typecheck
→ OK

pnpm build
→ OK

git diff --check
→ OK
```

Validación visual con Chromium/Playwright ya presente en el entorno (no añadido al proyecto):

- revisión 1366×768 → OK;
- revisión 1440×900 → OK;
- consola sin errores en los escenarios finales;
- a 1366 px el scroll horizontal queda contenido en la grilla (sin overflow de página);
- a 1440 px se visualizan los siete días sin inspector;
- HTTP mediante IP de red fue probado.

**CI:**

```text
No había check runs ni statuses reales en GitHub.
Las validaciones de código de Fase 1 se ejecutaron localmente antes del PR y antes del merge.
```

## 8. Hallazgo mayor y corrección pre-PR

**Problema:** `crypto.randomUUID()` en `MechanicsDialog` (acción «Agregar mecánico»).

**Síntoma:**

```text
HTTP mediante IP
→ contexto no seguro
→ crypto.randomUUID no disponible
→ error
→ aplicación cae
```

**Corrección:**

- se sustituyó por un contador local mediante `useRef`;
- ids `nuevo-1`, `nuevo-2`, etc.;
- sin dependencia nueva;
- sin persistencia;
- comportamiento adecuado para datos mock.

**Commit:** `71f3fe3a229c3533234332413f80444998b705e8`  
**Mensaje:** `fix(planner): avoid secure-context dependency for mechanic ids`

**Validación:**

```text
localhost
8 → 9 filas
OK

HTTP por IP
8 → 9 filas
OK

consola
sin errores

aplicación
operativa
```

## 9. Auditoría final pre-PR

Resultado de la revalidación posterior a la corrección:

- BLOQUEANTES: ninguno.
- MAYORES: ninguno (el único MAYOR quedó corregido y revalidado).
- MENORES: 8, conocidos y aceptados (sección 13).
- El commit de corrección modificó únicamente `src/components/planner/mechanics-dialog.tsx`, sin cambios en dependencias.
- Veredicto: `APTO PARA ABRIR PR: SÍ`.

## 10. Git / versionamiento

**Commit base (`main` inicial):** `9b7b17ef38b5a0846b6caef67875acaccaa3d4af`

**Rama de implementación:** `feat/planner-fase1-ui-core` (conservada)

- SHA final: `71f3fe3a229c3533234332413f80444998b705e8`
- Git verificó finalmente 14 commits sobre `main` antes del merge.
- 47 archivos.
- 7360 inserciones reportadas en el PR.

**Pull Request:**

| Campo | Valor |
| --- | --- |
| PR | #1 |
| Título | `feat(planner): implement Phase 1 UI core` |
| Base | `main` |
| Head | `feat/planner-fase1-ui-core` |
| Head SHA | `71f3fe3a229c3533234332413f80444998b705e8` |
| Estado final | MERGED |
| Merge commit | `6a855a2008edfba869d5f6b8569cda1d2c5e530a` |
| Método | merge commit real |
| Rama feature | conservada |

**Padres del merge commit:**

```text
9b7b17ef38b5a0846b6caef67875acaccaa3d4af
71f3fe3a229c3533234332413f80444998b705e8
```

El árbol del merge commit es idéntico al del head aprobado.

**Main final:** `6a855a2008edfba869d5f6b8569cda1d2c5e530a`  
**Working tree final:** limpio

## 11. Resultado observable

Al abrir la aplicación se muestra directamente el planificador semanal: toolbar, backlog con órdenes mock, grilla lunes–domingo con mecánicos y carriles T1/T2/T3, tarjetas programadas seleccionables que abren el inspector lateral, y los diálogos `Pegar órdenes` y `Mecánicos` en modo visual/mock. Los estados vacío y de carga pueden revisarse desde la píldora «Datos mock».

## 12. Riesgos y limitaciones conocidos

- Algunos mensajes de commit tienen formato cosmético imperfecto en el trailer (sin línea en blanco previa); no se reescribió historial.
- El build depende actualmente de Google Fonts para Inter y Geist Mono (`next/font/google`).
- `Hoy` se calcula por carga de página.
- Los componentes shadcn/Base UI son manuales; la desviación está documentada.
- No existe CI configurado en el repositorio al cierre de Fase 1.

## 13. Hallazgos menores pendientes

1. contraste bajo en algunos textos `--subtle-foreground`;
2. `aria-label` incompleto de tarjetas programadas;
3. semántica ARIA de `grid` mejorable;
4. foco no vuelve a la tarjeta al cerrar el inspector;
5. chip `Todas` no limpia el filtro de área;
6. nombres largos de mecánicos pueden truncarse;
7. placeholder del buscador puede aparecer cortado;
8. selector demo con `role="radio"` sin navegación por flechas.

Clasificación: `MENORES — no bloquearon el PR ni el cierre de Fase 1.`

## 14. Pendientes derivados para fases posteriores

- Fase 2 corresponde conceptualmente a: **datos reales + persistencia + Copy/Paste funcional**.
- Las decisiones sobre Supabase, esquema definitivo, autenticación, parser, reglas de duplicados y formato real de la tabla de pegado **no se toman en este cierre**; se resolverán en la planificación específica de Fase 2.
- Los hallazgos menores de la sección 13 permanecen abiertos, sin asignación a fase.
- Los horarios reales de T1/T2/T3 siguen sin definir.

## 15. Criterio de cierre

```text
BLOQUE CERRADO
=
RESULTADO VERIFICADO
+
EVIDENCIA
+
VERSIONAMIENTO
+
.md DE CIERRE
```

- Resultado verificado: auditoría final sin BLOQUEANTES ni MAYORES.
- Evidencia: validaciones locales (lint, typecheck, build, `git diff --check`), revisión visual en ambos tamaños y prueba por HTTP mediante IP.
- Versionamiento: PR #1 mergeado mediante merge commit `6a855a2008edfba869d5f6b8569cda1d2c5e530a`.
- `.md` de cierre: este documento.

## 16. Regla de continuidad

- Fase 2 deberá comenzar desde:

```text
main
6a855a2008edfba869d5f6b8569cda1d2c5e530a
```

- No reinterpretar como pendientes de Fase 1 las funcionalidades listadas en «Fuera de alcance».
- No reinterpretar la desviación shadcn/Base UI como defecto.
- No considerar verificada ninguna ejecución de CI: no existía CI al cierre.
- Las decisiones de la sección 5 quedan fijadas y no deben rediseñarse sin decisión explícita del responsable.
