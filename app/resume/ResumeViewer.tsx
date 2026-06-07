"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("./PdfViewer"), { ssr: false });

const BASE = process.env.NEXT_PUBLIC_BASEPATH ?? "";
const PDF = `${BASE}/resumes/Gogate%20Akash%20Resum%C3%A9.pdf`;

export default function ResumeViewer() {
  const [isMobile, setIsMobile] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <main
      style={{
        background: "var(--bg)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "0 1.5rem",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--surface)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <a
          href={`${BASE}/`}
          className="font-body"
          style={{ fontSize: "0.8rem", letterSpacing: "0.06em", color: "var(--secondary)", textDecoration: "none" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--mint)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--secondary)"; }}
        >
          ← Akash Gogate
        </a>

        <span
          className="font-display"
          style={{
            fontSize: "1rem",
            fontWeight: 400,
            color: "var(--primary)",
            letterSpacing: "-0.01em",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Resume
        </span>

        <a
          href={PDF}
          download="Gogate Akash Resumé.pdf"
          className="font-body"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--secondary)",
            border: "1px solid var(--border)",
            padding: "0.4rem 0.9rem",
            textDecoration: "none",
          }}
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
          Download
        </a>
      </header>

      <div
        style={{
          flex: 1,
          padding: isMobile ? "3rem 1.5rem" : "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: isMobile || pdfError ? "center" : "flex-start",
          background: "var(--bg)",
        }}
      >
        {isMobile || pdfError ? (
          <div style={{ textAlign: "center", maxWidth: "420px" }}>
            <p className="section-label" style={{ marginBottom: "1rem" }}>Resume</p>
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 400,
                color: "var(--primary)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                marginBottom: "1rem",
              }}
            >
              Akash Gogate
            </h1>
            <p
              className="font-body"
              style={{ fontSize: "0.95rem", color: "var(--secondary)", lineHeight: 1.75, marginBottom: "2.5rem" }}
            >
              Software Engineer · Researcher · AI / ML · Data
            </p>
            <a
              href={PDF}
              download="Gogate Akash Resumé.pdf"
              className="font-body"
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--primary)",
                background: "var(--mint)",
                padding: "0.85rem 2.5rem",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              Download Resume
            </a>
          </div>
        ) : (
          <>
            <PdfViewer src={PDF} onError={() => setPdfError(true)} />
            <p className="font-body" style={{ marginTop: "1.5rem", fontSize: "0.8rem", color: "var(--secondary)" }}>
              <a
                href={PDF}
                download="Gogate Akash Resumé.pdf"
                style={{ color: "var(--mint)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >
                Download PDF
              </a>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
