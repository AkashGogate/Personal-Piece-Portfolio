"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface Props {
  imageSrc: string;
  title: string;
  id?: string;
  children?: ReactNode;
}

export default function ScrollExpandMedia({ imageSrc, title, id, children }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const update = () => {
      const el = outerRef.current;
      if (!el) return;
      const scrolled = -el.getBoundingClientRect().top;
      const scrollable = el.offsetHeight - window.innerHeight;
      setProgress(Math.min(Math.max(scrolled / scrollable, 0), 1));
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const [word1, ...rest] = title.split(" ");
  const remaining = rest.join(" ");
  const shift = isMobile ? "0vw" : `${progress * 18}vw`;
  const titleOpacity = Math.max(0, 1 - progress * 1.85);
  const cardWidth = isMobile ? `${65 + progress * 27}vw` : `${15 + progress * 80}vw`;
  const cardHeight = isMobile ? `${42 + progress * 40}vh` : `${35 + progress * 50}vh`;

  // Always light text — image overlay is always a dark context regardless of page theme
  const textColor = "#f0f0ee";
  const bgOverlay = isDark ? "rgba(14,14,14,0.62)" : "rgba(14,14,14,0.38)";
  const cardOverlay = isDark
    ? "linear-gradient(to top, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.55) 50%, rgba(8,8,8,0.18) 100%)"
    : "linear-gradient(to top, rgba(8,8,8,0.88) 0%, rgba(8,8,8,0.45) 50%, rgba(8,8,8,0.12) 100%)";
  const bottomGradient = isDark
    ? "linear-gradient(to top, rgba(8,8,8,0.97) 0%, rgba(8,8,8,0.82) 40%, rgba(8,8,8,0.3) 70%, transparent 100%)"
    : "linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.68) 40%, rgba(8,8,8,0.22) 70%, transparent 100%)";

  return (
    <div ref={outerRef} id={id} style={{ height: "250vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: Math.max(0, 1 - progress * 1.4) }}
          transition={{ duration: 0 }}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_BASEPATH ?? ""}${imageSrc}`}
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover", filter: "blur(8px)", transform: "scale(1.08)" }}
            priority
          />
          <div style={{ position: "absolute", inset: 0, background: bgOverlay }} />
        </motion.div>

        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
          <div style={{
            width: cardWidth,
            height: cardHeight,
            maxWidth: "92vw",
            maxHeight: "82vh",
            position: "relative",
            borderRadius: `${12 - progress * 10}px`,
            overflow: "hidden",
            boxShadow: `0 0 ${40 + progress * 60}px rgba(0,0,0,0.5)`,
          }}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASEPATH ?? ""}${imageSrc}`}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 92vw, 95vw"
              style={{ objectFit: "cover", filter: isDark ? "none" : "saturate(0.92)" }}
            />
            <div style={{ position: "absolute", inset: 0, background: cardOverlay }} />
            <motion.div
              animate={{ opacity: progress > 0.82 ? 1 : 0, y: progress > 0.82 ? 0 : 16 }}
              transition={{ duration: progress > 0.82 ? 0.5 : 0 }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 3,
                padding: "clamp(1rem, 3vh, 2rem) clamp(1.5rem, 6vw, 5rem)",
                background: bottomGradient,
              }}
            >
              {children}
            </motion.div>
          </div>
        </div>

        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2, pointerEvents: "none", opacity: titleOpacity }}>
          <span
            className="font-display"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 400, color: textColor, letterSpacing: "-0.02em", lineHeight: 1.1, transform: `translateX(-${shift})`, display: "block" }}
          >
            {word1}
          </span>
          {remaining && (
            <span
              className="font-display"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 400, color: textColor, letterSpacing: "-0.02em", lineHeight: 1.1, transform: `translateX(${shift})`, display: "block" }}
            >
              {remaining}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
