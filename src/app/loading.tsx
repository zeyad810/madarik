import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-purple-50/60 via-white to-purple-50/40 backdrop-blur-sm select-none"
    >
      <div className="relative flex flex-col items-center justify-center gap-6 p-8">
        {/* Animated Glow Backdrop */}
        <div className="absolute size-40 bg-mad-main/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

        {/* Logo and Dual Spinner Container */}
        <div className="relative flex items-center justify-center size-28">
          {/* Outer Glowing Gradient Spinner Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-mad-main border-r-mad-main/80 animate-spin shadow-lg shadow-purple-500/10" />

          {/* Inner Counter-Rotating Accent Ring */}
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-400 border-l-purple-300 animate-[spin_2s_linear_infinite_reverse]" />

          {/* Center Logo with Pulse */}
          <div className="relative size-16 flex items-center justify-center bg-white rounded-full p-2.5 shadow-md animate-pulse">
            <Image
              src="/logo.png"
              alt="مدارك"
              width={56}
              height={56}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Loading Text and Animated Dots */}
        <div className="flex flex-col items-center gap-2 text-center z-10">
          <h2 className="text-xl font-bold text-mad-main tracking-wide">
            مدارك القراءة
          </h2>
          <div className="flex items-center gap-1 text-gray-500 text-sm font-medium">
            <span>جاري التحميل</span>
            <span className="flex gap-1 items-center">
              <span className="size-1.5 bg-mad-main rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="size-1.5 bg-mad-main rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="size-1.5 bg-mad-main rounded-full animate-bounce" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
