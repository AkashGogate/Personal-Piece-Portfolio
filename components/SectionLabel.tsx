"use client";
import { useRef, useEffect } from "react";

interface Props {
  number: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SectionLabel({ number, label, className = "mb-4", style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const ran = useRef(false);
  const target = parseInt(number, 10);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || ran.current) return;
        ran.current = true;
        obs.disconnect();
        setTimeout(() => {
          const start = performance.now();
          const dur = 350;
          function tick(now: number) {
            if (!el) return;
            const t = Math.min((now - start) / dur, 1);
            el.textContent = String(Math.round(t * target)).padStart(2, "0") + " / " + label;
            if (t < 1) raf = requestAnimationFrame(tick);
          }
          raf = requestAnimationFrame(tick);
        }, 300);
      },
      { rootMargin: "-80px" }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, label]);

  return (
    <div ref={ref} className={`section-label ${className}`} style={style}>
      00 / {label}
    </div>
  );
}
