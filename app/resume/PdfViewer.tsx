"use client";

import { useEffect, useRef } from "react";
import * as pdfjs from "pdfjs-dist";

const BASE = process.env.NEXT_PUBLIC_BASEPATH ?? "";

interface Props {
  src: string;
  onError?: () => void;
}

export default function PdfViewer({ src, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `${BASE}/pdf.worker.min.mjs`;

    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    (async () => {
      try {
        const pdf = await pdfjs.getDocument({ url: src }).promise;
        if (cancelled) return;

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;

          const page = await pdf.getPage(i);
          const scale = (window.devicePixelRatio || 1) * 1.5;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.display = "block";
          canvas.style.width = "100%";

          const wrapper = document.createElement("div");
          wrapper.style.border = "1px solid var(--border)";
          wrapper.style.overflow = "hidden";
          if (i < pdf.numPages) wrapper.style.marginBottom = "8px";
          wrapper.appendChild(canvas);
          container.appendChild(wrapper);

          await page.render({ canvas, viewport }).promise;
        }
      } catch {
        onError?.();
      }
    })();

    return () => {
      cancelled = true;
      if (container) container.innerHTML = "";
    };
  }, [src, onError]);

  return <div ref={containerRef} style={{ width: "100%", maxWidth: "860px" }} />;
}
