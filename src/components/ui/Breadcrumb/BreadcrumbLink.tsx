"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useBreadcrumbContext } from "./context";
import type { BreadcrumbLinkProps } from "./types";

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  BreadcrumbLinkProps
>(
  (
    {
      href,
      icon,
      badge,
      iconPosition = "start",
      className,
      children,
      asChild,
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

    const variantLinkClasses = {
      default:
        "text-mad-text-secondary hover:text-mad-main font-medium rounded-lg hover:bg-purple-50/50 active:scale-[0.98]",
      pills:
        "text-mad-text-secondary hover:text-mad-main font-medium bg-white hover:bg-mad-purple-50 border border-gray-200/60 hover:border-mad-purple-200 rounded-full shadow-2xs active:scale-[0.98]",
      contained:
        "text-mad-text-secondary hover:text-mad-main font-medium rounded-xl hover:bg-mad-purple-50/60 active:scale-[0.98]",
      ghost:
        "text-mad-text-secondary/80 hover:text-mad-text-primary font-medium hover:bg-gray-100/50 rounded-md",
      underlined:
        "text-mad-text-secondary hover:text-mad-main font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-mad-main after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200",
    };

    const content = (
      <>
        <span className="truncate">{children}</span>
        {badge && (
          <span className="inline-flex items-center justify-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-mad-purple-100 text-mad-main border border-mad-purple-200/50">
            {badge}
          </span>
        )}
      </>
    );

    const baseClassNames = cn(
      "group inline-flex items-center justify-center transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mad-main cursor-pointer select-none",
      sizeClasses[size],
      iconSizeClasses[size],
      variantLinkClasses[variant],
      className
    );

    if (!href || asChild) {
      return (
        <a ref={ref} className={baseClassNames} {...props}>
          {content}
        </a>
      );
    }

    return (
      <Link ref={ref} href={href} className={baseClassNames} {...props}>
        {content}
      </Link>
    );
  }
);

BreadcrumbLink.displayName = "BreadcrumbLink";

export default BreadcrumbLink;
