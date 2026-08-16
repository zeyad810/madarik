"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { BreadcrumbItemProps } from "./types";

export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  BreadcrumbItemProps
>(({ className, children, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 shrink-0 transition-all",
        className
      )}
      {...props}
    >
      {children}
    </li>
  );
});

BreadcrumbItem.displayName = "BreadcrumbItem";

export default BreadcrumbItem;
