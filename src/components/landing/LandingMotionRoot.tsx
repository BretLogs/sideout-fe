"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

import { initLandingMotion } from "./landingMotion";

type LandingMotionRootProps = {
  children: ReactNode;
};

export function LandingMotionRoot({ children }: LandingMotionRootProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return initLandingMotion(root);
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
