import { NavLinkItem, SideMenuItem } from "./types";

export const SIDE_MENU_ITEMS: SideMenuItem[] = [
  { id: "home", label: "الرئيسية", href: "/" },
  { id: "available-stories", label: "القصص المتاحة", href: "/stories" },
  {
    id: "children-mgmt",
    label: "إدارة الأطفال",
    href: "/parents/childMangement",
    allowedRoles: ["parent", "free", "free_customer"],
  },
  { id: "children-reports", label: "تقارير الأطفال", href: "/reports" },
  { id: "attempts-log", label: "سجل المحاولات", href: "/attempts" },
  { id: "subscriptions", label: "الاشتراكات والدفع", href: "/subscriptions" },
  { id: "sub-status", label: "حالة اشتراكي", href: "/subscription-status" },
  { id: "profile", label: "الملف الشخصي", href: "/profile" },
];

export const DESKTOP_NAV_LINKS: NavLinkItem[] = [
  { id: "home", label: "الرئيسية", href: "/" },
  { id: "results", label: "نتائجي", href: "/results" },
  { id: "library", label: "مكتبة القصص", href: "/stories" },
  { id: "contact", label: "تواصل معنا", href: "/contact" },
  { id: "faq", label: "الأسئلة الشائعة", href: "/faq" },
];
