# Cierre — Fase 2A: Identidad PAPELSA + AUROS × PAPELSA + LIGHT/DARK

**Fecha:** 2026-09-24\
**Estado:** CERRADA\
**Proyecto:** Planificador Semanal de Mantenimiento\
**Repositorio:** VallejoOsorio2026/planificador-mantenimiento-papelsa

## 1. Identificación

| Campo | Valor |
| --- | --- |
| Fase | 2A — Identidad PAPELSA + AUROS × PAPELSA + LIGHT/DARK |
| Fecha de cierre | 2026-09-24 |
| Punto de partida | `main` @ `7a8e995d09530147b42e42eaddc42170476882e2` (cierre de Fase 1) |
| Estado | CERRADA |

## 2. Objetivo

Consolidar la identidad visual del Planificador de Mantenimiento PAPELSA sobre la UI construida en
Fase 1, sin alterar su estructura funcional ni sus datos mock.

## 3. Alcance implementado

- **Branding PAPELSA:** paleta del Manual de Marca (p.14) centralizada en tokens `--brand-*`; el resto
  de colores se deriva con `color-mix`.
- **Activos oficiales:**
  - `public/brand/papelsa-logo.png`: recorte del JPG oficial solo en el blanco exterior, con área de
    seguridad 2X y píxeles idénticos al original. Se conserva como fallback de la primera propuesta.
  - `src/lib/papelsa-symbol.ts`: símbolo con los trazados de la p.7 del Manual. El negativo de la
    p.17 comparte la geometría (diferencia máxima normalizada 5e-5).
  - `public/brand/papelsa-logo-negative.svg` y `public/brand/papelsa-logo-color.svg`: trazados de la
    p.17.
  - Todos los vectores se copiaron literalmente del flujo de contenido del PDF, sin redibujar ni
    recolorear.
- **Auros como referencia visual:** atmósfera, superficies, radios, labels técnicos y motion. La
  referencia se leyó desde la rama `assets/refero-auros-source`, que no forma parte de `main`.
- **Sistema visual oscuro (predeterminado):** pila de superficies recessed / canvas / raised derivada
  del turquesa PAPELSA mezclado con negro, sin sombras ni efecto vidrio. Radios de 6 px en controles,
  8 px en tarjetas OT y 16 px en paneles y diálogos. #A9C23F como acento vivo.
- **Sistema visual claro:** los mismos roles de superficie con blancos y grises corporativos, texto
  #333333, foco turquesa y el verde como acento no textual.
- **Selector DARK/LIGHT:** estado React único en `PlannerShell` que escribe `<html data-theme>`.
  Iconos Sol/Luna en la toolbar y en la bienvenida, con `aria-label` y `title`.
- **Hero:** bienvenida superpuesta sobre el planificador ya cargado. Se cierra con el CTA «Entrar al
  planificador», Enter o Esc. «Datos mock» permite repetirla durante la beta.
- **Molinillo:**
  - Ensamblaje con partículas en Canvas 2D muestreadas dentro de los trazados oficiales, que se
    resuelve en las piezas exactas.
  - Giro orgánico continuo con ráfagas de viento ocasionales.
  - Versión oficial por tema: negativa en oscuro, principal a color en claro.
  - Al cerrar la bienvenida se cancelan el `requestAnimationFrame` y todo el motion.
- **Copy beta:** «¿Cómo quiere dirigir a sus súbditos el SEGUNDO sujeto más lindo de Papelsa?»,
  centralizado en `src/lib/brand-copy.ts`. `SEGUNDO` va en #A9C23F en oscuro. En claro va en un verde
  oscurecido (4,64:1) con subrayado en el #A9C23F exacto.
- **Accesibilidad:** contraste medido del texto operacional (sección 5), foco visible en ambos temas
  y selector de tema navegable con teclado.
