"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import { playBallSettle } from "./stampAnimation";

const STAMP_SLOTS = 9;
const MATCH_POINT_SLOT = 10;

export type StampGridHandle = {
  getSlotElement: (slot: number) => HTMLDivElement | null;
};

type StampGridProps = {
  filledCount: number;
  compact?: boolean;
  hoveringSlot?: number | null;
};

export const StampGrid = forwardRef<StampGridHandle, StampGridProps>(
  function StampGrid({ filledCount, compact = false, hoveringSlot = null }, ref) {
    const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
    const ballRefs = useRef<(HTMLImageElement | null)[]>([]);
    const hoverCleanupRef = useRef<(() => void) | null>(null);

    useImperativeHandle(ref, () => ({
      getSlotElement: (slot: number) => slotRefs.current[slot - 1] ?? null,
    }));

    useEffect(() => {
      hoverCleanupRef.current?.();
      hoverCleanupRef.current = null;

      if (!hoveringSlot) return;

      const ballEl = ballRefs.current[hoveringSlot - 1];
      if (!ballEl) return;

      gsap.set(ballEl, { clearProps: "transform" });
      hoverCleanupRef.current = playBallSettle(ballEl);

      return () => {
        hoverCleanupRef.current?.();
        hoverCleanupRef.current = null;
      };
    }, [hoveringSlot, filledCount]);

    return (
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: STAMP_SLOTS }, (_, i) => {
          const slot = i + 1;
          const isFilled = slot <= filledCount;

          return (
            <div
              key={slot}
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
              data-stamp-slot={slot}
              className="flex aspect-square items-center justify-center rounded-md bg-sideout-green"
            >
              {isFilled ? (
                <Image
                  ref={(el) => {
                    ballRefs.current[i] = el;
                  }}
                  src="/assets/svg/sideout_ball.svg"
                  alt=""
                  width={compact ? 20 : 28}
                  height={compact ? 20 : 28}
                  className={`h-auto w-[55%] ${compact ? "max-w-[20px]" : "max-w-[28px]"}`}
                />
              ) : (
                <span className="text-xl font-medium text-sideout-cream">
                  {slot}
                </span>
              )}
            </div>
          );
        })}
        <div
          key={MATCH_POINT_SLOT}
          className="flex aspect-square items-center justify-center rounded-md bg-sideout-green px-0.5"
        >
          <span className="text-center text-[8px] font-medium uppercase leading-tight tracking-wide text-sideout-cream">
            MATCH
            <br />
            POINT
          </span>
        </div>
      </div>
    );
  },
);
