import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404: Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 className="font-display" style={{ fontSize: "clamp(3rem, 8vw, 5rem)", fontWeight: 400, color: "var(--primary)" }}>
        404
      </h1>
      <p className="font-body" style={{ fontSize: "1.1rem", color: "var(--secondary)" }}>
        This page could not be found.
      </p>
      <a href="/" className="font-body text-sm px-5 py-2.5 border notfound-btn">
        Back home
      </a>
    </main>
  );
}