- **Reduced motion:** con `prefers-reduced-motion: reduce` no hay partículas ni giro; el símbolo queda
  estático en 0° y el copy y el CTA aparecen de inmediato.
- **Responsive objetivo:** 1280 px, 1366×768 y 1440×900. Por debajo de 1366 px el título del header
  se oculta visualmente para que la toolbar no se desborde.
- **Registro de pendientes:** `docs/planner/PENDIENTES.md`.

## 4. Decisiones de diseño

- Auros es **inspiración, no copia**. No se usan su nombre, branding, planeta, colores rosa/lavanda,
  gradientes, tipografía Matter, textos ni assets.
- PAPELSA es la identidad y el Manual de Marca manda sobre logo, símbolo, colores y proporciones.
- Tipografía: Comfortaa para identidad, hero y títulos; Inter para información operacional; Geist Mono
  para OT y datos técnicos.
- **Futura pendiente:** no se usa hasta disponer de una fuente oficial licenciada.
- El molinillo tiene movimiento orgánico continuo. Se probó un reposo exacto en 0° y se descartó tras
  la revisión visual.
- Los timings de motion son diseño propio y están centralizados en `src/lib/windmill-motion.ts`. El
  video de referencia de Auros (H.264) no se pudo decodificar en el entorno, así que no son timings
  verificados de Auros.
- DARK es el tema predeterminado. No hay persistencia del tema: al recargar vuelve a DARK.
- Sobre fondos oscuros se usa la versión negativa oficial del símbolo y del wordmark (Manual p.17).

## 5. Evidencia técnica

| Validación | Resultado |
| --- | --- |
| `pnpm lint` | OK (código de salida 0) |
| `pnpm typecheck` | OK (código de salida 0) |
| `pnpm build` | OK (código de salida 0, 0 warnings) |
| `git diff --check` | OK |
| Dependencias nuevas | ninguna (`package.json` y `pnpm-lock.yaml` sin cambios) |

**Validación visual (Playwright + Chromium del entorno):**

- Iteraciones de revisión: 1280, 1366×768 y 1440×900, en DARK y LIGHT. Escenarios: hero, planificador,
  inspector, Pegar órdenes, Mecánicos, filtros, skeleton y estado vacío. Consola sin errores ni
  warnings y sin overflow.
- Smoke final tras restaurar el motion orgánico, a 1366×768 y 1440×900: hero DARK, hero LIGHT, cambio
  DARK ↔ LIGHT, entrada al planificador, inspector y diálogo Mecánicos. Consola limpia y sin overflow.
- Motion medido tras la restauración:
  - velocidad nula durante el ensamblaje;
  - ráfaga principal con pico de unos 714 °/s y desaceleración natural;
  - giro residual de unos 6–7 °/s y ráfagas vivas posteriores;
  - un solo loop de `requestAnimationFrame` (unos 60 por segundo);
  - 0 frames tras cerrar la bienvenida, sin canvas residual;
  - cambiar de tema durante la animación no remonta el hero.
- Contraste del texto operacional (T1/T2/T3, OT, descripción, duración, especialidad, mecánico, día,
  labels, input y placeholder): mínimo 7,88:1 en DARK y 5,17:1 en LIGHT.

No existe CI en el repositorio. La validación oficial es la de esta sección.

## 6. Git / versionamiento

**Rama de implementación:** `feat/planner-fase2a-auros-preview` (conservada).

La primera propuesta clara, `feat/planner-fase2a-brand-preview` @ `52248d3`, también se conserva.
Sus dos commits forman parte de la historia mergeada.

**Commits de la fase:**

```text
f9303fd feat(brand): add Papelsa brand assets and tokens
52248d3 feat(planner): apply Papelsa identity to planner UI
7921080 feat(brand): add official Papelsa symbol paths and negative wordmark
99220ff feat(planner): apply Auros-inspired dark visual system
0b42bd5 feat(brand): add Papelsa windmill welcome hero
96a3907 fix(brand): settle Papelsa windmill in official orientation
dfd8aa5 feat(planner): add light and dark theme switcher
333157c docs(planner): track future user manual
e6e074a fix(brand): restore organic Papelsa windmill motion
```

