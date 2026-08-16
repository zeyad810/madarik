"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreadcrumbContext } from "./context";
import type { BreadcrumbEllipsisProps } from "./types";

export const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbEllipsisProps
>(({ items, ariaLabel = "المزيد من الروابط", onClick, className, ...props }, ref) => {
  const { size, variant } = useBreadcrumbContext();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "size-6 [&_svg]:size-3.5",
    md: "size-7 [&_svg]:size-4",
    lg: "size-8 [&_svg]:size-5",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    if (onClick) {
      onClick();
    } else if (items && items.length > 0) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className="relative inline-flex items-center" ref={menuRef}>
      <span
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-haspopup={items && items.length > 0 ? "menu" : undefined}
        aria-expanded={isOpen}
        onClick={handleTriggerClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleTriggerClick();
          }
        }}
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-mad-text-secondary hover:text-mad-main hover:bg-mad-purple-50 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-mad-main select-none active:scale-95",
          sizeClasses[size],
          variant === "pills" && "bg-white border border-gray-200/60 rounded-full",
          className
        )}
        {...props}
      >
        <MoreHorizontal className="shrink-0" />
        <span className="sr-only">{ariaLabel}</span>
      </span>

      {/* Dropdown Menu for collapsed items */}
      {isOpen && items && items.length > 0 && (
        <div
          role="menu"
          className="absolute top-full mt-2 z-50 min-w-44 rounded-2xl bg-white p-1.5 shadow-xl border border-gray-100/80 animate-in fade-in zoom-in-95 duration-150 text-right"
        >
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between gap-2.5 px-3 py-2 text-xs md:text-sm font-medium text-mad-text-secondary hover:text-mad-main hover:bg-mad-purple-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-mad-purple-100 text-mad-main font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
});

BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export default BreadcrumbEllipsis;
