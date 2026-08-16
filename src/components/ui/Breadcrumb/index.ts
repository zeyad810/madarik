import { Breadcrumb as BreadcrumbRoot } from "./Breadcrumb";
import { BreadcrumbList } from "./BreadcrumbList";
import { BreadcrumbItem } from "./BreadcrumbItem";
import { BreadcrumbLink } from "./BreadcrumbLink";
import { BreadcrumbPage } from "./BreadcrumbPage";
import { BreadcrumbSeparator } from "./BreadcrumbSeparator";
import { BreadcrumbEllipsis } from "./BreadcrumbEllipsis";
import { AutoBreadcrumbs } from "./AutoBreadcrumbs";

// Compound component assembly
export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis,
  Auto: AutoBreadcrumbs,
});

// Named exports for flexible imports
export {
  BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  AutoBreadcrumbs,
};

// Context hook
export { useBreadcrumbContext } from "./context";

// Types
export * from "./types";

export default Breadcrumb;
