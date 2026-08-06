"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import SectionLabel from "./SectionLabel";
import { accomplishments } from "@/data/resume";
import { doNavigate } from "@/lib/navigate";

const BASE = process.env.NEXT_PUBLIC_BASEPATH ?? "";
const ease = [0.19, 1, 0.22, 1] as [number, number, number, number];

function AccomplishmentCard({ item }: { item: (typeof accomplishments)[number] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: "1px solid",
        borderColor: hovered ? "var(--mint)" : "var(--border)",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        background: "var(--bg)",
      }}
    >
      {item.imageSrc && (
        <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", overflow: "hidden" }}>
          <Image src={`${BASE}${item.imageSrc}`} alt={item.title} fill style={{ objectFit: "cover" }} />
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <span
          className="font-body"
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--primary)",
            background: "var(--mint)",
            padding: "4px 10px",
          }}
        >
          {item.result}
        </span>
        <span className="font-body" style={{ fontSize: "0.8rem", color: "var(--secondary)" }}>
          {item.period}
        </span>
      </div>

      <div>
        <h3 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 400, color: "var(--primary)", letterSpacing: "-0.02em" }}>
          {item.title}
        </h3>
        <p className="font-body" style={{ fontSize: "0.85rem", color: "var(--secondary)", marginTop: "0.25rem" }}>
          {item.organization}
        </p>
      </div>

      <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {item.bullets.map((bullet, i) => (
          <li key={i} className="font-body" style={{ fontSize: "0.92rem", color: "var(--secondary)", lineHeight: 1.7, paddingLeft: "1rem", position: "relative" }}>
            <span style={{ position: "absolute", left: 0, color: "var(--mint)" }}>—</span>
            {bullet}
          </li>
        ))}
      </ul>

      {item.tags && item.tags.length > 0 && (
        <div style={{ marginTop: "0.25rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.6rem" }}>
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="font-body"
                style={{ fontSize: "0.72rem", color: "var(--secondary)", border: "1px solid var(--border)", padding: "2px 9px" }}
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="font-body" style={{ fontSize: "0.7rem", letterSpacing: "0.05em", color: "var(--secondary)" }}>
            Want to know more about these? See the{" "}
            <a
              href="#skills"
              style={{ textDecoration: "underline", color: "var(--primary)" }}
              onClick={(e) => { e.preventDefault(); doNavigate("#skills"); }}
            >
              Skills
            </a>{" "}
            section ↗
          </p>
        </div>
      )}
    </div>
  );
}

export default function Accomplishments() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section
      id="accomplishments"
      ref={ref}
      style={{ background: "var(--surface)", position: "relative", overflow: "hidden", paddingTop: "clamp(3rem, 6vh, 6rem)", paddingBottom: "clamp(3rem, 6vh, 6rem)" }}
    >
      <div className="max-w-7xl mx-auto px-6" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="mb-10"
        >
          <SectionLabel number="06" label="Accomplishments" className="mb-4" />
          <h2 className="font-display" style={{ fontSize: "clamp(2.1rem, 3.5vw, 3.2rem)", fontWeight: 400, color: "var(--primary)" }}>
            Recognition along the way.
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {accomplishments.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease }}
            >
              <AccomplishmentCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
