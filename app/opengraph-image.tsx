import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Akash Gogate — Software Engineer & Researcher";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0e0e0e",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#52b788", marginBottom: 24 }}>
          Software Engineer &amp; Researcher
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 600, color: "#f0f0ee" }}>
          Akash Gogate
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#8a8a8a", marginTop: 28, maxWidth: 900 }}>
          CS + Biology @ UW-Madison — distributed systems &amp; biological data science
        </div>
      </div>
    ),
    { ...size }
  );
}
