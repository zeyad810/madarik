import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface StoryBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const StoryBreadcrumb: React.FC<StoryBreadcrumbProps> = ({
  items,
  className = "",
}) => {
  return (
    <nav
      dir="rtl"
      aria-label="Breadcrumb"
      className={`flex items-center space-x-reverse space-x-2 text-sm text-mad-text-secondary ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronLeft className="w-4 h-4 text-mad-text-secondary/60 shrink-0" />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-mad-main transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "font-semibold text-mad-main"
                    : "font-normal"
                }
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
