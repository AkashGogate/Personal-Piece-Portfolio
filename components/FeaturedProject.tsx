"use client";
import { projects } from "@/data/resume";
import ScrollExpandMedia from "./ScrollExpandMedia";
import { useTheme } from "./ThemeProvider";
import { doNavigate } from "@/lib/navigate";

const featured = (() => {
  const p = projects.find(p => p.id === "self-improving-agent");
  if (!p) throw new Error("Featured project 'self-improving-agent' not found in resume.ts");
  return p;
})();

export default function FeaturedProject() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Card sits on dark overlay regardless of theme — always use light values
  const bodyColor = isDark ? "#c0bbb4" : "#b8b3ac";
  const tagBorder = "rgba(255,255,255,0.18)";
  const tagColor = isDark ? "#8a8a8a" : "#9e9e9e";

  return (
    <ScrollExpandMedia id="featured-project" imageSrc={featured.imageSrc ?? "/images/projects/placeholder.jpg"} title={featured.title}>
      <div className="max-w-2xl">
        <span className="section-label" style={{ color: isDark ? "var(--mint)" : "#52b788", display: "block", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
          Featured Project
        </span>
        <p className="font-body" style={{ fontSize: "1.15rem", color: bodyColor, lineHeight: 1.8, marginBottom: "1rem" }}>
          {featured.detail}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
          {featured.tags.map(tag => (
            <a
              key={tag}
              href="#skills"
              className="font-body"
              style={{ fontSize: "0.67rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", border: `1px solid ${tagBorder}`, color: tagColor, cursor: "pointer", textDecoration: "none", transition: "color 0.2s, border-color 0.2s" }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); doNavigate("#skills"); }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "var(--mint)";
                el.style.borderColor = "var(--mint)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = tagColor;
                el.style.borderColor = tagBorder;
              }}
            >
              {tag}
            </a>
          ))}
        </div>
        {featured.github && (
          <a
            href={featured.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body inline-block"
            style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 22px", background: "var(--mint)", color: "#0f0f0f" }}
          >
            View on GitHub ↗
          </a>
        )}
      </div>
    </ScrollExpandMedia>
  );
}
