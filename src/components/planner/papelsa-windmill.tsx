"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { PAPELSA_SYMBOL_PIECES, PAPELSA_SYMBOL_VIEWBOX } from "@/lib/papelsa-symbol";
import {
  WINDMILL_MOTION,
  createParticleField,
  drawParticles,
  easeOutCubic,
  progress,
  windVelocity,
} from "@/lib/windmill-motion";

const VB = PAPELSA_SYMBOL_VIEWBOX;
const CX = VB.x + VB.width / 2;
const CY = VB.y + VB.height / 2;
/** El lienzo de partículas cubre el radio de dispersión máximo alrededor del símbolo. */
const CANVAS_FACTOR = WINDMILL_MOTION.particles.spawnRadius[1] * 2 + 0.2;

/**
 * Símbolo PAPELSA (versión negativa oficial) que se ensambla desde partículas y
 * gira como un molinillo empujado por el viento.
 *
 * - `animate=false` (reduced motion): símbolo estático completo, sin lienzo ni giro.
 * - `active=false`: detiene todo el motion (al cerrar la bienvenida).
 */
export function PapelsaWindmill({
  animate,
  active,
  className,
}: {
  animate: boolean;
  active: boolean;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotorRef = useRef<SVGGElement>(null);
  const pieceRefs = useRef<(SVGPathElement | null)[]>([]);
  const [particlesDone, setParticlesDone] = useState(false);

  useEffect(() => {
    const pieces = pieceRefs.current;
    if (!animate) {
      for (const p of pieces) p?.style.setProperty("opacity", "1");
      return;
    }
    if (!active) return;

    const box = boxRef.current;
    const canvas = canvasRef.current;
    const rotor = rotorRef.current;
    if (!box || !rotor) return;

    const side = box.getBoundingClientRect().width;
    const ctx = canvas?.getContext("2d") ?? null;
    let field = canvas && ctx ? createParticleField(side) : null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasSide = side * CANVAS_FACTOR;
    if (canvas) {
      canvas.width = Math.round(canvasSide * dpr);
      canvas.height = Math.round(canvasSide * dpr);
    }

    // Vector de salida de cada pieza (desde el centro del símbolo hacia su centroide).
    const outward = pieces.map((p) => {
      if (!p) return { x: 0, y: 0, cx: CX, cy: CY };
      const b = p.getBBox();
      const cx = b.x + b.width / 2;
      const cy = b.y + b.height / 2;
      const len = Math.hypot(cx - CX, cy - CY) || 1;
      return { x: (cx - CX) / len, y: (cy - CY) / len, cx, cy };
    });

    const { pieces: pc, particles } = WINDMILL_MOTION;
    let t = 0;
    let angle = 0;
    let last = 0;
    let raf = 0;
    let particlesVisible = true;

    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 0;
      last = now;
      t += dt;

      // Partículas
      if (particlesVisible && ctx && field) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, canvasSide, canvasSide);
        ctx.translate(canvasSide / 2, canvasSide / 2);
        ctx.rotate((angle * Math.PI) / 180);
        drawParticles(ctx, field, t);
        if (t > particles.fadeOut[1]) {
          particlesVisible = false;
          field = null;
          setParticlesDone(true);
        }
      }

      // Resolución de las piezas oficiales: movimiento rígido hacia su posición exacta.
      const e = easeOutCubic(progress(t, pc.resolve));
      const off = (1 - e) * pc.offset * VB.width;
      const rot = (1 - e) * pc.rotate;
      pieces.forEach((p, i) => {
        if (!p) return;
        const o = outward[i];
        p.style.opacity = String(e);
        p.setAttribute(
          "transform",
          e >= 1 ? "" : `translate(${o.x * off} ${o.y * off}) rotate(${rot} ${o.cx} ${o.cy})`,
        );
      });

      // Giro de molinillo sobre el centro exacto del símbolo.
      angle = (angle + windVelocity(t) * dt) % 360;
      rotor.setAttribute("transform", `rotate(${angle} ${CX} ${CY})`);

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => cancelAnimationFrame(raf);
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [animate, active]);

  return (
    <div ref={boxRef} className={cn("relative aspect-square", className)} aria-hidden>
      {animate && !particlesDone ? (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: `${CANVAS_FACTOR * 100}%`, height: `${CANVAS_FACTOR * 100}%` }}
        />
      ) : null}
      <svg
        viewBox={`${VB.x} ${VB.y} ${VB.width} ${VB.height}`}
        className="relative block size-full overflow-visible"
      >
        <g ref={rotorRef}>
          {PAPELSA_SYMBOL_PIECES.map((piece, i) => (
            <path
              key={piece.id}
              ref={(el) => {
                pieceRefs.current[i] = el;
              }}
              className="windmill-piece"
              fill={piece.negative}
              d={piece.d}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
