"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

const SEQUENCES = [
  // DNA codons
  "ATG·GCC·TAA", "CGT·AAC·GGT", "TGC·ATG·CGA",
  "ATCGATCG", "GCTAGCTA", "TTAGCTAG",
  // Amino acid codes
  "Met-Ala-Gly", "Leu-Val-Ile", "Ser-Thr-Cys",
  "MKTLL", "GLYPH", "AVPFR",
  // Binary → ATCG (A=00 T=01 C=10 G=11)
  "00 01 10 11", "11 00 01 10", "01 11 00 10",
  // Bioinformatics / bio-code
  "align(query,ref)", "fold(sequence)",
  "parseGenome()", "k-mer(6)",
  "if(codon==STOP)", "DNA→RNA→Prot",
  "BLAST·HMMER", "CRISPR·Cas9",
  "Σ(edit_dist)", "O(n log n)",
  // Short numeric sequences
  "3.14·2.71·1.41", "1·1·2·3·5·8",
];

interface Stream {
  id: number;
  x: number;
  str: string;
  duration: number;
  delay: number;
  opacity: number;
  size: number;
}

export default function HeroBioCode() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    setStreams(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: 5 + Math.random() * 90,
        str: SEQUENCES[Math.floor(Math.random() * SEQUENCES.length)],
        duration: 14 + Math.random() * 12,
        delay: -(Math.random() * 20),
        opacity: 0.055 + Math.random() * 0.07,
        size: 8 + Math.random() * 5,
      }))
    );
  }, []);

  const color = theme === "dark" ? "var(--mint)" : "var(--secondary)";

  return (
    <div
      style={{
        position: "absolute", inset: 0,
        overflow: "hidden", pointerEvents: "none", zIndex: 1,
      }}
    >
      {streams.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            bottom: "-1.5rem",
            fontFamily: "monospace",
            fontSize: `${s.size}px`,
            color,
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
            ["--bio-op" as string]: s.opacity,
            animation: `bioFloat ${s.duration}s ${s.delay}s linear infinite`,
          }}
        >
          {s.str}
        </div>
      ))}
    </div>
  );
}
