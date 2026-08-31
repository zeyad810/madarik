"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AuthBackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export const AuthBackButton: React.FC<AuthBackButtonProps> = ({
  href = "/",
  label = "العودة للرئيسية",
  className = "",
}) => {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white/90 hover:bg-white text-[#475467] hover:text-mad-main border border-[#EAECF0] hover:border-mad-purple-300 shadow-xs hover:shadow-md transition-all duration-200 font-sans text-xs sm:text-sm font-medium backdrop-blur-xs group cursor-pointer active:scale-95 select-none ${className}`}
      aria-label={label}
    >
      <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-mad-main transition-transform group-hover:translate-x-1" />
      <span>{label}</span>
    </Link>
  );
};

export default AuthBackButton;
