"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const BASE = process.env.NEXT_PUBLIC_BASEPATH ?? "";
import SectionLabel from "./SectionLabel";
import { SplineScene } from "./SplineScene";
import { useTheme } from "./ThemeProvider";
import { experienceSections } from "@/data/resume";
import { doNavigate } from "@/lib/navigate";

// Set to a real spline.design URL to enable a 3D background scene
// Prompt: "Abstract data flow, glowing amber and teal particles moving through network nodes, dark transparent background, slow continuous animation"
const EXPERIENCE_SPLINE = "";

type FlatItem = { company: string; role: string; period: string; bullets: string[]; tags?: string[]; imageSrc?: string; category: string; };

const flatItems: FlatItem[] = experienceSections.flatMap(s => s.items.map(item => ({ ...item, category: s.label })));
const N = flatItems.length;
const GAP = 24;

export default function Experience() {
  const outerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardVw = isMobile ? 85 : 55;

  const scrollToCard = (idx: number) => {
    const outer = outerRef.current;
    if (!outer) return;
    const outerTop = outer.getBoundingClientRect().top + window.scrollY;
    const scrollable = outer.offsetHeight - window.innerHeight;
    window.scrollTo({ top: outerTop + (idx / (N - 1)) * scrollable, behavior: "smooth" });
  };

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const update = () => {
      if (isMobile) {
        track.style.transform = "none";
        return;
      }
      const top = outer.getBoundingClientRect().top;
      const scrolled = -top;
      const scrollable = outer.offsetHeight - window.innerHeight;
      const cardPx = (cardVw / 100) * window.innerWidth;
      if (scrolled <= 0) { track.style.transform = "translateX(0)"; setCurrent(0); return; }
      if (scrolled >= scrollable) {
        track.style.transform = `translateX(-${(N - 1) * (cardPx + GAP)}px)`;
        setCurrent(N - 1);
        return;
      }
      const progress = scrolled / scrollable;
      const offset = progress * (N - 1) * (cardPx + GAP);
      track.style.transform = `translateX(-${offset}px)`;
      setCurrent(Math.round(progress * (N - 1)));
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [cardVw, isMobile]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const outer = outerRef.current;
      if (!outer) return;
      const rect = outer.getBoundingClientRect();
      if (rect.top > 0 || rect.bottom < window.innerHeight) return;
      setCurrent(prev => {
        const next = e.key === "ArrowRight" ? Math.min(prev + 1, N - 1) : Math.max(prev - 1, 0);
        if (next !== prev) scrollToCard(next);
        return next;
      });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <section
      id="experience"
      ref={outerRef}
      style={{ height: isMobile ? "auto" : `${N * 100}vh`, position: "relative" }}
    >
      <div
        style={{
          position: isMobile ? "relative" : "sticky",
          top: 0,
          height: isMobile ? "auto" : "100vh",
          overflow: isMobile ? "visible" : "hidden",
          background: "var(--surface)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: isMobile ? "2rem 1.5rem" : `clamp(2rem, 3.5vh, 4.5rem) calc((100vw - ${cardVw}vw) / 2) 1rem`, flexShrink: 0 }}>
          <SectionLabel number="03" label="Experience" className="mb-3" />
          <h2 className="font-display" style={{ fontSize: "clamp(2.1rem, 3.5vw, 3.2rem)", fontWeight: 400, color: "var(--primary)" }}>
            Where I&apos;ve worked
          </h2>
        </div>

        <div style={{ flex: 1, overflow: isMobile ? "visible" : "hidden", position: "relative" }}>
          {EXPERIENCE_SPLINE && (
            <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.35, pointerEvents: "none" }}>
              <SplineScene scene={EXPERIENCE_SPLINE} className="w-full h-full" />
            </div>
          )}
          {!isMobile && <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `calc((100vw - ${cardVw}vw) / 2)`, background: "linear-gradient(to right, var(--surface), transparent)", zIndex: 2, pointerEvents: "none" }} />}
          {!isMobile && <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: `calc((100vw - ${cardVw}vw) / 2)`, background: "linear-gradient(to left, var(--surface), transparent)", zIndex: 2, pointerEvents: "none" }} />}
          <div
            ref={trackRef}
            style={{ 
              display: "flex", 
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "2.5rem" : `${GAP}px`, 
              height: isMobile ? "auto" : "100%", 
              willChange: isMobile ? "auto" : "transform", 
              padding: isMobile ? "1rem 1.5rem 3rem" : `0 0 0 calc((100vw - ${cardVw}vw) / 2)` 
            }}
          >
            {flatItems.map((item, i) => (
              <div
                key={i}
                style={{
                  width: isMobile ? "100%" : `${cardVw}vw`,
                  flexShrink: 0,
                  height: isMobile ? "auto" : "100%",
                  position: "relative",
                  border: isMobile ? "1px solid var(--border)" : "none",
                  ...(item.imageSrc
                    ? { overflow: isMobile ? "visible" : "hidden" }
                    : { padding: isMobile ? "2rem 2rem 5rem" : "1.25rem 2rem 1.25rem 0", overflowY: isMobile ? "visible" : ("auto" as const) }),
                }}
              >
                {item.imageSrc ? (
                  isMobile ? (
                    // Mobile: image on top, content below — no absolute positioning, no overflow clipping
                    <>
                      <div style={{ position: "relative", height: "42vh", overflow: "hidden" }}>
                        <Image
                          src={`${BASE}${item.imageSrc}`}
                          alt=""
                          fill
                          sizes="92vw"
                          style={{ objectFit: "cover", filter: isDark ? "none" : "saturate(0.9)" }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,4,4,0.88) 0%, rgba(4,4,4,0.3) 55%, transparent 100%)" }} />
                        <span aria-hidden="true" className="font-display" style={{ position: "absolute", top: "0.75rem", right: "0.75rem", fontSize: "2rem", fontWeight: 700, color: "rgba(240,240,238,0.22)", lineHeight: 1, userSelect: "none", pointerEvents: "none", letterSpacing: "-0.04em" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div style={{ padding: "1.5rem", background: "rgba(8,8,8,0.97)" }}>
                        <div className="section-label mb-2" style={{ color: "#52b788", fontSize: "0.85rem" }}>{item.category}</div>
                        <h3 className="font-display" style={{ fontSize: "1.45rem", fontWeight: 400, color: "#f0f0ee", lineHeight: 1.15, marginBottom: "0.3rem" }}>
                          {item.company}
                        </h3>
                        <p className="font-body" style={{ fontSize: "0.9rem", color: "rgba(240,240,238,0.75)", letterSpacing: "0.04em", marginBottom: "0.1rem" }}>
                          {item.role}
                        </p>
                        <p className="font-body" style={{ fontSize: "0.9rem", color: "rgba(240,240,238,0.6)", letterSpacing: "0.04em", marginBottom: "1rem" }}>
                          {item.period}
                        </p>
                        <div style={{ width: "2rem", borderTop: "1px solid rgba(240,240,238,0.2)", marginBottom: "0.9rem" }} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginBottom: "1.25rem" }}>
                          {item.bullets.map((b, bi) => (
                            <p key={bi} className="font-body" style={{ fontSize: "0.9rem", color: "rgba(240,240,238,0.85)", lineHeight: 1.7 }}>
                              {b}
                            </p>
                          ))}
                        </div>
                        {item.tags && item.tags.length > 0 && (
                          <div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem" }}>
                              {item.tags.map((tag) => (
                                <span key={tag} className="font-body" style={{ fontSize: "0.78rem", letterSpacing: "0.09em", textTransform: "uppercase", padding: "4px 10px", border: "1px solid rgba(240,240,238,0.2)", color: "rgba(240,240,238,0.65)" }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <p className="font-body" style={{ fontSize: "0.65rem", letterSpacing: "0.08em", color: "rgba(240,240,238,0.45)" }}>
                              Want to know more about these? See the <a href="#skills" style={{ textDecoration: "underline", color: "inherit" }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); doNavigate("#skills"); }}>Skills</a> section ↗
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    // Desktop: full overlay layout — unchanged
                    <>
                      <Image
                        src={`${BASE}${item.imageSrc}`}
                        alt=""
                        fill
                        sizes="55vw"
                        style={{ objectFit: "cover", filter: isDark ? "none" : "saturate(0.9)" }}
                      />
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to top, rgba(4,4,4,0.98) 0%, rgba(4,4,4,0.88) 30%, rgba(4,4,4,0.65) 55%, rgba(4,4,4,0.25) 75%, rgba(4,4,4,0.0) 100%)",
                      }} />
                      <span aria-hidden="true" className="font-display" style={{ position: "absolute", top: "1.5rem", right: "1.5rem", fontSize: "clamp(4rem, 8vw, 10rem)", fontWeight: 700, color: isDark ? "rgba(240,240,238,0.22)" : "rgba(240,240,238,0.35)", lineHeight: 1, userSelect: "none", pointerEvents: "none", letterSpacing: "-0.04em" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div style={{ position: "absolute", inset: 0, padding: "2rem", overflowY: "auto", display: "flex", flexDirection: "column" }}>
                        <div style={{ marginTop: "auto" }}>
                          <div className="section-label mb-2" style={{ color: "#52b788", fontSize: "0.85rem" }}>{item.category}</div>
                          <h3 className="font-display" style={{ fontSize: "clamp(1.3rem, 5vw, 3rem)", fontWeight: 400, color: "#f0f0ee", lineHeight: 1.1, marginBottom: "0.3rem" }}>
                            {item.company}
                          </h3>
                          <p className="font-body" style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.02rem)", color: "rgba(240,240,238,0.75)", letterSpacing: "0.04em", marginBottom: "0.1rem" }}>
                            {item.role}
                          </p>
                          <p className="font-body" style={{ fontSize: "0.95rem", color: "rgba(240,240,238,0.6)", letterSpacing: "0.04em", marginBottom: "1.1rem" }}>
                            {item.period}
                          </p>
                          <div style={{ width: "2rem", borderTop: "1px solid rgba(240,240,238,0.25)", marginBottom: "0.9rem" }} />
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginBottom: "1.5rem" }}>
                            {item.bullets.map((b, bi) => (
                              <p key={bi} className="font-body" style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.02rem)", color: "rgba(240,240,238,0.88)", lineHeight: 1.75 }}>
                                {b}
                              </p>
                            ))}
                          </div>
                          {item.tags && item.tags.length > 0 && (
                            <div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem" }}>
                                {item.tags.map((tag) => (
                                  <span key={tag} className="font-body" style={{ fontSize: "0.78rem", letterSpacing: "0.09em", textTransform: "uppercase", padding: "4px 10px", border: "1px solid rgba(240,240,238,0.25)", color: "rgba(240,240,238,0.7)" }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <p className="font-body" style={{ fontSize: "0.65rem", letterSpacing: "0.08em", color: "rgba(240,240,238,0.5)" }}>
                                Want to know more about these? See the <a href="#skills" style={{ textDecoration: "underline", color: "inherit" }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); doNavigate("#skills"); }}>Skills</a> section ↗
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )
                ) : (
                  <>
                    <span aria-hidden="true" className="font-display" style={{ position: "absolute", bottom: "1rem", right: isMobile ? "1rem" : "2rem", fontSize: isMobile ? "3rem" : "clamp(6rem, 12vw, 14rem)", fontWeight: 700, color: "var(--border)", opacity: 0.45, lineHeight: 1, userSelect: "none", pointerEvents: "none", letterSpacing: "-0.04em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="section-label mb-2" style={{ color: "var(--mint)", fontSize: "0.85rem" }}>{item.category}</div>
                    <h3 className="font-display" style={{ fontSize: "clamp(1.3rem, 5vw, 3rem)", fontWeight: 400, color: "var(--primary)", lineHeight: 1.1, marginBottom: "0.3rem" }}>
                      {item.company}
                    </h3>
                    <p className="font-body" style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.02rem)", color: "var(--secondary)", letterSpacing: "0.04em", marginBottom: "0.1rem" }}>
                      {item.role}
                    </p>
                    <p className="font-body" style={{ fontSize: "0.95rem", color: "var(--secondary)", letterSpacing: "0.04em", marginBottom: "1.1rem" }}>
                      {item.period}
                    </p>
                    <div style={{ width: "2rem", borderTop: "1px solid var(--border)", marginBottom: "0.9rem" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginBottom: "1.5rem" }}>
                      {item.bullets.map((b, bi) => (
                        <p key={bi} className="font-body" style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)", color: "var(--secondary)", lineHeight: 1.75 }}>
                          {b}
                        </p>
                      ))}
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem" }}>
                          {item.tags.map((tag) => (
                            <span key={tag} className="font-body" style={{ fontSize: "0.78rem", letterSpacing: "0.09em", textTransform: "uppercase", padding: "4px 10px", border: "1px solid var(--border)", color: "var(--secondary)" }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="font-body" style={{ fontSize: "0.65rem", letterSpacing: "0.08em", color: "var(--secondary)", opacity: 0.6 }}>
                          Want to know more? See the <a href="#skills" style={{ textDecoration: "underline", color: "inherit" }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); doNavigate("#skills"); }}>Skills</a> section ↗
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {!isMobile && (
          <div style={{ padding: "0.9rem clamp(1.5rem, 6vw, 5rem)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {flatItems.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollToCard(i)}
                style={{ width: i === current ? "18px" : "5px", height: "5px", borderRadius: "3px", background: i === current ? "var(--primary)" : "var(--border)", border: "none", padding: 0, cursor: "pointer", transition: "width 0.3s" }}
              />
            ))}
          </div>
            <span className="section-label">
              {String(current + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
