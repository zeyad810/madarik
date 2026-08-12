export interface FooterLinkItem {
  id: string;
  label: string;
  href: string;
}

export interface FooterLinkSection {
  id: string;
  title: string;
  links: FooterLinkItem[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

export interface SocialLink {
  id: string;
  name: string;
  href: string;
  type: "linkedin" | "instagram" | "twitter" | "facebook";
}

export interface NewsletterData {
  title: string;
  description: string;
  placeholder?: string;
}

export interface FooterProps {
  newsletter?: NewsletterData;
  onSubscribe?: (email: string) => Promise<void> | void;
  brandDescription?: string;
  quickLinks?: FooterLinkItem[];
  importantLinks?: FooterLinkItem[];
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
  copyrightText?: string;
  bgImageSrc?: string;
  mobileBgImageSrc?: string;
}
