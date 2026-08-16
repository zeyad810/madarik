"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useBreadcrumbContext } from "./context";
import type { BreadcrumbListProps } from "./types";

export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  BreadcrumbListProps
>(({ className, children, ...props }, ref) => {
  const { size, variant } = useBreadcrumbContext();

  const sizeGapClasses = {
    sm: "gap-1.5",
    md: "gap-2",
    lg: "gap-2.5",
  };

  const variantListClasses = {
    default: "",
    pills: "bg-gray-50/80 p-1.5 rounded-full border border-gray-100/60 shadow-2xs",
    contained: "",
    ghost: "",
    underlined: "",
  };

  return (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center text-mad-text-secondary transition-colors",
        sizeGapClasses[size],
        variantListClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </ol>
  );
});

BreadcrumbList.displayName = "BreadcrumbList";

export default BreadcrumbList;
