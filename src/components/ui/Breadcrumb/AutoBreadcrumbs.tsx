"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "./Breadcrumb";
import { BreadcrumbList } from "./BreadcrumbList";
import { BreadcrumbItem } from "./BreadcrumbItem";
import { BreadcrumbLink } from "./BreadcrumbLink";
import { BreadcrumbPage } from "./BreadcrumbPage";
import { BreadcrumbSeparator } from "./BreadcrumbSeparator";
import { BreadcrumbEllipsis } from "./BreadcrumbEllipsis";
import { DEFAULT_ROUTE_DICTIONARY, DEFAULT_EXCLUDE_SEGMENTS } from "./constants";
import type { AutoBreadcrumbsProps, BreadcrumbItemData } from "./types";

export const AutoBreadcrumbs: React.FC<AutoBreadcrumbsProps> = ({
  items: explicitItems,
  dynamicLabels,
  routeDictionary = DEFAULT_ROUTE_DICTIONARY,
  rootLabel = "الرئيسية",
  rootHref = "/",
  rootIcon,
  transformLabel,
  excludeSegments = DEFAULT_EXCLUDE_SEGMENTS,
  maxItems = 4,
  customLastItem,
  variant = "default",
  size = "md",
  separator = "chevron",
  dir = "auto",
  className,
  ariaLabel,
  ...props
}) => {
  const pathname = usePathname();

  // Compute final breadcrumbs array
  const breadcrumbs: BreadcrumbItemData[] = useMemo(() => {
    // 1. If explicit manual items are provided, format and use them
    if (explicitItems && explicitItems.length > 0) {
      return explicitItems.map((item, index) => ({
        ...item,
        isLast: item.isLast ?? index === explicitItems.length - 1,
      }));
    }

    // 2. Otherwise dynamically derive from URL pathname
    if (!pathname || pathname === "/" || pathname === "") {
      return [];
    }

    const segments = pathname
      .split("/")
      .filter((seg) => Boolean(seg) && !excludeSegments.includes(seg));

    if (segments.length === 0) {
      return [];
    }

    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const decodedSegment = decodeURIComponent(segment);
      const isLast = index === segments.length - 1;

      // Label resolution priority:
      // 1. customLastItem (if last item and provided)
      // 2. dynamicLabels override (e.g. { [storyId]: story.title })
      // 3. routeDictionary lookup (e.g. stories -> "القصص")
      // 4. transformLabel function (if provided)
      // 5. Cleaned string with underscores/hyphens replaced
      let label: string | React.ReactNode = "";
      if (isLast && customLastItem) {
        label = customLastItem;
      } else if (dynamicLabels && dynamicLabels[decodedSegment]) {
        label = dynamicLabels[decodedSegment];
      } else if (routeDictionary[decodedSegment]) {
        label = routeDictionary[decodedSegment];
      } else if (transformLabel) {
        label = transformLabel(decodedSegment);
      } else {
        label = decodedSegment.replace(/[-_]/g, " ");
      }

      return {
        label: typeof label === "string" ? label : String(label),
        href,
        isLast,
      };
    });
  }, [
    explicitItems,
    pathname,
    excludeSegments,
    dynamicLabels,
    routeDictionary,
    transformLabel,
    customLastItem,
  ]);

  if (breadcrumbs.length === 0) {
    return null;
  }

  // Determine if explicit items already included a root item
  const hasCustomRoot = Boolean(explicitItems && explicitItems.length > 0);

  // Handle collapsing when items count exceeds maxItems
  const shouldCollapse = maxItems > 0 && breadcrumbs.length > maxItems;
  const visibleItems = shouldCollapse
    ? [breadcrumbs[0], breadcrumbs[breadcrumbs.length - 1]]
    : breadcrumbs;
  const collapsedItems = shouldCollapse
    ? breadcrumbs.slice(1, breadcrumbs.length - 1).map((b) => ({
        label: b.label,
        href: b.href ?? "#",
        icon: b.icon,
        badge: b.badge,
      }))
    : [];

  return (
    <Breadcrumb
      variant={variant}
      size={size}
      separator={separator}
      dir={dir}
      className={className}
      ariaLabel={ariaLabel}
      {...props}
    >
      <BreadcrumbList>
        {/* Render Root / Home link if not provided in explicit items */}
        {!hasCustomRoot && rootLabel && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href={rootHref} icon={rootIcon}>
                {rootLabel}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        {shouldCollapse ? (
          <>
            {/* First Segment */}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={breadcrumbs[0].href} icon={breadcrumbs[0].icon} badge={breadcrumbs[0].badge}>
                {breadcrumbs[0].label}
              </BreadcrumbLink>
            </BreadcrumbItem>

            {/* Collapsed Ellipsis with Dropdown */}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis items={collapsedItems} />
            </BreadcrumbItem>

            {/* Last Item (Active Page) */}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage icon={breadcrumbs[breadcrumbs.length - 1].icon} badge={breadcrumbs[breadcrumbs.length - 1].badge}>
                {breadcrumbs[breadcrumbs.length - 1].label}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          breadcrumbs.map((crumb, idx) => {
            const showSeparator = !hasCustomRoot || idx > 0;
            return (
              <React.Fragment key={crumb.href || idx}>
                {showSeparator && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.isLast || !crumb.href ? (
                    <BreadcrumbPage icon={crumb.icon} badge={crumb.badge}>
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href} icon={crumb.icon} badge={crumb.badge}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

AutoBreadcrumbs.displayName = "AutoBreadcrumbs";

export const DynamicBreadcrumbs = AutoBreadcrumbs;

export default AutoBreadcrumbs;
