"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  activeColor?: string;
  ariaLabel?: string;
}

const sizeClasses = {
  sm: {
    track: "h-5 w-9",
    thumb: "size-4",
    translate: "-translate-x-4",
  },
  md: {
    track: "h-6 w-11",
    thumb: "size-5",
    translate: "-translate-x-5",
  },
  lg: {
    track: "h-7 w-12",
    thumb: "size-6",
    translate: "-translate-x-5",
  },
};

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
  className,
  activeColor = "bg-[#22C55E]",
  ariaLabel,
}) => {
  const currentSize = sizeClasses[size] || sizeClasses.md;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50",
        disabled && "opacity-50 cursor-not-allowed",
        currentSize.track,
        checked ? activeColor : "bg-gray-300",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
          currentSize.thumb,
          checked ? currentSize.translate : "translate-x-0"
        )}
      />
    </button>
  );
};

export default Toggle;
