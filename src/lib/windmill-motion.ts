import type { ThemeName } from "@/types/planner";

import { PAPELSA_SYMBOL_PIECES, PAPELSA_SYMBOL_VIEWBOX } from "./papelsa-symbol";

/**
 * Parámetros del motion del molinillo PAPELSA (bienvenida beta).
 *
 * DISEÑO PROPIO / INFERIDO: no son timings verificados de Auros (su video de
 * referencia no se pudo decodificar en el entorno). Son la primera propuesta y
 * se ajustan aquí tras la revisión visual. Tiempos en segundos.
 */
export const WINDMILL_MOTION = {
  particles: {
    /** Partículas por cada 200 px de lado del símbolo (se escala por área). */
    countAt200: 900,
    fadeIn: [0, 0.2],
    assemble: [0.2, 1.5],
    /** Retardo máximo de salida entre partículas dentro del ensamblaje. */
    maxDelay: 0.35,
    fadeOut: [1.45, 1.85],
    /** Radio inicial de dispersión, en múltiplos del lado del símbolo. */
    spawnRadius: [0.55, 1.15],
    /** Vueltas extra de la espiral de atracción (sensación de viento). */
    swirlTurns: 0.3,
    /** Tamaño de partícula en px CSS. */
    size: [1, 2],
    /** Reparto de color: color oficial de la pieza (según tema) / verde PAPELSA / turquesa PAPELSA. */
    mix: { piece: 0.55, green: 0.25, teal: 0.2 },
  },
  pieces: {
    /** Las piezas oficiales se resuelven con un movimiento rígido (sin deformar). */
    resolve: [1.3, 1.8],
    offset: 0.12,
    rotate: 14,
  },
  copy: {
    start: 1.6,
    stagger: 0.045,
    duration: 0.6,
    ctaDelay: 0.75,
  },
  /**
   * Ráfagas: cada una recorre exactamente `turns` vueltas completas con un perfil
   * de impulso + fricción y termina con velocidad y aceleración nulas, así que el
   * símbolo siempre reposa en su orientación oficial (0°) sin salto final.
   */
  gust: {
    start: 1.8,
    duration: 1.6,
    turns: 1,
  },
  idle: {
    /** Separación entre inicios de ráfaga, ciclo fijo (sin aleatoriedad). */
    gustEvery: [12, 15, 13, 16],
    duration: 4,
    turns: 1,
  },
  exit: 0.3,
} as const;

type Range = readonly [number, number];

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const progress = (t: number, [a, b]: Range) => clamp01((t - a) / (b - a));
export const easeOutCubic = (p: number) => 1 - (1 - p) ** 3;
export const easeInOutCubic = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

/**
 * Avance normalizado de una ráfaga (0 → 1). Es la integral normalizada de la
 * velocidad v(p) ∝ p·(1−p)³: arranque suave, pico hacia el 25 % (impulso) y
 * fricción larga; en p = 1 velocidad y aceleración valen 0.
 */
export const gustProgress = (p: number) => {
  const x = clamp01(p);
  return x * x * (10 - 20 * x + 15 * x * x - 4 * x * x * x);
};

/**
 * Ángulo del molinillo (grados, 0 ≤ a < 360) en el instante `t` de la bienvenida.
 * Función pura del tiempo: fuera de una ráfaga devuelve exactamente 0.
 */
export function windAngle(t: number): number {
  const { gust, idle } = WINDMILL_MOTION;
  let start: number = gust.start;
  let duration: number = gust.duration;
  let turns: number = gust.turns;
  for (let i = 0; t >= start + duration; i++) {
    start += idle.gustEvery[i % idle.gustEvery.length];
    duration = idle.duration;
    turns = idle.turns;
  }
  if (t <= start) return 0;
  return (360 * turns * gustProgress((t - start) / duration)) % 360;
}

/** PRNG determinista (mulberry32) para que el ensamblaje sea igual en cada visita. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Roles de color de las partículas: 0/1 = color oficial de cada tipo de pieza
 * (negativo en oscuro, principal a color en claro), 2 = verde, 3 = turquesa.
 */
const PRIMARY_PIECE = PAPELSA_SYMBOL_PIECES[0];
const SECONDARY_PIECE = PAPELSA_SYMBOL_PIECES[1];
const GREEN = SECONDARY_PIECE.color;
const TEAL = PRIMARY_PIECE.color;

