"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreadcrumbContext } from "./context";
import type { BreadcrumbSeparatorProps, BreadcrumbSeparatorPreset } from "./types";

export const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ type, className, children, ...props }, ref) => {
  const { separator: contextSeparator, size, dir } = useBreadcrumbContext();
  const effectiveType = (type || contextSeparator) as BreadcrumbSeparatorPreset | React.ReactNode;

  const sizeClasses = {
    sm: "text-xs [&_svg]:size-3 text-gray-400",
    md: "text-sm [&_svg]:size-3.5 text-gray-400",
    lg: "text-base [&_svg]:size-4 text-gray-400",
  };

  const renderSeparatorContent = () => {
    if (children) {
      return children;
    }

    if (React.isValidElement(effectiveType)) {
      return effectiveType;
    }

    switch (effectiveType) {
      case "slash":
        return <span className="opacity-60 select-none">/</span>;
      case "dot":
        return <span className="opacity-60 select-none text-[8px] leading-none">•</span>;
      case "arrow":
        return (
          <>
            <ArrowLeft className="hidden rtl:inline-block shrink-0 transition-transform" />
            <ArrowRight className="inline-block rtl:hidden shrink-0 transition-transform" />
          </>
        );
      case "double-chevron":
        return (
          <>
            <ChevronsLeft className="hidden rtl:inline-block shrink-0 transition-transform" />
            <ChevronsRight className="inline-block rtl:hidden shrink-0 transition-transform" />
          </>
        );
      case "chevron":
      default:
        return (
          <>
            <ChevronLeft className="hidden rtl:inline-block shrink-0 transition-transform" />
            <ChevronRight className="inline-block rtl:hidden shrink-0 transition-transform" />
          </>
        );
    }
  };

  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center select-none shrink-0 transition-colors",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {renderSeparatorContent()}
    </li>
  );
});

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export default BreadcrumbSeparator;
