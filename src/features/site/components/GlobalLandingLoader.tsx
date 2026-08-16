"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePublicLanding } from "../hooks/usePublicLanding";

interface GlobalLandingLoaderProps {
  /** Optional minimum display time in ms to avoid rapid flashing */
  minDisplayTimeMs?: number;
  /** Max timeout in ms to dismiss loader in case of network issues */
  maxTimeoutMs?: number;
}

export const GlobalLandingLoader: React.FC<GlobalLandingLoaderProps> = ({
  minDisplayTimeMs = 500,
  maxTimeoutMs = 6000,
}) => {
  const { data, isLoading, isError } = usePublicLanding();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [isRendered, setIsRendered] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const heroReady = Boolean(data?.data?.hero_banner);

  // Minimum time display timer
  useEffect(() => {
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minDisplayTimeMs);

    const maxTimer = setTimeout(() => {
      setTimedOut(true);
    }, maxTimeoutMs);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [minDisplayTimeMs, maxTimeoutMs]);

  // Determine when loading is done
  const shouldDismiss = (heroReady || !isLoading || isError || timedOut) && minTimeElapsed;

  useEffect(() => {
    if (shouldDismiss) {
      setIsFadingOut(true);
      const removeTimer = setTimeout(() => {
        setIsRendered(false);
      }, 700); // match transition duration

      return () => clearTimeout(removeTimer);
    }
  }, [shouldDismiss]);

  // Lock body scroll while loader is active
  useEffect(() => {
    if (isRendered && !isFadingOut) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isRendered, isFadingOut]);

  if (!isRendered) return null;

  return (
    <div
      role="status"
      aria-label="جاري تحميل الصفحة"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md transition-all duration-700 ease-out select-none ${
        isFadingOut
          ? "opacity-0 pointer-events-none scale-105"
          : "opacity-100 pointer-events-auto scale-100"
      }`}
      dir="rtl"
    >
      {/* Subtle glowing ambient background orbs */}
      <div className="absolute w-72 h-72 rounded-full bg-purple-200/40 blur-3xl -top-10 -right-10 pointer-events-none animate-pulse" />
      <div className="absolute w-72 h-72 rounded-full bg-teal-200/30 blur-3xl -bottom-10 -left-10 pointer-events-none animate-pulse" />

      {/* Main Loader Content Container */}
      <div className="relative flex flex-col items-center justify-center gap-6 px-6 z-10">
        {/* Animated Logo Container with glowing ring */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing glow ring */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#6d28d9]/20 via-[#8b5cf6]/20 to-[#14b8a6]/20 blur-lg animate-pulse" />

          {/* Rotating gradient border ring */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-transparent border-t-[#6d28d9] border-r-[#8b5cf6] border-b-[#14b8a6] animate-spin flex items-center justify-center p-1.5 shadow-md">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner" />
          </div>

          {/* Centered Logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Image
              src="/logo- 1.png"
              alt="شعار مدارك"
              width={75}
              height={75}
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain animate-bounce"
              style={{ animationDuration: "2s" }}
              priority
            />
          </div>
        </div>

        {/* Text & Progress Indicator */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <div className="flex items-center gap-1.5">
            <span className="text-lg sm:text-xl font-bold text-mad-text-primary tracking-tight font-sans">
              منصة مدارك
            </span>
            <span className="flex gap-1 items-center mr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6d28d9] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-bounce" />
            </span>
          </div>

          <p className="text-xs sm:text-sm text-mad-text-secondary font-medium">
            جاري تحضير المحتوى والتجارب المميزة...
          </p>

          {/* Modern Slim Gradient Progress Bar */}
          <div className="w-48 sm:w-56 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2 relative">
            <div className="h-full w-full bg-gradient-to-r from-[#6d28d9] via-[#8b5cf6] to-[#14b8a6] rounded-full animate-loader-progress" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLandingLoader;