/** Paleta de partículas por tema, siempre con colores oficiales. */
export function particlePalette(theme: ThemeName): readonly string[] {
  return theme === "light"
    ? [PRIMARY_PIECE.color, SECONDARY_PIECE.color, GREEN, TEAL]
    : [PRIMARY_PIECE.negative, SECONDARY_PIECE.negative, GREEN, TEAL];
}

export type ParticleField = {
  count: number;
  startR: Float32Array;
  startA: Float32Array;
  targetX: Float32Array;
  targetY: Float32Array;
  delay: Float32Array;
  size: Float32Array;
  color: Uint8Array;
};

/**
 * Genera las partículas del ensamblaje. Los destinos se muestrean DENTRO de los
 * trazados oficiales del símbolo (Path2D + isPointInPath), así la nube converge
 * exactamente sobre la geometría de marca. Coordenadas en px CSS relativas al
 * centro del símbolo; `side` es el lado del símbolo en px.
 */
export function createParticleField(side: number): ParticleField {
  const cfg = WINDMILL_MOTION.particles;
  const count = Math.round(cfg.countAt200 * Math.min(1.4, (side / 200) ** 2));
  const vb = PAPELSA_SYMBOL_VIEWBOX;
  const scale = side / vb.width;
  const paths = PAPELSA_SYMBOL_PIECES.map((p) => new Path2D(p.d));
  const ctx = document.createElement("canvas").getContext("2d");

  const field: ParticleField = {
    count,
    startR: new Float32Array(count),
    startA: new Float32Array(count),
    targetX: new Float32Array(count),
    targetY: new Float32Array(count),
    delay: new Float32Array(count),
    size: new Float32Array(count),
    color: new Uint8Array(count),
  };
  const rand = rng(0x9a9e15a);

  for (let i = 0; i < count; i++) {
    // Muestreo por rechazo en el viewBox oficial.
    let x = 0;
    let y = 0;
    let piece = 0;
    for (let tries = 0; tries < 60; tries++) {
      x = vb.x + rand() * vb.width;
      y = vb.y + rand() * vb.height;
      piece = ctx ? paths.findIndex((p) => ctx.isPointInPath(p, x, y)) : 0;
      if (piece >= 0) break;
    }
    if (piece < 0) piece = 0;
    field.targetX[i] = (x - vb.x - vb.width / 2) * scale;
    field.targetY[i] = (y - vb.y - vb.height / 2) * scale;

    field.startR[i] = side * (cfg.spawnRadius[0] + rand() * (cfg.spawnRadius[1] - cfg.spawnRadius[0]));
    field.startA[i] = rand() * Math.PI * 2;
    field.delay[i] = rand() * cfg.maxDelay;
    field.size[i] = cfg.size[0] + rand() * (cfg.size[1] - cfg.size[0]);

    const r = rand();
    const pieceRole = PAPELSA_SYMBOL_PIECES[piece].color === TEAL ? 0 : 1;
    field.color[i] = r < cfg.mix.piece ? pieceRole : r < cfg.mix.piece + cfg.mix.green ? 2 : 3;
  }
  return field;
}

/**
 * Dibuja el campo de partículas en el instante `t`. El contexto ya viene
 * trasladado al centro del símbolo. Sin asignaciones por frame.
 */
export function drawParticles(
  ctx: CanvasRenderingContext2D,
  field: ParticleField,
  t: number,
  palette: readonly string[],
) {
  const cfg = WINDMILL_MOTION.particles;
  const alpha = progress(t, cfg.fadeIn) * (1 - progress(t, cfg.fadeOut));
  if (alpha <= 0) return;
  ctx.globalAlpha = alpha;
  const [a0, a1] = cfg.assemble;
  const swirl = cfg.swirlTurns * Math.PI * 2;

  for (let c = 0; c < palette.length; c++) {
    ctx.fillStyle = palette[c];
    for (let i = 0; i < field.count; i++) {
      if (field.color[i] !== c) continue;
      const d = field.delay[i];
      const e = easeInOutCubic(clamp01((t - a0 - d) / (a1 - a0 - d)));
      const tx = field.targetX[i];
      const ty = field.targetY[i];
      const tr = Math.hypot(tx, ty);
      const ta = Math.atan2(ty, tx);
      // Espiral: el ángulo de salida se acerca al del destino girando con el "viento".
      const startA = field.startA[i] + t * 0.35;
      const da = startA - ta + swirl;
      const r = field.startR[i] + (tr - field.startR[i]) * e;
      const a = ta + da * (1 - e);
      const s = field.size[i];
      ctx.fillRect(Math.cos(a) * r - s / 2, Math.sin(a) * r - s / 2, s, s);
    }
  }
  ctx.globalAlpha = 1;
}
