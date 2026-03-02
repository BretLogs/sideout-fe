"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

type Props = { fallbackImage: string };

export function HeroVideo({ fallbackImage }: Props) {
  const [useFallback, setUseFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = () => setUseFallback(true);

    const handleCanPlay = () => {
      video.play().catch(() => setUseFallback(true));
    };

    const timeout = window.setTimeout(() => {
      if (video.readyState < 2) setUseFallback(true);
    }, 4000);

    video.addEventListener("error", handleError);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplay", handleCanPlay);
      window.clearTimeout(timeout);
    };
  }, []);

  if (useFallback) {
    return (
      <>
        <div className="absolute inset-0">
          <Image
            src={fallbackImage}
            alt=""
            fill
            className="object-cover opacity-25"
            sizes="100vw"
            priority
            aria-hidden
          />
        </div>
        <div className="absolute inset-0 bg-sideout-green/85" />
      </>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={fallbackImage}
        className="absolute inset-0 h-full w-full object-cover opacity-25"
        aria-hidden
        onError={() => setUseFallback(true)}
      >
        <source src="/assets/videos/sideout_video.mp4" type="video/mp4" />
        <source src="/assets/videos/sideout_video.mov" type="video/quicktime" />
      </video>
      <div className="absolute inset-0 bg-sideout-green/85" />
    </>
  );
}
