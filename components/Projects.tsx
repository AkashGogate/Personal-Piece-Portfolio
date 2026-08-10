"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { animate } from "animejs";
import SectionLabel from "./SectionLabel";
import { projects, type Project } from "@/data/resume";
import { doNavigate } from "@/lib/navigate";

const ease = [0.19, 1, 0.22, 1] as [number, number, number, number];

function ProjectDrawer({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    animate(overlayRef.current!, { opacity: [0, 1], duration: 200 });
    animate(drawerRef.current!, { translateY: ["100%", "0%"], ease: "outExpo", duration: 450 });
    const tid = window.setTimeout(() => closeButtonRef.current?.focus(), 460);
    return () => { document.body.style.overflow = prev; clearTimeout(tid); };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        animate(overlayRef.current!, { opacity: 0, duration: 250 });
        animate(drawerRef.current!, { translateY: "100%", ease: "inCubic", duration: 300 }).then(() => onClose());
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleClose() {
    animate(overlayRef.current!, { opacity: 0, duration: 250 });
    animate(drawerRef.current!, { translateY: "100%", ease: "inCubic", duration: 300 }).then(
      () => onClose()
    );
  }

  function handleCloseAndNavigate(hash: string) {
    animate(overlayRef.current!, { opacity: 0, duration: 250 });
    animate(drawerRef.current!, { translateY: "100%", ease: "inCubic", duration: 300 }).then(() => {
      onClose();
      doNavigate(hash);
    });
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: "rgba(26,26,26,0.5)", opacity: 0 }}
      onClick={handleClose}
    >
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="w-full max-h-[80vh] overflow-y-auto"
        style={{
          background: "var(--bg)",
          borderTop: "1px solid var(--border)",
          transform: "translateY(100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto px-8 py-12">
          {project.imageSrc && (
            <div style={{ width: "100%", marginBottom: "2rem" }}>
              <Image src={`${process.env.NEXT_PUBLIC_BASEPATH ?? ""}${project.imageSrc}`} alt={project.title} width={0} height={0} sizes="100vw" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          )}
          <div className="flex items-start justify-between gap-8 mb-6">
            <h3
              id="drawer-title"
              className="font-display"
              style={{
                fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                fontWeight: 400,
                color: "var(--primary)",
                lineHeight: 1.2,
              }}
            >
              {project.title}
            </h3>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              className="font-body flex-shrink-0"
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--secondary)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
          <p
            className="font-body mb-6"
            style={{ fontSize: "1.15rem", color: "var(--secondary)", lineHeight: 1.8 }}
          >
            {project.detail}
          </p>
          <div
            className="font-body mb-2"
            style={{ fontSize: "0.88rem", color: "var(--secondary)", letterSpacing: "0.04em", display: "flex", flexWrap: "wrap", gap: "0.3rem" }}
          >
            {project.tags.map((tag, i) => (
              <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                <a
                  href="#skills"
                  style={{ color: "inherit", textDecoration: "none", cursor: "pointer", transition: "color 0.2s" }}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); doNavigate("#skills"); }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--mint)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "inherit"; }}
                >
                  {tag}
                </a>
                {i < project.tags.length - 1 && <span aria-hidden="true">/</span>}
              </span>
            ))}
          </div>
          <p
            className="font-body mb-8"
            style={{ fontSize: "0.8rem", letterSpacing: "0.05em", color: "var(--secondary)" }}
          >
            See more in the{" "}
            <a
              href="#skills"
              style={{ textDecoration: "underline", color: "var(--primary)" }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCloseAndNavigate("#skills"); }}
            >
              Skills
            </a>{" "}
            section ↗
          </p>
          <div className="flex gap-6 items-center">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm"
                style={{
                  color: "var(--primary)",
                  textDecoration: "underline",
                  textDecorationColor: "var(--border)",
                }}
              >
                GitHub ↗
              </a>
            )}
            {project.note && (
              <span className="font-body text-sm italic" style={{ color: "var(--secondary)" }}>
                {project.note}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const openedFromRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const track = (e: MouseEvent) => { mousePos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", track);
    return () => window.removeEventListener("mousemove", track);
  }, []);

  function closeDrawer() {
    const toFocus = openedFromRef.current;
    openedFromRef.current = null;
    setSelected(null);
    setTimeout(() => {
      toFocus?.focus({ preventScroll: true });
      const el = document.elementFromPoint(mousePos.current.x, mousePos.current.y);
      const row = el?.closest("[data-project-id]") as HTMLElement | null;
      setHoveredId(row?.dataset.projectId ?? null);
    }, 320);
  }

  return (
    <>
      <section id="projects" style={{ background: "var(--bg)", position: "relative", overflow: "hidden", paddingTop: "clamp(3rem, 6vh, 6rem)", paddingBottom: "clamp(3rem, 6vh, 6rem)", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <div className="max-w-4xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.5, ease }}
            className="mb-16"
          >
            <SectionLabel number="04" label="Projects" className="mb-4" />
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2.1rem, 3.5vw, 3.2rem)",
                fontWeight: 400,
                color: "var(--primary)",
              }}
            >
              Things I&apos;ve built
            </h2>
          </m.div>

          <div>
            {projects.map((p, i) => (
              <m.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease }}
              >
                <div
                  data-project-id={p.id}
                  className="cursor-pointer py-8 flex gap-6 items-start"
                  style={{
                    position: "relative",
                    borderLeft: hoveredId === p.id
                      ? "2px solid var(--mint)"
                      : isMobile ? "2px solid var(--border)" : "2px solid transparent",
                    paddingLeft: hoveredId === p.id || isMobile ? "1.25rem" : "0",
                    transition: "border-color 0.2s, padding-left 0.2s",
                    willChange: !isMobile && hoveredId === p.id ? "transform" : "auto",
                  }}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseMove={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    const rect = el.getBoundingClientRect();
                    const rx = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -4;
                    const ry = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 4;
                    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.015)`;
                    el.style.boxShadow = "0 16px 48px rgba(0,0,0,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    setHoveredId(null);
                    const el = e.currentTarget as HTMLElement;
                    el.style.transition = "border-color 0.2s, padding-left 0.2s, transform 0.4s ease, box-shadow 0.3s";
                    el.style.transform = "";
                    el.style.boxShadow = "";
                    setTimeout(() => { el.style.transition = "border-color 0.2s, padding-left 0.2s"; }, 400);
                  }}
                >
                  <button
                    type="button"
                    aria-label={`View details: ${p.title}`}
                    onClick={(e) => { openedFromRef.current = e.currentTarget as HTMLElement; setSelected(p); }}
                    style={{ position: "absolute", inset: 0, zIndex: 1, background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
                  />
                  <span
                    className="font-display flex-shrink-0 mt-1"
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--secondary)",
                      fontWeight: 400,
                      minWidth: "2rem",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {p.imageSrc && (
                    <div style={{ width: 56, height: 56, flexShrink: 0, position: "relative", overflow: "hidden", borderRadius: 4, border: "1px solid var(--border)" }}>
                      <Image src={`${process.env.NEXT_PUBLIC_BASEPATH ?? ""}${p.imageSrc}`} alt="" fill sizes="56px" style={{ objectFit: "cover" }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-display mb-2"
                      style={{
                        fontSize: "clamp(1.15rem, 5vw, 1.4rem)",
                        fontWeight: 400,
                        color: hoveredId === p.id ? "var(--mint)" : "var(--primary)",
                        lineHeight: 1.3,
                      }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="font-body mb-3"
                      style={{ fontSize: "1.12rem", color: "var(--secondary)", lineHeight: 1.7 }}
                    >
                      {p.description}
                    </p>
                    <div className="flex items-center gap-5 flex-wrap">
                      <span
                        className="font-body"
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--secondary)",
                          letterSpacing: "0.04em",
                          display: "inline-flex",
                          flexWrap: "wrap",
                          gap: "0.3rem",
                        }}
                      >
                        {p.tags.slice(0, 4).map((tag, i, arr) => (
                          <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                            <a
                              href="#skills"
                              style={{ color: "inherit", textDecoration: "none", cursor: "pointer", transition: "color 0.2s", position: "relative", zIndex: 2 }}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); doNavigate("#skills"); }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--mint)"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "inherit"; }}
                            >
                              {tag}
                            </a>
                            {i < arr.length - 1 && <span aria-hidden="true">/</span>}
                          </span>
                        ))}
                      </span>
                      <span
                        className="font-body"
                        style={{
                          fontSize: "0.68rem",
                          color: "var(--secondary)",
                          opacity: 0.6,
                          letterSpacing: "0.06em",
                        }}
                      >
                        · <a href="#skills" style={{ textDecoration: "underline", color: "inherit", position: "relative", zIndex: 2 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); doNavigate("#skills"); }}>Skills ↗</a>
                      </span>
                      <span
                        className="font-body"
                        style={{
                          fontSize: "0.7rem",
                          color: isMobile ? "var(--secondary)" : hoveredId === p.id ? "var(--mint)" : "var(--secondary)",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {isMobile ? "Tap to explore ↗" : "Click to explore ↗"}
                      </span>
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-xs"
                          style={{
                            color: "var(--secondary)",
                            textDecoration: "underline",
                            textDecorationColor: "var(--border)",
                            position: "relative",
                            zIndex: 2,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          GitHub ↗
                        </a>
                      )}
                      {p.note && !p.github && (
                        <span
                          className="font-body text-xs italic"
                          style={{ color: "var(--secondary)" }}
                        >
                          {p.note}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {i < projects.length - 1 && (
                  <div style={{ borderTop: "1px solid var(--border)" }} />
                )}
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <ProjectDrawer project={selected} onClose={closeDrawer} />
      )}
    </>
  );
}
