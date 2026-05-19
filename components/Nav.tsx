"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { animate } from "animejs";
import { resumeVariants } from "@/data/resume";
import { doNavigate } from "@/lib/navigate";

const BASE = process.env.NEXT_PUBLIC_BASEPATH ?? "";

const links = [
  { label: "Featured", href: "#featured-project" },
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, toggle } = useTheme();
  const borderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeSectionRef = useRef<string>("");
  const resumeNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let shown = false;
    const onScroll = () => {
      setShowFab(window.scrollY > window.innerHeight * 0.6);
      const past = window.scrollY > 50;
      if (past !== shown) {
        shown = past;
        animate(borderRef.current!, { opacity: past ? 1 : 0, duration: 200, ease: "outCubic" });
        if (headerRef.current) {
          const dark = document.documentElement.classList.contains("dark");
          headerRef.current.style.background = past
            ? dark ? "rgba(17,17,16,0.88)" : "rgba(232,231,229,0.88)"
            : "var(--bg)";
          headerRef.current.style.backdropFilter = past ? "blur(12px)" : "none";
          (headerRef.current.style as CSSStyleDeclaration & { webkitBackdropFilter: string }).webkitBackdropFilter = past ? "blur(12px)" : "none";
        }
      }
      if (progressRef.current) {
        const total = Math.max(document.body.scrollHeight - window.innerHeight, 1);
        progressRef.current.style.width = `${(window.scrollY / total) * 100}%`;
      }
      let current = "";
      for (const link of links) {
        const el = document.querySelector(link.href) as HTMLElement | null;
        if (el && el.getBoundingClientRect().top <= 120) current = link.href.slice(1);
      }
      if (current !== activeSectionRef.current) {
        activeSectionRef.current = current;
        setActiveSection(current);
        navLinksRef.current.forEach((a, i) => {
          if (!a) return;
          a.style.color = links[i].href.slice(1) === current ? "var(--mint)" : "var(--secondary)";
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!headerRef.current || window.scrollY <= 50) return;
    const dark = document.documentElement.classList.contains("dark");
    headerRef.current.style.background = dark ? "rgba(17,17,16,0.88)" : "rgba(232,231,229,0.88)";
  }, [theme]);

  useEffect(() => {
    if (!resumeOpen) return;
    const handler = (e: MouseEvent) => {
      if (resumeNavRef.current && !resumeNavRef.current.contains(e.target as Node)) {
        setResumeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [resumeOpen]);

  return (
    <>
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "var(--bg)", transition: "background 0.3s, backdrop-filter 0.3s" }}
    >
      <div ref={progressRef} style={{ position: "absolute", top: 0, left: 0, height: "1px", background: "var(--primary)", width: "0%", zIndex: 10 }} />
      <div
        ref={borderRef}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "var(--border)", opacity: 0 }}
      />
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <a
          href="#"
          className="font-display"
          style={{ color: "var(--primary)", fontWeight: 600, fontSize: "1.25rem", letterSpacing: "-0.01em" }}
          onClick={(e) => { e.preventDefault(); doNavigate("#"); }}
        >
          Akash Gogate
        </a>

        <nav className="hidden lg:flex items-center gap-5">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              ref={(el) => { navLinksRef.current[i] = el; }}
              className="font-body relative group transition-colors duration-200"
              onClick={(e) => { e.preventDefault(); doNavigate(l.href); }}
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "var(--secondary)",
              }}
            >
              {l.label}
              <span
                className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                style={{ background: "var(--mint)" }}
              />
            </a>
          ))}
          <div ref={resumeNavRef} className="relative">
            <button
              onClick={() => setResumeOpen((o) => !o)}
              className="font-body"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--primary)",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                lineHeight: 1,
              }}
            >
              Resume {resumeOpen ? "↑" : "↓"}
            </button>
            {resumeOpen && (
              <div
                className="absolute top-full right-0 mt-2 z-50"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  minWidth: "180px",
                }}
              >
                {resumeVariants.map((v) => (
                  <a
                    key={v.href}
                    href={`${BASE}${v.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body block px-4 py-3"
                    style={{
                      fontSize: "0.72rem",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      color: "var(--secondary)",
                      borderBottom: "1px solid var(--border)",
                      transition: "color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = "var(--mint)";
                      el.style.background = "var(--surface)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = "var(--secondary)";
                      el.style.background = "transparent";
                    }}
                    onClick={() => setResumeOpen(false)}
                  >
                    {v.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--secondary)", display: "flex", alignItems: "center", padding: "4px" }}
          >
            {theme === "dark" ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </nav>

        <div className="lg:hidden flex items-center gap-4">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--secondary)", display: "flex", alignItems: "center", padding: "4px" }}
          >
            {theme === "dark" ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          <button
            className="font-body"
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--secondary)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setOpen(!open)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
            style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="font-body"
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: l.href.slice(1) === activeSection ? "var(--mint)" : "var(--secondary)",
                  }}
                  onClick={(e) => { e.preventDefault(); doNavigate(l.href); setOpen(false); }}
                >
                  {l.label}
                </a>
              ))}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.5rem", marginTop: "0.25rem" }}>
                <div className="section-label mb-2" style={{ fontSize: "0.65rem" }}>Resume</div>
                {resumeVariants.map((v) => (
                  <a
                    key={v.href}
                    href={`${BASE}${v.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body block py-2"
                    style={{
                      fontSize: "0.75rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--primary)",
                    }}
                    onClick={() => setOpen(false)}
                  >
                    {v.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    <AnimatePresence>
      {showFab && (
        <motion.button
          key="fab"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          onClick={() => doNavigate("#")}
          aria-label="Back to top"
          className="font-body hidden md:flex"
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            zIndex: 60,
            background: "var(--elevated)",
            border: "1px solid var(--border)",
            color: "var(--secondary)",
            cursor: "pointer",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.55rem 1rem",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.color = "var(--mint)";
            el.style.borderColor = "var(--mint)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.color = "var(--secondary)";
            el.style.borderColor = "var(--border)";
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5 8V2M2 5l3-3 3 3"/>
          </svg>
          Top
        </motion.button>
      )}
    </AnimatePresence>
    </>
  );
}
