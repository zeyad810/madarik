import {
  FooterLinkItem,
  ContactInfo,
  SocialLink,
  NewsletterData,
} from "./types";

export const DEFAULT_NEWSLETTER: NewsletterData = {
  title: "النشرة البريدية",
  description:
    "اشترك معنا لتصلك أحدث القصص والميزات والنصائح التربوية المميزة يومياً.",
  placeholder: "البريد الإلكتروني",
};

export const DEFAULT_BRAND_DESCRIPTION =
  "منصة تعليمية عربية ذكية بمواصفات تربوية رائدة لتحفيز مهارات طفلك وتطوير مخارج الحروف عبر تجربة تعليمية شيقة تجمع بين التعليم واللعب.";

export const DEFAULT_QUICK_LINKS: FooterLinkItem[] = [
  { id: "home", label: "الرئيسية", href: "/" },
  { id: "features", label: "المميزات", href: "/#features" },
  { id: "stories", label: "القصص", href: "/stories" },
  { id: "faq", label: "الأسئلة الشائعة", href: "/faq" },
  { id: "pricing", label: "الأسعار", href: "/#pricing" },
];

export const DEFAULT_IMPORTANT_LINKS: FooterLinkItem[] = [
  { id: "terms", label: "الشروط والأحكام", href: "/terms" },
  { id: "privacy", label: "سياسة الخصوصية", href: "/privacy" },
];

export const DEFAULT_CONTACT_INFO: ContactInfo = {
  email: "support@madarik.edu.sa",
  phone: "+966 11 234 5678",
  location: "الرياض، المملكة العربية السعودية",
};

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { id: "linkedin", name: "LinkedIn", href: "https://linkedin.com", type: "linkedin" },
  { id: "instagram", name: "Instagram", href: "https://instagram.com", type: "instagram" },
  { id: "twitter", name: "Twitter", href: "https://twitter.com", type: "twitter" },
  { id: "facebook", name: "Facebook", href: "https://facebook.com", type: "facebook" },
];

export const DEFAULT_COPYRIGHT =
  "حقوق النشر © 2026 مدارك القراءة. جميع الحقوق محفوظة.";

