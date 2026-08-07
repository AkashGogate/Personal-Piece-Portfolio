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
        padding: "2.25rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "1.75rem",
        background: "var(--bg)",
      }}
    >
      {item.imageSrc && (
        <div style={{ position: "relative", width: "clamp(140px, 34%, 230px)", flex: "0 0 auto", aspectRatio: "1 / 1", overflow: "hidden", alignSelf: "center" }}>
          <Image src={`${BASE}${item.imageSrc}`} alt={item.title} fill style={{ objectFit: "cover" }} />
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: "1 1 240px", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <span
            className="font-body"
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--primary)",
              background: "var(--mint)",
              padding: "5px 12px",
            }}
          >
            {item.result}
          </span>
          <span className="font-body" style={{ fontSize: "0.92rem", color: "var(--secondary)" }}>
            {item.period}
          </span>
        </div>

        <div>
          <h3 className="font-display" style={{ fontSize: "1.8rem", fontWeight: 400, color: "var(--primary)", letterSpacing: "-0.02em" }}>
            {item.title}
          </h3>
          <p className="font-body" style={{ fontSize: "1rem", color: "var(--secondary)", marginTop: "0.25rem" }}>
            {item.organization}
          </p>
        </div>

        <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {item.bullets.map((bullet, i) => (
            <li key={i} className="font-body" style={{ fontSize: "1.1rem", color: "var(--secondary)", lineHeight: 1.7, paddingLeft: "1.4rem", position: "relative" }}>
              <span style={{ position: "absolute", left: 0, top: 0, color: "var(--mint)" }}>—</span>
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
                  style={{ fontSize: "0.82rem", color: "var(--secondary)", border: "1px solid var(--border)", padding: "3px 10px" }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="font-body" style={{ fontSize: "0.8rem", letterSpacing: "0.05em", color: "var(--secondary)" }}>
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
      style={{ background: "var(--surface)", position: "relative", overflow: "hidden", paddingTop: "clamp(4rem, 7vh, 7rem)", paddingBottom: "clamp(4rem, 7vh, 7rem)" }}
    >
      <div className="max-w-7xl mx-auto px-6" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="mb-10"
        >
          <SectionLabel number="06" label="Accomplishments" className="mb-4" />
          <h2 className="font-display" style={{ fontSize: "clamp(2.4rem, 4vw, 3.6rem)", fontWeight: 400, color: "var(--primary)" }}>
            Recognition along the way.
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem" }}>
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
