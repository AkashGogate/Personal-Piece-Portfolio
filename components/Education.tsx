"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import SectionLabel from "./SectionLabel";
import { education, highSchool, type CourseItem } from "@/data/resume";

const ease = [0.19, 1, 0.22, 1] as [number, number, number, number];

const PROFICIENCY_LABEL: Record<number, string> = {
  1: "Learning",
  2: "Familiar",
  3: "Proficient",
  4: "Advanced",
  5: "Expert",
};

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
  course: CourseItem;
  rect: DOMRect;
}

function CourseCard({ course, rect }: CardState) {
  const CARD_W = 300;
  const GAP = 10;

  const left = Math.max(16, Math.min(rect.left, window.innerWidth - CARD_W - 16));
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
          {course.name}
        </p>
        <ProficiencyDots level={course.proficiency} />
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
        {PROFICIENCY_LABEL[course.proficiency]}
      </p>

      <p
        className="font-body"
        style={{
          fontSize: "0.82rem",
          color: "var(--secondary)",
          lineHeight: 1.65,
          marginBottom: 14,
        }}
      >
        {course.description}
      </p>

      <div style={{ borderTop: "1px solid var(--border)", marginBottom: 10 }} />
      <p className="section-label" style={{ marginBottom: 7, fontSize: "0.62rem" }}>
        Applied to
      </p>
      <p
        className="font-body"
        style={{
          fontSize: "0.82rem",
          color: "var(--secondary)",
          lineHeight: 1.6,
        }}
      >
        {course.useCase}
      </p>
    </motion.div>
  );
}

