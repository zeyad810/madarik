import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  textColor?: string;
  showSubtitle?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  textColor = "text-white",
  showSubtitle = false,
}) => {
  return (
    <Link
      href="/"
      className={`inline-flex flex-col items-center justify-center group shrink-0 transition-opacity hover:opacity-90 ${className}`}
    >
      {/* Emblem SVG */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 64 64"
          className="w-10 h-10 sm:w-11 sm:h-11 text-white fill-none stroke-current"
          aria-hidden="true"
        >
          {/* Dashed outer orbit circle */}
          <circle
            cx="32"
            cy="32"
            r="26"
            stroke="white"
            strokeWidth="2.2"
            strokeDasharray="4 3.5"
          />
          {/* Inner crescent / open book shape */}
          <path
            d="M18 39 Q 32 23, 46 39 Q 32 45, 18 39 Z"
            fill="white"
            stroke="none"
          />
          {/* Center line */}
          <path
            d="M32 16 L32 37"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <span
        className={`text-xs sm:text-sm font-bold tracking-tight mt-0.5 whitespace-nowrap ${textColor}`}
      >
        مدارك القراءة
      </span>

      {showSubtitle && (
        <span className="text-[10px] text-white/80 font-normal mt-0.5">
          منصة تعليمية عربية
        </span>
      )}
    </Link>
  );
};

export default Logo;