`e6e074a` revierte de forma selectiva el comportamiento angular de `96a3907`, restaurado literalmente
desde `0b42bd5`. Conserva el trabajo de tema posterior.

**Pull Request de implementación:**

| Campo | Valor |
| --- | --- |
| PR | #3 |
| Título | `feat(planner): Fase 2A — identidad PAPELSA y sistema visual Auros` |
| Base | `main` (`7a8e995d09530147b42e42eaddc42170476882e2`) |
| Head | `feat/planner-fase2a-auros-preview` |
| Head SHA | `e6e074ae0782a3c210759f0323fbbbf71f10c45d` |
| Tamaño | 9 commits, 33 archivos, +1076 / −153 |
| Checks | no hay CI configurado |
| Estado final | MERGED |
| Merge commit | `0f84d96dacbcf92ad1ed90af36934bd2a4c1de69` |
| Método | merge commit real |
| Rama feature | conservada |

**Padres del merge commit:**

```text
7a8e995d09530147b42e42eaddc42170476882e2
e6e074ae0782a3c210759f0323fbbbf71f10c45d
```

El árbol del merge commit es idéntico al del head aprobado. Las ramas `assets/brand-source` y
`assets/refero-auros-source` no se mergearon: el PR no contiene PDF, JPG, MP4 ni archivos de la
referencia Auros.

**Main tras la implementación:** `0f84d96dacbcf92ad1ed90af36934bd2a4c1de69`

## 7. Fuera de alcance

No se implementó en Fase 2A: persistencia (incluida la del tema), Copy/Paste real, Supabase, base de
datos, Drag & Drop, autenticación, notificaciones, correos, backend/API, datos reales ni el Manual de
Uso completo.

## 8. Pendientes conocidos

- **Manual de Uso:** registrado en `docs/planner/PENDIENTES.md` como `NO GENERAR AÚN`.
- **Persistencia del tema:** no implementada; al recargar vuelve a DARK.
- **Copy humorístico:** es temporal de la beta y se reemplaza editando `src/lib/brand-copy.ts`.
- **Futura:** se aplicará solo cuando exista un asset oficial licenciado.
- **Build:** depende de Google Fonts (Inter, Geist Mono y ahora también Comfortaa).
- **Selector de tema con un diálogo abierto:** los diálogos son modales y bloquean la toolbar; para
  cambiar de tema hay que cerrarlos primero.
- **Hallazgos menores heredados de Fase 1 (sección 13 de su cierre):**
  1. Contraste de `--subtle-foreground`: mejorado a nivel de tokens y medido en los elementos
     revisados (≥ 5,17:1). No se hizo una auditoría exhaustiva de todos sus usos.
  2. `aria-label` incompleto de tarjetas programadas: sigue abierto.
  3. Semántica ARIA de `grid` mejorable: sigue abierto.
  4. El foco no vuelve a la tarjeta al cerrar el inspector: sigue abierto.
  5. El chip `Todas` no limpia el filtro de área: sigue abierto.
  6. Los nombres largos de mecánicos pueden truncarse: sigue abierto.
  7. El placeholder del buscador puede aparecer cortado: sigue abierto.
  8. El selector demo con `role="radio"` no navega con flechas: sigue abierto.

## 9. Siguiente fase

`Fase 2B — datos reales + persistencia`

No se ha iniciado.

## 10. Regla de continuidad

- La siguiente fase deberá comenzar desde el `main` resultante del merge de este documento de cierre.
- Las decisiones de la sección 4 quedan fijadas y no deben rediseñarse sin decisión explícita del
  responsable.
- No considerar verificada ninguna ejecución de CI: no existía CI al cierre.
