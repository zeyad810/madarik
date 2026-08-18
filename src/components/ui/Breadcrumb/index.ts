import { Breadcrumb as BreadcrumbRoot } from "./Breadcrumb";
import { BreadcrumbList } from "./BreadcrumbList";
import { BreadcrumbItem } from "./BreadcrumbItem";
import { BreadcrumbLink } from "./BreadcrumbLink";
import { BreadcrumbPage } from "./BreadcrumbPage";
import { BreadcrumbSeparator } from "./BreadcrumbSeparator";
import { BreadcrumbEllipsis } from "./BreadcrumbEllipsis";
import { AutoBreadcrumbs, DynamicBreadcrumbs } from "./AutoBreadcrumbs";

// Compound component assembly for flexible and intuitive usage
export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis,
  Auto: AutoBreadcrumbs,
  Dynamic: DynamicBreadcrumbs,
});

// Named exports for individual imports
export {
  BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  AutoBreadcrumbs,
  DynamicBreadcrumbs,
};

// Context hook
export { useBreadcrumbContext } from "./context";

// Constants & Types
export * from "./constants";
export * from "./types";

export default Breadcrumb;
