import { NavLinkItem, SideMenuItem } from "./types";

export const SIDE_MENU_ITEMS: SideMenuItem[] = [
  { id: "home", label: "الرئيسية", href: "/" },
  {
    id: "profile",
    label: "الملف الشخصي",
    href: "/profile",
    allowedRoles: ["student", "parent", "free", "free_customer"],
  },
  {
    id: "children-mgmt",
    label: "إدارة الأطفال",
    href: "/parents/childMangement",
    allowedRoles: ["parent", "free", "free_customer"],
  },
  {
    id: "children-reports",
    label: "تقارير الأطفال",
    href: "/parents/childReports",
    allowedRoles: ["parent", "free", "free_customer"],
  },
  {
    id: "results",
    label: "نتائجي",
    href: "/results",
    allowedRoles: ["student", "child"],
  },
  { id: "available-stories", label: "القصص المتاحة", href: "/stories" },
  { id: "packages", label: "الباقات والاشتراكات", href: "/packages" },
  { id: "faq", label: "الأسئلة الشائعة", href: "/faq" },
  {
    id: "sub-status",
    label: "حالة اشتراكي",
    href: "/subscription-status",
    allowedRoles: ["parent", "free", "free_customer"],
  },
  {
    id: "sub-history",
    label: "سجل الباقات",
    href: "/packages/history",
    allowedRoles: ["parent", "free", "free_customer"],
  },
];

export const DESKTOP_NAV_LINKS: NavLinkItem[] = [
  { id: "home", label: "الرئيسية", href: "/" },
  { id: "results", label: "نتائجي", href: "/results", allowedRoles: ["student", "child"] },
  { id: "packages", label: "الباقات", href: "/packages" },
  { id: "library", label: "مكتبة القصص", href: "/stories" },
  { id: "contact", label: "تواصل معنا", href: "/#contact_section" },
  { id: "faq", label: "الأسئلة الشائعة", href: "/faq" },
];
