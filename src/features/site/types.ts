import type { ReactNode } from "react";

// ==========================================
// Customer Reviews Types
// ==========================================
export interface ReviewItem {
  id: string | number;
  author: string;
  role: string;
  comment: string;
  rating: number;
}

export interface CustomerReviewsProps {
  reviews?: ReviewItem[];
}

// ==========================================
// Features Types
// ==========================================
export interface FeatureItem {
  id: string | number;
  title: string;
  description: string;
  accentColor: string;
  bgCircleColor: string;
  icon?: ReactNode;
  imageSrc?: string;
}

export interface FeaturesProps {
  title?: string;
  description?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  features?: FeatureItem[];
}

// ==========================================
// How It Works Types
// ==========================================
export interface StepItem {
  id: string | number;
  number: string;
  title: string;
  description: string;
  color: string;
}

export interface HowItWorksProps {
  title?: string;
  subtitle?: string;
  steps?: StepItem[];
}

// ==========================================
// Skills Types
// ==========================================
export interface SkillCardItem {
  id: string;
  title: string;
  description: string;
  accentColor: string;
  imageSrc: string;
}

export interface SkillsProps {
  title?: string;
  description?: string;
  rightCards?: SkillCardItem[];
  leftCards?: SkillCardItem[];
}

// ==========================================
// Why Trust Us Types
// ==========================================
export interface WhyTrustUsFeature {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface WhyTrustUsProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  features: WhyTrustUsFeature[];
}

// ==========================================
// Pricing Types
// ==========================================
export type AgeGroup = "5-9" | "10-12" | "13-15" | string;

export interface PricingPlan {
  id: string;
  /** Plan name — e.g. "الباقة العائلية" */
  name: string;
  /** Short subtitle shown below the name */
  description?: string;
  /** Absolute path or URL to the plan icon/illustration */
  icon: string;
  /** Available age groups the user can filter by */
  ageGroups: AgeGroup[];
  /** Monthly price in SAR. Null = contact-based (schools) */
  price: number | null;
  /** Currency label, defaults to "ريال" */
  currency?: string;
  /** Billing period label, e.g. "شهريًا" */
  billingPeriod?: string;
  /** Highlighted badge text shown beneath the price, e.g. "لمدة سنة كاملة شاملة" */
  badge?: string;
  /** Bullet-point feature list */
  features: string[];
  /** Primary CTA button label */
  ctaLabel: string;
  /** Optional CTA href. If omitted the button fires onCtaClick. */
  ctaHref?: string;
  /** Whether this plan should render with the highlighted/featured style */
  featured?: boolean;
}

export interface PricingProps {
  title?: string;
  description?: string;
  plans?: PricingPlan[];
  /** Called when a CTA button is clicked. Receives the plan id. */
  onCtaClick?: (planId: string) => void;
}

// ==========================================
// Instant Report Types
// ==========================================
export interface InstantReportFeature {
  id: string;
  text: string;
  /** Optional icon path (SVG/PNG) shown beside the feature text */
  icon?: string;
}

export interface InstantReportProps {
  title?: string;
  description?: string;
  features?: InstantReportFeature[];
  /** CTA button label */
  ctaLabel?: string;
  /** CTA href — if omitted the button fires onCtaClick */
  ctaHref?: string;
  onCtaClick?: () => void;
  /** Dashboard / illustration image src */
  image?: string;
  imageAlt?: string;
}