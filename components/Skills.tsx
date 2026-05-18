"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
    <motion.div
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
          fontSize: "0.82rem",
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
    </motion.div>
  );
}

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const [card, setCard] = useState<CardState | null>(null);

  return (
    <section
      id="skills"
      ref={ref}
      style={{ background: "var(--bg)", paddingTop: "clamp(3rem, 6vh, 7rem)", paddingBottom: "clamp(3rem, 6vh, 7rem)", position: "relative", overflow: "hidden" }}
    >
      <AnimatePresence>{card && <SkillCard {...card} />}</AnimatePresence>

      <div className="max-w-7xl mx-auto px-6" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
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
                fontSize: "1.1rem",
                color: "var(--secondary)",
                lineHeight: 1.75,
                maxWidth: "44ch",
              }}
            >
              Here's where I am right now. Most of it I picked up quickly on
              real projects, and the list keeps growing.
            </p>
          </div>
        </motion.div>

        <motion.div
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
                        (e.currentTarget as HTMLElement).style.color =
                          "var(--primary)";
                        setCard(null);
                      }}
                    >
                      {skill.name}
                    </span>
                    {si < group.skills.length - 1 && (
                      <span
                        style={{
                          color: "var(--border)",
                          margin: "0 12px",
                          userSelect: "none",
                          fontSize: "1rem",
                        }}
                      >
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.45 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="section-label"
          style={{ marginTop: "1rem" }}
        >
          Hover any skill to explore
        </motion.p>
      </div>
    </section>
  );
}
