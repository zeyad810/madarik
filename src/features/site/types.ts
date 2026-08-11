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