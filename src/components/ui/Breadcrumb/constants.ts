import type { BreadcrumbContextValue } from "./types";

export const DEFAULT_BREADCRUMB_CONTEXT: BreadcrumbContextValue = {
  variant: "default",
  size: "md",
  separator: "chevron",
  dir: "auto",
};

export const DEFAULT_ROUTE_DICTIONARY: Record<string, string> = {
  // Main & Site
  home: "الرئيسية",
  products: "المنتجات",
  settings: "الإعدادات",
  about: "عن مدارك",
  contact: "اتصل بنا",
  faqs: "الأسئلة الشائعة",
  pricing: "الباقات والأسعار",
  subscription: "الاشتراك",

  // Parents & Children
  parents: "أولياء الأمور",
  childMangement: "إدارة الأبناء",
  "child-management": "إدارة الأبناء",
  children: "الأبناء",
  reports: "التقارير",
  certificates: "الشهادات",

  // Stories
  stories: "القصص",
  story: "القصة",
  read: "قراءة القصة",

  // Courses & LMS
  courses: "المسارات التعليمية",
  dashboard: "لوحة التحكم",
  profile: "الملف الشخصي",
  notifications: "الإشعارات",

  // Auth
  login: "تسجيل الدخول",
  register: "إنشاء حساب جديد",
  "forgot-password": "استعادة كلمة المرور",
  otp: "رمز التحقق",
};

export const DEFAULT_EXCLUDE_SEGMENTS: string[] = [
  "(auth)",
  "(site)",
  "(dashboard)",
  "(admin)",
  "api",
];
