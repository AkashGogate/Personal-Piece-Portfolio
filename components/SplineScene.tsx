"use client";

import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

interface Props {
  scene: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SplineScene({ scene, className, style }: Props) {
  return (
    <Suspense fallback={null}>
      <Spline scene={scene} className={className} style={style} />
    </Suspense>
  );
}
