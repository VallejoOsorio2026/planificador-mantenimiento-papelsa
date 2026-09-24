"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BETA_WELCOME_COPY } from "@/lib/brand-copy";
import { cn } from "@/lib/utils";
import { WINDMILL_MOTION } from "@/lib/windmill-motion";

import { PapelsaWindmill } from "./papelsa-windmill";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduced(cb: () => void) {
  const mql = window.matchMedia(REDUCED_QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;
const getReducedServer = () => false;

const { copy } = WINDMILL_MOTION;

function reveal(delay: number) {
  return { animationDelay: `${delay}s`, animationDuration: `${copy.duration}s` };
}

/**
 * Bienvenida beta superpuesta al planificador (que ya está cargado debajo).
 * Se cierra con el CTA, Enter o Esc en cualquier momento; no espera a la animación.
 */
export function BrandHero({ onClose }: { onClose: () => void }) {
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getReducedServer);
  const [leaving, setLeaving] = useState(false);
  const leavingRef = useRef(false);

  const close = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const id = window.setTimeout(onClose, reduced ? 0 : WINDMILL_MOTION.exit * 1000);
    return () => window.clearTimeout(id);
  }, [leaving, reduced, onClose]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const { headline } = BETA_WELCOME_COPY;
  const before = headline.before.split(" ");
  const after = headline.after.split(" ");
  const wordDelay = (i: number) => copy.start + i * copy.stagger;
  const ctaDelay = copy.start + copy.ctaDelay;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="brand-hero-title"
      className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-background transition-opacity ease-[var(--ease-out)]",
        leaving && "opacity-0",
      )}
      style={{ transitionDuration: `${WINDMILL_MOTION.exit}s` }}
    >
      <div className="relative flex max-w-[880px] flex-col items-center px-6 text-center">
        <div className="relative">
          <div aria-hidden className="brand-hero-glow pointer-events-none absolute -inset-[140%] rounded-full" />
          <PapelsaWindmill theme="dark" animate={!reduced} active={!leaving} className="w-[clamp(128px,23vh,200px)]" />
        </div>

        <p className="label-tech hero-reveal mt-10 text-muted-foreground" style={reveal(copy.start - 0.1)}>
          {BETA_WELCOME_COPY.label}
        </p>

        <h2
          id="brand-hero-title"
          className="mt-4 font-brand text-[clamp(26px,3.2vw,42px)] leading-[1.2] font-semibold text-balance text-foreground"
        >
          {before.map((w, i) => (
            <span key={`b${i}`}>
              <span className="hero-reveal inline-block" style={reveal(wordDelay(i))}>
                {w}
              </span>{" "}
            </span>
          ))}
          <span
            className="hero-reveal inline-block tracking-[0.08em] text-brand-green"
            style={reveal(wordDelay(before.length))}
          >
            {headline.emphasis}
          </span>{" "}
          {after.map((w, i) => (
            <span key={`a${i}`}>
              <span className="hero-reveal inline-block" style={reveal(wordDelay(before.length + 1 + i))}>
                {w}
              </span>
              {i < after.length - 1 ? " " : null}
            </span>
          ))}
        </h2>

        <Button size="lg" autoFocus onClick={close} className="hero-reveal mt-10 h-10 px-5" style={reveal(ctaDelay)}>
          {BETA_WELCOME_COPY.cta}
          <ArrowRight />
        </Button>
        <p className="hero-reveal mt-3 text-[11px] text-subtle-foreground" style={reveal(ctaDelay + 0.1)}>
          {BETA_WELCOME_COPY.hint}
        </p>
      </div>
    </div>
  );
}
