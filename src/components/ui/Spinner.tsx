"use client";

import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "gray";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
    xl: "w-16 h-16 border-4",
  };

  const colorClasses = {
    primary: "border-purple-200 border-t-mad-main border-r-mad-main",
    white: "border-white/30 border-t-white border-r-white",
    gray: "border-gray-200 border-t-gray-600 border-r-gray-600",
  };

  return (
    <div
      role="status"
      aria-label="جاري التحميل"
      className={`inline-block animate-spin rounded-full transition-all ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  );
};

export default Spinner;
