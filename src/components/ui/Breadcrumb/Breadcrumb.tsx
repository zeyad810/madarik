"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { BreadcrumbContext } from "./context";
import type { BreadcrumbProps } from "./types";

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      variant = "default",
      size = "md",
      separator = "chevron",
      dir = "auto",
      ariaLabel = "مسار التنقل",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const contextValue = useMemo(
      () => ({
        variant,
        size,
        separator,
        dir,
      }),
      [variant, size, separator, dir]
    );

    const variantRootClasses = {
      default: "",
      pills: "p-1",
      contained:
        "inline-flex bg-white/95 backdrop-blur-sm border border-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] rounded-2xl px-4 py-2.5",
      ghost: "",
      underlined: "",
    };

    return (
      <BreadcrumbContext.Provider value={contextValue}>
        <nav
          ref={ref}
          aria-label={ariaLabel}
          dir={dir === "auto" ? undefined : dir}
          className={cn(
            "w-fit max-w-full font-sans transition-all duration-200",
            variantRootClasses[variant],
            className
          )}
          {...props}
        >
          {children}
        </nav>
      </BreadcrumbContext.Provider>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";

export default Breadcrumb;
