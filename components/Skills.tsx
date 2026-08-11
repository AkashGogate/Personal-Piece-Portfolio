"use client";

import { useRef, useState, useEffect } from "react";
import { m, useInView, AnimatePresence } from "framer-motion";
import SectionLabel from "./SectionLabel";
import { skillGroups, projects, type Skill } from "@/data/resume";

const PROFICIENCY_LABEL: Record<number, string> = {
  1: "Learning",
  2: "Familiar",
  3: "Proficient",
  4: "Advanced",
  5: "Expert",
};

function normalize(s: string) {
  return s.toLowerCase().replace(/[\s\-_.]/g, "");
}

function ProficiencyDots({ level }: { level: number }) {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: i <= level ? "var(--mint)" : "transparent",
            border: "1.5px solid",
            borderColor: i <= level ? "var(--mint)" : "var(--border)",
          }}
        />
      ))}
    </div>
  );
}

interface CardState {
  skill: Skill;
  rect: DOMRect;
}

function SkillCard({ skill, rect }: CardState) {
  const relatedProjects = projects.filter((p) =>
    p.tags.some((t) => normalize(t) === normalize(skill.name))
  );

  const CARD_W = 300;
  const GAP = 10;

  const rawLeft = rect.left;
  const left = Math.max(16, Math.min(rawLeft, window.innerWidth - CARD_W - 16));
  const isNearBottom = rect.bottom > window.innerHeight * 0.6;

  const posStyle: React.CSSProperties = isNearBottom
    ? { bottom: window.innerHeight - rect.top + GAP }
    : { top: rect.bottom + GAP };

  return (
    <m.div
      initial={{ opacity: 0, y: isNearBottom ? -5 : 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isNearBottom ? -3 : 3 }}
      transition={{ duration: 0.13 }}
      style={{
        position: "fixed",
        left,
        width: CARD_W,
        zIndex: 200,
        background: "var(--elevated)",
        border: "1px solid var(--border)",
        padding: "18px 20px",
        pointerEvents: "none",
        ...posStyle,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <p
          className="font-display"
          style={{
            fontSize: "1.05rem",
            color: "var(--primary)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}
        >
          {skill.name}
        </p>
        <ProficiencyDots level={skill.proficiency} />
      </div>

      <p
        style={{
          fontSize: "0.67rem",
          color: "var(--mint)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontWeight: 500,
          marginBottom: 10,
        }}
      >
        {PROFICIENCY_LABEL[skill.proficiency]}
      </p>

      <p
        className="font-body"
        style={{
          fontSize: "0.9rem",
          color: "var(--secondary)",
          lineHeight: 1.65,
          marginBottom: relatedProjects.length > 0 ? 14 : 0,
        }}
      >
        {skill.description}
      </p>

      {relatedProjects.length > 0 && (
        <>
          <div style={{ borderTop: "1px solid var(--border)", marginBottom: 10 }} />
          <p className="section-label" style={{ marginBottom: 7, fontSize: "0.62rem" }}>
            Used in
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {relatedProjects.map((p) => {
              const label = p.title.split(" — ")[0].split(" (")[0];
              const display = label.length > 32 ? label.slice(0, 30) + "…" : label;
              return (
                <span
                  key={p.id}
                  className="font-body"
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--secondary)",
                    border: "1px solid var(--border)",
                    padding: "2px 9px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {display}
                </span>
              );
            })}
          </div>
        </>
      )}
    </m.div>
  );
}

function SkillAccordionContent({ skill }: { skill: Skill }) {
  const relatedProjects = projects.filter((p) =>
    p.tags.some((t) => normalize(t) === normalize(skill.name))
  );
  return (
    <m.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ overflow: "hidden" }}
    >
      <div style={{ borderLeft: "2px solid var(--mint)", paddingLeft: "12px", paddingTop: "8px", paddingBottom: "12px", marginBottom: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <p style={{ fontSize: "0.67rem", color: "var(--mint)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
            {PROFICIENCY_LABEL[skill.proficiency]}
          </p>
          <ProficiencyDots level={skill.proficiency} />
        </div>
        <p className="font-body" style={{ fontSize: "0.9rem", color: "var(--secondary)", lineHeight: 1.65, marginBottom: relatedProjects.length > 0 ? 10 : 0 }}>
          {skill.description}
        </p>
        {relatedProjects.length > 0 && (
          <>
            <div style={{ borderTop: "1px solid var(--border)", margin: "8px 0" }} />
            <p className="section-label" style={{ marginBottom: 5, fontSize: "0.62rem" }}>Used in</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {relatedProjects.map((p) => {
                const label = p.title.split(" — ")[0].split(" (")[0];
                const display = label.length > 32 ? label.slice(0, 30) + "…" : label;
                return (
                  <span key={p.id} className="font-body" style={{ fontSize: "0.72rem", color: "var(--secondary)", border: "1px solid var(--border)", padding: "2px 9px" }}>
                    {display}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>
    </m.div>
  );
}

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const [card, setCard] = useState<CardState | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="skills"
      ref={ref}
      style={{ background: "var(--bg)", paddingTop: "clamp(3rem, 6vh, 7rem)", paddingBottom: "clamp(3rem, 6vh, 7rem)", position: "relative", overflow: "hidden" }}
    >
      {!isMobile && <AnimatePresence>{card && <SkillCard {...card} />}</AnimatePresence>}

      <div className="max-w-7xl mx-auto px-6" style={{ position: "relative", zIndex: 1 }}>
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel number="05" label="Skills" className="mb-6" />

          <div style={{ marginBottom: "2.5rem" }}>
            <p
              className="font-display"
              style={{
                fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                fontStyle: "italic",
                color: "var(--mint)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                marginBottom: "0.5rem",
              }}
            >
              Always learning.
            </p>
            <p
              className="font-body"
              style={{
                fontSize: "1.2rem",
                color: "var(--secondary)",
                lineHeight: 1.75,
                maxWidth: "44ch",
              }}
            >
              Here's where I am right now. Picked up most of these through
              working on real projects, and the list keeps growing.
            </p>
          </div>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ border: "1px solid var(--border)" }}
        >
          {skillGroups.map((group, groupIdx) => (
            <div
              key={group.category}
              className="skills-row"
              style={{
                borderBottom:
                  groupIdx < skillGroups.length - 1
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              <div
                style={{
                  borderLeft: "2px solid var(--mint)",
                  paddingLeft: "10px",
                  paddingTop: 2,
                }}
              >
                <p className="section-label">{group.category}</p>
              </div>

              {isMobile ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {group.skills.map((skill) => (
                    <div key={skill.name}>
                      <button
                        type="button"
                        aria-expanded={expanded === skill.name}
                        className="font-body"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          padding: "7px 0",
                          fontSize: "1.02rem",
                          color: expanded === skill.name ? "var(--mint)" : "var(--primary)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          letterSpacing: "0.01em",
                          textAlign: "left",
                          userSelect: "none",
                        }}
                        onClick={() => setExpanded(expanded === skill.name ? null : skill.name)}
                      >
                        <span>{skill.name}</span>
                        <span style={{ fontSize: "0.6rem", color: "var(--secondary)", flexShrink: 0, marginLeft: "12px" }}>
                          {expanded === skill.name ? "▲" : "▼"}
                        </span>
                      </button>
                      <AnimatePresence>
                        {expanded === skill.name && <SkillAccordionContent skill={skill} />}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", rowGap: "8px", alignItems: "center" }}>
                  {group.skills.map((skill, si) => (
                    <span
                      key={skill.name}
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <span
                        className="font-body"
                        style={{
                          fontSize: "1.05rem",
                          color: "var(--primary)",
                          cursor: "default",
                          letterSpacing: "0.01em",
                          padding: "2px 0",
                          userSelect: "none",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.color = "var(--mint)";
                          setCard({ skill, rect: el.getBoundingClientRect() });
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "var(--primary)";
                          setCard(null);
                        }}
                      >
                        {skill.name}
                      </span>
                      {si < group.skills.length - 1 && (
                        <span style={{ color: "var(--secondary)", margin: "0 12px", userSelect: "none", fontSize: "1rem" }}>·</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </m.div>

        <m.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.45 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="section-label"
          style={{ marginTop: "1rem" }}
        >
          {isMobile ? "Tap any skill to explore" : "Hover over any skill to explore"}
        </m.p>
      </div>
    </section>
  );
}