function CourseAccordionContent({ course }: { course: CourseItem }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ overflow: "hidden" }}
    >
      <div style={{ borderLeft: "2px solid var(--mint)", paddingLeft: "12px", paddingTop: "8px", paddingBottom: "12px", marginBottom: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <p style={{ fontSize: "0.67rem", color: "var(--mint)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
            {PROFICIENCY_LABEL[course.proficiency]}
          </p>
          <ProficiencyDots level={course.proficiency} />
        </div>
        <p className="font-body" style={{ fontSize: "0.82rem", color: "var(--secondary)", lineHeight: 1.65, marginBottom: 10 }}>
          {course.description}
        </p>
        <div style={{ borderTop: "1px solid var(--border)", margin: "8px 0" }} />
        <p className="section-label" style={{ marginBottom: 5, fontSize: "0.62rem" }}>Applied to</p>
        <p className="font-body" style={{ fontSize: "0.82rem", color: "var(--secondary)", lineHeight: 1.6 }}>
          {course.useCase}
        </p>
      </div>
    </motion.div>
  );
}

export default function Education() {
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
      id="education"
      ref={ref}
      style={{ background: "var(--surface)", position: "relative", overflow: "hidden", paddingTop: "clamp(3rem, 6vh, 6rem)", paddingBottom: "clamp(3rem, 6vh, 6rem)" }}
    >
      {!isMobile && <AnimatePresence>{card && <CourseCard {...card} />}</AnimatePresence>}

      <div className="max-w-7xl mx-auto px-6" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="mb-10"
        >
          <SectionLabel number="02" label="Education" className="mb-6" />

          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.7rem, 6vw, 3.2rem)",
              fontWeight: 400,
              color: "var(--primary)",
              letterSpacing: "-0.01em",
              marginBottom: "0.55rem",
            }}
          >
            {education.school}
          </h2>

          <p
            className="font-body"
            style={{
              fontSize: "1rem",
              color: "var(--secondary)",
              lineHeight: 1.6,
              marginBottom: "0.9rem",
            }}
          >
            {education.degree} · {education.period}
          </p>

          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
            <span
              className="section-label"
              style={{ color: "var(--mint)", letterSpacing: "0.1em" }}
            >
              {education.gpa} GPA
            </span>
            {education.honors.map((h) => (
              <span key={h} className="section-label">
                {h}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          style={{
            borderTop: "1px solid var(--border)",
            transformOrigin: "left center",
            marginBottom: "2.5rem",
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          {education.coursework.map((group, gi) => (
            <motion.div
              key={group.area}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + gi * 0.1, ease }}
            >
              <p
                className="section-label"
                style={{
                  borderLeft: "2px solid var(--mint)",
                  paddingLeft: "10px",
                  marginBottom: "1.25rem",
                }}
              >
                {group.area}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", alignItems: "flex-start", width: "100%" }}>
                {group.courses.map((course, ci) => (
                  <motion.div
                    key={course.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.25 + gi * 0.1 + ci * 0.04, ease }}
                    style={{ width: "100%" }}
                  >
                    {isMobile ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={expanded === course.name}
                          className="font-body"
                          style={{
                            fontSize: "0.93rem",
                            color: expanded === course.name ? "var(--mint)" : "var(--secondary)",
                            lineHeight: 1.5,
                            cursor: "pointer",
                            userSelect: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            background: "none",
                            border: "none",
                            padding: 0,
                            textAlign: "left",
                          }}
                          onClick={() => setExpanded(expanded === course.name ? null : course.name)}
                        >
                          <span>{course.name}</span>
                          <span style={{ fontSize: "0.6rem", color: "var(--secondary)", flexShrink: 0, marginLeft: "12px" }}>
                            {expanded === course.name ? "▲" : "▼"}
                          </span>
                        </button>
                        <AnimatePresence>
                          {expanded === course.name && <CourseAccordionContent course={course} />}
                        </AnimatePresence>
                      </>
                    ) : (
                      <span
                        className="font-body"
                        style={{
                          fontSize: "0.93rem",
                          color: "var(--secondary)",
                          lineHeight: 1.5,
                          cursor: "default",
                          userSelect: "none",
                          display: "inline",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.color = "var(--mint)";
                          setCard({ course, rect: el.getBoundingClientRect() });
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "var(--secondary)";
                          setCard(null);
                        }}
                      >
                        {course.name}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease }}
          style={{ marginTop: "3rem" }}
        >
          <div style={{ borderTop: "1px solid var(--border)", marginBottom: "2rem" }} />

          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              className="font-display"
              style={{
                fontSize: "clamp(1.2rem, 5vw, 1.6rem)",
                fontWeight: 400,
                color: "var(--primary)",
                letterSpacing: "-0.01em",
                marginBottom: "0.35rem",
              }}
            >
              {highSchool.school}
            </h3>
            <p className="font-body" style={{ fontSize: "1.02rem", color: "var(--secondary)" }}>
              {highSchool.period}
            </p>
          </div>

          {highSchool.coursework.map((group, gi) => (
            <div key={group.area} style={{ marginBottom: "1rem" }}>
              <p
                className="section-label"
                style={{ borderLeft: "2px solid var(--mint)", paddingLeft: "10px", marginBottom: "1rem" }}
              >
                {group.area}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", alignItems: "flex-start", width: "100%" }}>
                {group.courses.map((course, ci) => (
                  <motion.div
                    key={course.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.45 + gi * 0.1 + ci * 0.04, ease }}
                    style={{ width: "100%" }}
                  >
                    {isMobile ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={expanded === course.name}
                          className="font-body"
                          style={{
                            fontSize: "0.93rem",
                            color: expanded === course.name ? "var(--mint)" : "var(--secondary)",
                            lineHeight: 1.5,
                            cursor: "pointer",
                            userSelect: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            background: "none",
                            border: "none",
                            padding: 0,
                            textAlign: "left",
                          }}
                          onClick={() => setExpanded(expanded === course.name ? null : course.name)}
                        >
                          <span>{course.name}</span>
                          <span style={{ fontSize: "0.6rem", color: "var(--secondary)", flexShrink: 0, marginLeft: "12px" }}>
                            {expanded === course.name ? "▲" : "▼"}
                          </span>
                        </button>
                        <AnimatePresence>
                          {expanded === course.name && <CourseAccordionContent course={course} />}
                        </AnimatePresence>
                      </>
                    ) : (
                      <span
                        className="font-body"
                        style={{
                          fontSize: "0.93rem",
                          color: "var(--secondary)",
                          lineHeight: 1.5,
                          cursor: "default",
                          userSelect: "none",
                          display: "inline",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.color = "var(--mint)";
                          setCard({ course, rect: el.getBoundingClientRect() });
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "var(--secondary)";
                          setCard(null);
                        }}
                      >
                        {course.name}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.45 } : {}}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="section-label"
          style={{ marginTop: "2rem" }}
        >
          {isMobile ? "Tap any course to explore" : "Hover any course to explore"}
        </motion.p>
      </div>
    </section>
  );
}
