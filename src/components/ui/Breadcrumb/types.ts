import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type BreadcrumbVariant =
  | "default"
  | "pills"
  | "contained"
  | "ghost"
  | "underlined";

export type BreadcrumbSize = "sm" | "md" | "lg";

export type BreadcrumbSeparatorPreset =
  | "chevron"
  | "slash"
  | "arrow"
  | "dot"
  | "double-chevron";

export interface BreadcrumbContextValue {
  variant: BreadcrumbVariant;
  size: BreadcrumbSize;
  separator: BreadcrumbSeparatorPreset | ReactNode;
  dir: "rtl" | "ltr" | "auto";
}

export interface BreadcrumbProps extends ComponentPropsWithoutRef<"nav"> {
  /**
   * The visual appearance style of the breadcrumb.
   * @default "default"
   */
  variant?: BreadcrumbVariant;
  /**
   * The size scale for text, icons, and padding.
   * @default "md"
   */
  size?: BreadcrumbSize;
  /**
   * Global separator to use between breadcrumb items unless overridden.
   * @default "chevron"
   */
  separator?: BreadcrumbSeparatorPreset | ReactNode;
  /**
   * Direction for navigation and icon rotation (RTL or LTR).
   * @default "auto"
   */
  dir?: "rtl" | "ltr" | "auto";
  /**
   * Accessibility label for the navigation landmark.
   * @default "مسار التنقل"
   */
  ariaLabel?: string;
}

export interface BreadcrumbListProps extends ComponentPropsWithoutRef<"ol"> {
  children?: ReactNode;
}

export interface BreadcrumbItemProps extends ComponentPropsWithoutRef<"li"> {
  children?: ReactNode;
}

export interface BreadcrumbLinkProps extends Omit<ComponentPropsWithoutRef<"a">, "href"> {
  /**
   * Destination URL for the breadcrumb link. Can be internal Next.js path or external link.
   */
  href?: string;
  /**
   * Optional icon to display before or after text.
   */
  icon?: ReactNode;
  /**
   * Optional badge or counter to render next to the text.
   */
  badge?: ReactNode;
  /**
   * Position of the icon relative to text.
   * @default "start"
   */
  iconPosition?: "start" | "end";
  /**
   * Render custom element or child directly.
   */
  asChild?: boolean;
}

export interface BreadcrumbPageProps extends ComponentPropsWithoutRef<"span"> {
  /**
   * Optional icon to display before or after text.
   */
  icon?: ReactNode;
  /**
   * Optional badge or counter to render next to the text.
   */
  badge?: ReactNode;
  /**
   * Position of the icon relative to text.
   * @default "start"
   */
  iconPosition?: "start" | "end";
}

export interface BreadcrumbSeparatorProps extends ComponentPropsWithoutRef<"li"> {
  /**
   * Custom separator override for this specific separator.
   */
  children?: ReactNode;
  /**
   * Predefined separator style override.
   */
  type?: BreadcrumbSeparatorPreset;
}

export interface BreadcrumbCollapsedItem {
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: ReactNode;
}

export interface BreadcrumbEllipsisProps extends ComponentPropsWithoutRef<"span"> {
  /**
   * Items to show in the dropdown menu when clicked.
   */
  items?: BreadcrumbCollapsedItem[];
  /**
   * Custom label for screen readers.
   * @default "المزيد من الروابط"
   */
  ariaLabel?: string;
  /**
   * Callback fired when clicked (if not using built-in dropdown menu).
   */
  onClick?: () => void;
}

export interface AutoBreadcrumbsProps extends Omit<BreadcrumbProps, "children"> {
  /**
   * Custom dictionary mapping path segments to Arabic or custom display titles.
   * Example: `{ courses: "المسارات", profile: "الملف الشخصي" }`
   */
  routeDictionary?: Record<string, string>;
  /**
   * Custom title for the root/home breadcrumb item.
   * @default "الرئيسية"
   */
  rootLabel?: string;
  /**
   * Custom href for the root item.
   * @default "/"
   */
  rootHref?: string;
  /**
   * Custom icon for the root item.
   * Set to `null` to hide the icon.
   */
  rootIcon?: ReactNode;
  /**
   * Optional custom transformation function for segment labels not in the dictionary.
   */
  transformLabel?: (segment: string) => string;
  /**
   * Segments to exclude from breadcrumbs.
   * Example: `["(auth)", "(site)"]`
   */
  excludeSegments?: string[];
  /**
   * Maximum number of items before collapsing into ellipsis.
   */
  maxItems?: number;
}
