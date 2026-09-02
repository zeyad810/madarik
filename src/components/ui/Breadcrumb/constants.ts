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
  faq: "الأسئلة الشائعة",
  faqs: "الأسئلة الشائعة",
  pricing: "الباقات والأسعار",
  packages: "اختيار الباقة",
  subscription: "الاشتراك",
  subscriptions: "الاشتراكات والدفع",
  "subscription-status": "حالة اشتراكي",
  status: "حالة اشتراكي",
  renew: "تجديد الاشتراك",
  "package-history": "تاريخ وسجل الباقات",

  // Parents & Children
  parents: "أولياء الأمور",
  childMangement: "إدارة الأبناء",
  "child-management": "إدارة الأبناء",
  children: "الأبناء",
  reports: "التقارير",
  certificates: "الشهادات",

  // Stories & Quiz
  stories: "القصص",
  story: "القصة",
  read: "قراءة القصة",
  quiz: "اختبار القصة",
  history: "سجل المحاولات",
  results: "سجل المحاولات",
  attempts: "سجل المحاولات",

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
