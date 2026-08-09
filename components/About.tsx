"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { animate } from "animejs";
import SectionLabel from "./SectionLabel";

const ease = [0.19, 1, 0.22, 1] as [number, number, number, number];

const bio = [
  "I'm a CS + Biology student at UW-Madison, graduating in May 2028. Right now I'm building LLM agent pipelines for spatial transcriptomics research at the Kendziorski Lab, and my industry experience has been in backend infrastructure and distributed systems at Leidos.",
  "I grew up in Princeton, NJ, where I spent a lot of time on tennis courts (still do). I've coached players, organized tournaments, and built a racket stringing business out of it. That's where I learned that most interesting problems look messier up close than from a distance, and that knowing the fundamentals is what lets you improvise when things go sideways.",
  "I'm drawn to work where the technical depth actually matters. Not as a marker of seniority, but because the problem just doesn't yield without it.",
  "The goal is to build things that couldn't exist without both solid engineering and thoughtful design, where getting the craft right is the only way through. That intersection is where the most interesting problems are, and where I want to spend my career.",
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });

  useEffect(() => {
    if (!lineRef.current) return;
    if (inView) {
      animate(lineRef.current, { scaleY: [0, 1], duration: 700, ease: "outCubic", delay: 200 });
    } else {
      lineRef.current.style.transform = "scaleY(0)";
    }
  }, [inView]);

  return (
    <section id="about" ref={ref} style={{ background: "var(--bg)", position: "relative", overflow: "hidden", paddingTop: "clamp(3rem, 6vh, 6rem)", paddingBottom: "clamp(3rem, 6vh, 6rem)" }}>
      <div className="max-w-7xl mx-auto px-6" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="mb-12"
        >
          <SectionLabel number="01" label="About" className="mb-4" />
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2.1rem, 3.5vw, 3.2rem)",
              fontWeight: 400,
              color: "var(--primary)",
            }}
          >
            Hi, I&apos;m Akash.
          </h2>
        </motion.div>

        <div className="flex gap-8" style={{ maxWidth: "52rem" }}>
          <div
            ref={lineRef}
            className="hidden md:block flex-shrink-0 w-px self-stretch"
            style={{ background: "var(--border)", transform: "scaleY(0)", transformOrigin: "top center" }}
          />
          <div className="flex-1 space-y-8">
            {bio.map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease }}
                className="font-body"
                style={{ fontSize: "1rem", color: "var(--secondary)", lineHeight: 1.8 }}
              >
                {text}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.38, ease }}
              className="font-body"
              style={{ fontSize: "1.1rem", color: "var(--secondary)", letterSpacing: "0.02em" }}
            >
              3.8 GPA · Dean&apos;s List · CS + Biology, UW-Madison · Graduating May 2028 ·{" "}
              <span style={{ color: "var(--primary)", fontWeight: 500 }}>Open to Summer 2027 internships & co-ops</span>
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
