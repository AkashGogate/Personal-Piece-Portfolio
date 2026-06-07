"use client";

const BASE = process.env.NEXT_PUBLIC_BASEPATH ?? "";

export default function ResumeViewer() {
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
          style={{
            fontSize: "0.8rem",
            letterSpacing: "0.06em",
            color: "var(--secondary)",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--mint)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--secondary)";
          }}
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
          href={`${BASE}/resumes/Akash%20Gogate%20Resume.pdf`}
          download="Akash Gogate Resume.pdf"
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
          padding: "2rem 1.5rem",
          display: "flex",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <embed
          src={`${BASE}/resumes/Akash%20Gogate%20Resume.pdf#toolbar=0&navpanes=0&scrollbar=0`}
          type="application/pdf"
          style={{
            width: "100%",
            maxWidth: "860px",
            height: "calc(100vh - 120px)",
            border: "1px solid var(--border)",
          }}
        />
      </div>
    </main>
  );
}
