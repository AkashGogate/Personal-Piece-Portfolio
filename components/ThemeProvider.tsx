"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
type Phase = "idle" | "falling" | "rising";
interface ThemeCtx { theme: Theme; toggle: () => void; }

const Ctx = createContext<ThemeCtx>({ theme: "light", toggle: () => {} });

const BG: Record<Theme, string> = { light: "#E8E7E5", dark: "#0e0e0e" };
const DURATION = 550;
const EASING = "cubic-bezier(0.76, 0, 0.24, 1)";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });
  const [phase, setPhase] = useState<Phase>("idle");
  const curtainColor = useRef("");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial: Theme = saved ?? "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  function toggle() {
    if (phase !== "idle") return;
    const next: Theme = theme === "dark" ? "light" : "dark";
    curtainColor.current = BG[next];
    setPhase("falling");
    setTimeout(() => {
      setTheme(next);
      localStorage.setItem("theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      setPhase("rising");
      setTimeout(() => setPhase("idle"), DURATION + 60);
    }, DURATION);
  }

  return (
    <Ctx.Provider value={{ theme, toggle }}>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: curtainColor.current,
          transformOrigin: "top",
          transform: phase === "falling" ? "scaleY(1)" : "scaleY(0)",
          transition: phase !== "idle" ? `transform ${DURATION}ms ${EASING}` : "none",
          zIndex: 9997,
          pointerEvents: "none",
        }}
      />
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
