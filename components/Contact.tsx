"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import SectionLabel from "./SectionLabel";

const ease = [0.19, 1, 0.22, 1] as [number, number, number, number];

type LinkItem =
  | { id: string; label: string; value: string; isEmail: true; gmail: string; outlook: string }
  | { id: string; label: string; value: string; isEmail: false; href: string };

const links: LinkItem[] = [
  {
    id: "email",
    label: "Email",
    value: "akash.gogate@gmail.com",
    isEmail: true,
    gmail: "https://mail.google.com/mail/?view=cm&fs=1&to=akash.gogate@gmail.com",
    outlook: "https://outlook.live.com/mail/0/deeplink/compose?to=akash.gogate@gmail.com",
  },
  {
    id: "uw",
    label: "UW–Madison",
    value: "agogate@wisc.edu",
    isEmail: true,
    gmail: "https://mail.google.com/mail/?view=cm&fs=1&to=agogate@wisc.edu",
    outlook: "https://outlook.live.com/mail/0/deeplink/compose?to=agogate@wisc.edu",
  },
  { id: "github", label: "GitHub", value: "AkashGogate", isEmail: false, href: "https://github.com/AkashGogate" },
  { id: "linkedin", label: "LinkedIn", value: "akashgogate", isEmail: false, href: "https://www.linkedin.com/in/akashgogate" },
];

function EmailPicker({ link, onClose }: { link: Extract<LinkItem, { isEmail: true }>; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const options = [
    { label: "Open in Gmail", href: link.gmail },
    { label: "Open in Outlook", href: link.outlook },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.12 }}
      style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        left: 0,
        background: "var(--bg)",
        border: "1px solid var(--border)",
        zIndex: 20,
        minWidth: "180px",
      }}
    >
      {options.map((opt) => (
        <a
          key={opt.label}
          href={opt.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body block px-4 py-3"
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "var(--secondary)",
            borderBottom: "1px solid var(--border)",
            display: "block",
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
          onClick={onClose}
        >
          {opt.label}
        </a>
      ))}
    </motion.div>
  );
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const [pickerOpen, setPickerOpen] = useState<string | null>(null);

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
            style={{ fontSize: "clamp(2.1rem, 3.5vw, 3.2rem)", fontWeight: 400, color: "var(--primary)" }}
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
          Open to Summer 2027 internships and co-ops in software engineering, AI/ML, data science, biotech, and computational biology research. Available May 15 – Sep 1. Email is
          the best way to reach me.
        </motion.p>

        <div className="space-y-6">
          {links.map((l, i) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.22 + i * 0.07 }}
            >
              <div className="section-label mb-1">{l.label}</div>

              {l.isEmail ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <button
                    type="button"
                    aria-expanded={pickerOpen === l.id}
                    aria-haspopup="true"
                    className="font-body"
                    style={{
                      fontSize: "1.1rem",
                      color: pickerOpen === l.id ? "var(--mint)" : "var(--primary)",
                      textDecoration: "underline",
                      textDecorationColor: pickerOpen === l.id ? "var(--mint)" : "var(--border)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    onClick={() => setPickerOpen(pickerOpen === l.id ? null : l.id)}
                    onMouseEnter={(e) => {
                      if (pickerOpen === l.id) return;
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = "var(--mint)";
                      el.style.textDecorationColor = "var(--mint)";
                    }}
                    onMouseLeave={(e) => {
                      if (pickerOpen === l.id) return;
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = "var(--primary)";
                      el.style.textDecorationColor = "var(--border)";
                    }}
                  >
                    {l.value} ↓
                  </button>
                  {pickerOpen === l.id && (
                    <EmailPicker link={l} onClose={() => setPickerOpen(null)} />
                  )}
                </div>
              ) : (
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body"
                  style={{ fontSize: "1.1rem", color: "var(--primary)", textDecoration: "underline", textDecorationColor: "var(--border)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--mint)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--primary)"; }}
                >
                  {l.value}
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-body"
            style={{ fontSize: "0.85rem", color: "var(--secondary)" }}
          >
            <span suppressHydrationWarning>Akash Gogate — {new Date().getFullYear()}</span>
            <span>Built with Next.js · Framer Motion · Tailwind CSS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
