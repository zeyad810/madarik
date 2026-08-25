"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useBreadcrumbContext } from "./context";
import type { BreadcrumbPageProps } from "./types";

export const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbPageProps
>(
  (
    {
      icon,
      badge,
      iconPosition = "start",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { variant, size } = useBreadcrumbContext();

    const sizeClasses = {
      sm: "text-xs gap-1.5 py-0.5 px-1.5",
      md: "text-sm gap-2 py-1 px-2",
      lg: "text-base gap-2.5 py-1.5 px-2.5",
    };

    const iconSizeClasses = {
      sm: "[&_svg]:size-3.5",
      md: "[&_svg]:size-4",
      lg: "[&_svg]:size-5",
    };

    const variantPageClasses = {
      default: "text-mad-main font-bold",
      pills:
        "bg-mad-main text-white font-bold rounded-full shadow-xs border border-mad-main/20",
      contained:
        "bg-mad-purple-50 text-mad-main font-bold rounded-xl border border-mad-purple-200/60 shadow-2xs",
      ghost: "text-mad-text-primary font-bold",
      underlined: "text-mad-main font-bold border-b-2 border-mad-main",
    };

    return (
      <span
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cn(
          "inline-flex items-center justify-center select-none truncate transition-colors",
          sizeClasses[size],
          iconSizeClasses[size],
          variantPageClasses[variant],
          className
        )}
        {...props}
      >
        <span className="truncate">{children}</span>
        {badge && (
          <span
            className={cn(
              "inline-flex items-center justify-center text-[10px] font-bold px-1.5 py-0.5 rounded-full",
              variant === "pills"
                ? "bg-white/20 text-white"
                : "bg-mad-purple-100 text-mad-main border border-mad-purple-200/50"
            )}
          >
            {badge}
          </span>
        )}
      </span>
    );
  }
);

BreadcrumbPage.displayName = "BreadcrumbPage";

export default BreadcrumbPage;
