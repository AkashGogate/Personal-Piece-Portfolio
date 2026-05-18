"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionLabel from "./SectionLabel";

const ease = [0.19, 1, 0.22, 1] as [number, number, number, number];

const links = [
  { label: "Email", value: "akash.gogate@gmail.com", href: "mailto:akash.gogate@gmail.com" },
  { label: "UW–Madison", value: "agogate@wisc.edu", href: "mailto:agogate@wisc.edu" },
  { label: "GitHub", value: "AkashGogate", href: "https://github.com/AkashGogate" },
  { label: "LinkedIn", value: "akash-gogate-71bb81297", href: "https://www.linkedin.com/in/akash-gogate-71bb81297" },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section id="contact" ref={ref} style={{ background: "var(--bg)", position: "relative", overflow: "hidden", paddingTop: "clamp(3rem, 6vh, 6rem)", paddingBottom: "clamp(3rem, 6vh, 6rem)" }}>
      <div className="max-w-7xl mx-auto px-6" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ borderTop: "1px solid var(--border)", marginBottom: "4rem" }} />

        <div className="mb-4 overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{ duration: 0.7, ease }}
          >
            <SectionLabel number="06" label="Contact" className="mb-4" />
          </motion.div>
        </div>

        <div className="overflow-hidden mb-6">
          <motion.h2
            className="font-display"
            style={{
              fontSize: "clamp(2.1rem, 3.5vw, 3.2rem)",
              fontWeight: 400,
              color: "var(--primary)",
            }}
            initial={{ y: "100%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{ duration: 0.7, delay: 0.06, ease }}
          >
            Get in touch
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.18, ease }}
          className="font-body mb-8 max-w-xl"
          style={{ fontSize: "1rem", color: "var(--secondary)", lineHeight: 1.8 }}
        >
          Looking for Summer 2026 internships in software engineering or research. Email is
          the best way to reach me.
        </motion.p>

        <div className="space-y-6">
          {links.map((l, i) => (
            <motion.div
              key={l.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 24,
                delay: 0.22 + i * 0.07,
              }}
            >
              <div className="section-label mb-1">{l.label}</div>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body"
                style={{
                  fontSize: "1.1rem",
                  color: "var(--primary)",
                  textDecoration: "underline",
                  textDecorationColor: "var(--border)",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--mint)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--primary)"; }}
              >
                {l.value}
              </a>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-body"
            style={{ fontSize: "0.85rem", color: "var(--secondary)" }}
          >
            <span>Akash Gogate — {new Date().getFullYear()}</span>
            <span>Built with Next.js · Framer Motion · Tailwind CSS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
