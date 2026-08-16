"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { Breadcrumb } from "./Breadcrumb";
import { BreadcrumbList } from "./BreadcrumbList";
import { BreadcrumbItem } from "./BreadcrumbItem";
import { BreadcrumbLink } from "./BreadcrumbLink";
import { BreadcrumbPage } from "./BreadcrumbPage";
import { BreadcrumbSeparator } from "./BreadcrumbSeparator";
import { BreadcrumbEllipsis } from "./BreadcrumbEllipsis";
import type { AutoBreadcrumbsProps } from "./types";

const DEFAULT_ROUTE_DICTIONARY: Record<string, string> = {
  login: "تسجيل الدخول",
  register: "إنشاء حساب جديد",
  "forgot-password": "استعادة كلمة المرور",
  courses: "المسارات التعليمية",
  dashboard: "لوحة التحكم",
  profile: "الملف الشخصي",
  settings: "الإعدادات",
  notifications: "الإشعارات",
  about: "عن مدارك",
  contact: "اتصل بنا",
  faqs: "الأسئلة الشائعة",
  pricing: "الباقات والأسعار",
  subscription: "الاشتراك",
  children: "الأبناء",
  reports: "التقارير",
  certificates: "الشهادات",
};

export const AutoBreadcrumbs: React.FC<AutoBreadcrumbsProps> = ({
  routeDictionary = DEFAULT_ROUTE_DICTIONARY,
  rootLabel = "الرئيسية",
  rootHref = "/",
  rootIcon = <Home className="size-4" />,
  transformLabel,
  excludeSegments = ["(auth)", "(site)", "api"],
  maxItems = 4,
  variant = "default",
  size = "md",
  separator = "chevron",
  dir = "auto",
  className,
  ariaLabel,
  ...props
}) => {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    if (!pathname) return [];

    const segments = pathname
      .split("/")
      .filter((seg) => Boolean(seg) && !excludeSegments.includes(seg));

    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const decodedSegment = decodeURIComponent(segment);
      const label =
        routeDictionary[decodedSegment] ||
        (transformLabel
          ? transformLabel(decodedSegment)
          : decodedSegment.replace(/[-_]/g, " "));

      return {
        label,
        href,
        isLast: index === segments.length - 1,
      };
    });
  }, [pathname, routeDictionary, transformLabel, excludeSegments]);

  if (breadcrumbs.length === 0) {
    return null;
  }

  // Handle collapsing when items exceed maxItems
  const shouldCollapse = maxItems > 0 && breadcrumbs.length > maxItems;
  const visibleItems = shouldCollapse
    ? [breadcrumbs[0], breadcrumbs[breadcrumbs.length - 1]]
    : breadcrumbs;
  const collapsedItems = shouldCollapse
    ? breadcrumbs.slice(1, breadcrumbs.length - 1).map((b) => ({
        label: b.label,
        href: b.href,
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
        {/* Root / Home Link */}
        <BreadcrumbItem>
          <BreadcrumbLink href={rootHref} icon={rootIcon}>
            {rootLabel}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {shouldCollapse ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={breadcrumbs[0].href}>
                {breadcrumbs[0].label}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis items={collapsedItems} />
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {breadcrumbs[breadcrumbs.length - 1].label}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          breadcrumbs.map((crumb) => (
            <React.Fragment key={crumb.href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {crumb.isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

AutoBreadcrumbs.displayName = "AutoBreadcrumbs";

export default AutoBreadcrumbs;
