import React from "react";
import { AutoBreadcrumbs, BreadcrumbItemData } from "@/components/ui/Breadcrumb";

export type BreadcrumbItem = BreadcrumbItemData;

export interface StoryBreadcrumbProps {
  items?: BreadcrumbItem[];
  dynamicLabels?: Record<string, string>;
  className?: string;
}

/**
 * StoryBreadcrumb is now a unified wrapper around the core AutoBreadcrumbs component.
 * It automatically derives paths from URL or accepts dynamicLabels / explicit items.
 */
export const StoryBreadcrumb: React.FC<StoryBreadcrumbProps> = ({
  items,
  dynamicLabels,
  className = "",
}) => {
  return (
    <AutoBreadcrumbs
      items={items}
      dynamicLabels={dynamicLabels}
      className={className}
    />
  );
};

export default StoryBreadcrumb;
