"use client";

import { useEffect, useState } from "react";
import { createTimeline, stagger } from "animejs";
import { doNavigate } from "@/lib/navigate";

const BASE = process.env.NEXT_PUBLIC_BASEPATH ?? "";
import HeroCanvas from "./HeroCanvas";

const LABEL = "Software Engineer · Researcher · AI / ML · Data";

export default function Hero() {
  const [typed, setTyped] = useState("");
  const [typeDone, setTypeDone] = useState(false);

  useEffect(() => {
    const tl = createTimeline({ defaults: { ease: "outCubic", duration: 500 } });
    tl.add(".hero-name", { opacity: [0, 1], translateY: [16, 0], duration: 400 })
      .add(".hero-label", { opacity: [0, 1], translateY: [20, 0] }, "-=200")
      .add(".hero-word", { opacity: [0, 1], translateY: [12, 0], delay: stagger(45), duration: 380 }, "-=300")
      .add(".hero-divider", { scaleX: [0, 1], ease: "inOutQuart", duration: 700 }, "-=400")
      .add(".hero-body", { opacity: [0, 1], translateY: [20, 0] }, "-=500")
      .add(".hero-gh", { opacity: [0, 1], translateY: [12, 0] }, "-=300")
      .add(".hero-btn", { opacity: [0, 1], translateY: [20, 0], delay: stagger(80) }, "-=300");
  }, []);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(LABEL.slice(0, i));
      if (i === LABEL.length) { clearInterval(id); setTypeDone(true); }
    }, 55);
    return () => clearInterval(id);
  }, []);


  return (
    <section
      id="hero"
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ background: "var(--surface)", paddingTop: "3.5rem" }}
    >
      <HeroCanvas />

      <div className="max-w-7xl mx-auto px-6 w-full relative" style={{ paddingTop: "clamp(1.5rem, 4vh, 5rem)", paddingBottom: "clamp(1.5rem, 4vh, 5rem)" }}>
        <div className="flex-1 min-w-0">
        <p
          className="font-display hero-name"
          style={{
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            fontWeight: 500,
            color: "var(--primary)",
            letterSpacing: "-0.01em",
            marginBottom: "0.75rem",
            opacity: 0,
          }}
        >
          Akash Gogate
        </p>

        <div className="section-label mb-8 hero-label" style={{ opacity: 0, fontSize: "clamp(0.65rem, 2.5vw, 0.9rem)", letterSpacing: "0.08em" }}>
          {typed}
          <span className="cursor-blink" style={{ marginLeft: "1px", visibility: typeDone ? "hidden" : "visible" }}>|</span>
        </div>

        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2rem, 8vw, 5rem)",
            fontWeight: 400,
            color: "var(--primary)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            maxWidth: "18ch",
          }}
        >
          {"Exploring the space where systems think and biology inspires.".split(" ").map((word, i, arr) => (
            <span key={i} className="hero-word" style={{ display: "inline-block", opacity: 0, whiteSpace: "pre" }}>
              {word}{i < arr.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        <div
          className="hero-divider"
          style={{
            borderTop: "1px solid var(--border)",
            width: "6rem",
            margin: "2rem 0",
            transform: "scaleX(0)",
            transformOrigin: "left center",
          }}
        />

        <p
          className="font-body hero-body"
          style={{ fontSize: "1rem", color: "var(--secondary)", lineHeight: 1.75, opacity: 0, maxWidth: "36rem", marginBottom: "1rem" }}
        >
          From satellite scheduling at Leidos to LLM pipelines for cancer biology.
        </p>

        <p
          className="font-body hero-body"
          style={{ fontSize: "0.97rem", color: "var(--secondary)", lineHeight: 1.75, opacity: 0, maxWidth: "36rem", marginBottom: "1.5rem" }}
        >
          CS + Biology at UW-Madison | Computing for biology&apos;s next frontier.
        </p>

        <div className="hero-gh" style={{ opacity: 0, marginBottom: "1.75rem" }}>
          <div className="section-label mb-1">GitHub</div>
          <a
            href="https://github.com/AkashGogate"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body"
            style={{ fontSize: "0.9rem", color: "var(--primary)", textDecoration: "underline", textDecorationColor: "var(--border)", wordBreak: "break-all" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textDecorationColor = "var(--primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textDecorationColor = "var(--border)"; }}
          >
            github.com/AkashGogate ↗
          </a>
        </div>

        <div className="flex flex-wrap gap-4 items-start">
          <a
            href="#projects"
            className="font-body text-sm px-5 py-2.5 border hero-btn"
            style={{ borderColor: "var(--primary)", color: "var(--primary)", letterSpacing: "0.05em", opacity: 0 }}
            onClick={(e) => { e.preventDefault(); doNavigate("#projects"); }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "var(--mint)";
              el.style.borderColor = "var(--mint)";
              el.style.color = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.borderColor = "var(--primary)";
              el.style.color = "var(--primary)";
            }}
          >
            View Projects
          </a>

          <a
            href={`${BASE}/resume`}
            className="font-body text-sm px-5 py-2.5 border hero-btn"
            style={{ borderColor: "var(--border)", color: "var(--secondary)", letterSpacing: "0.05em", opacity: 0 }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--mint)";
              el.style.color = "var(--mint)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--border)";
              el.style.color = "var(--secondary)";
            }}
          >
            Resume
          </a>

          <a
            href="#contact"
            className="font-body text-sm px-5 py-2.5 border hero-btn"
            style={{ borderColor: "var(--border)", color: "var(--secondary)", letterSpacing: "0.05em", opacity: 0 }}
            onClick={(e) => { e.preventDefault(); doNavigate("#contact"); }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--mint)";
              el.style.color = "var(--mint)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--border)";
              el.style.color = "var(--secondary)";
            }}
          >
            Contact
          </a>
        </div>
        </div>

      </div>
    </section>
  );
}
