import type { ReactNode } from "react";

// ==========================================
// Hero Types
// ==========================================
export interface HeroStatItem {
  id: string | number;
  value: string;
  label: string;
}

export interface HeroProps {
  id?: string;
  title?: string;
  description?: string;
  stats?: HeroStatItem[];
  ctaText?: string;
  ctaLink?: string;
  bgImageSrc?: string;
  mobileBgImageSrc?: string;
  sideImageSrc?: string;
  mobileSideImageSrc?: string;
  sideImageAlt?: string;
}

// ==========================================
// Banner Slider Types
// ==========================================
export interface BannerSlideItem {
  id: string | number;
  title: string;
  description: string;
  bgImage?: string;
  mobileBgImage?: string;
  sideImage?: string;
  sideImageAlt?: string;
  buttonText?: string;
  buttonLink?: string;
  onButtonClick?: () => void;
  badge?: string;
  titleColor?: string;
}

export interface BannerSliderProps {
  id?: string;
  slides?: BannerSlideItem[];
  autoplayDelay?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
  className?: string;
  heightClass?: string;
  onSlideChange?: (activeIndex: number) => void;
}

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
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
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
  id?: string;
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
  id?: string;
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
  id?: string;
  title?: string;
  description?: string;
  rightCards?: SkillCardItem[];
  leftCards?: SkillCardItem[];
}

// ==========================================
// FAQ Types
// ==========================================
export interface FaqItem {
  id: number | string;
  question: string;
  answer: string;
}

export interface FqaProps {
  id?: string;
  subtitle?: string;
  title?: string;
  items?: FaqItem[];
  imageSrc?: string;
  imageAlt?: string;
}

// ==========================================
// ChildWin Types
// ==========================================
export interface ChildWinCardItem {
  id: string | number;
  number: string;
  title: string;
  description: string;
}

export interface ChildWinProps {
  id?: string;
  title?: string;
  description?: string;
  bgImageSrc?: string;
  cards?: ChildWinCardItem[];
}

// Why Trust Us Types
// ==========================================
export interface WhyTrustUsFeature {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface WhyTrustUsProps {
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  features?: WhyTrustUsFeature[];
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
  id?: string;
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
  id?: string;
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

// ==========================================
// Product Section Types
// ==========================================
import type { Product } from "@/features/products/types";

export interface ProductSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  products?: Product[];
}

// ==========================================
// Contact Us Types
// ==========================================
export interface ContactFormData {
  name: string;
  email?: string;
  phone?: string;
  message: string;
}

export interface SendContactPayload {
  name: string;
  email?: string | null;
  phone?: string | null;
  message: string;
}

export interface SendContactResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

export interface ContactInfoItem {
  email?: string;
  phone?: string;
  address?: string;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

export interface ContactUsProps {
  id?: string;
  title?: string;
  description?: string;
  contactInfo?: ContactInfoItem;
  socialLinks?: SocialLinks;
  onSubmit?: (data: ContactFormData) => Promise<void> | void;
}

// ==========================================
// Our Journey Types
// ==========================================
export interface OurJourneyStep {
  id: string | number;
  title: string;
  description: string;
  color: string;
}

export interface OurJourneyProps {
  id?: string;
  title?: string;
  description?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  steps?: OurJourneyStep[];
}

// ==========================================
// Video Section Types
// ==========================================
export interface MadVideoProps {
  id?: string;
  subtitle?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  youtubeId?: string;
  thumbnailSrc?: string;
  onCtaClick?: () => void;
}

// ==========================================
// Public Landing Page API Response Types
// ==========================================
import type { ApiResponse } from "@/types";

export interface PublicHeroStat {
  label: string;
  value: string;
}

export interface PublicHeroBanner {
  id?: string;
  title: string;
  subtitle: string;
  stats: PublicHeroStat[];
}

export interface PublicWhyUsItem {
  title: string;
  description: string;
}

export interface PublicWhyUsSection {
  id?: string;
  title: string;
  description: string;
  items: PublicWhyUsItem[];
}

export interface PublicHowItWorksStep {
  title: string;
  number: string;
  description: string;
}

export interface PublicHowItWorksSection {
  id?: string;
  title: string;
  description: string;
  steps: PublicHowItWorksStep[];
}

export interface PublicPlatformTourSection {
  id?: string;
  title: string;
  eyebrow: string;
  description: string;
}

export interface PublicInstantReportSection {
  id?: string;
  title: string;
  description: string;
  points: string[];
}

export interface PublicMoreThanStoriesItem {
  title: string;
  description: string;
}

export interface PublicMoreThanStoriesSection {
  id?: string;
  title: string;
  description: string;
  items: PublicMoreThanStoriesItem[];
}

export interface PublicChildBenefitsItem {
  title: string;
  description: string;
}

export interface PublicChildBenefitsSection {
  id?: string;
  title: string;
  subtitle: string;
  items: PublicChildBenefitsItem[];
}

export interface PublicStoryBlock {
  id: string;
  order: number;
  block_type: "text" | "image" | string;
  content: string;
}

export interface PublicSuggestedStory {
  id: string;
  code: string;
  title: string;
  description: string | null;
  thumbnail_url: string;
  cover_photo_url: string;
  level: string;
  outcome: string;
  indicator: string;
  age_category: string;
  availability: "free" | "paid" | string;
  pdf_url: string | null;
  blocks?: PublicStoryBlock[];
}

export interface PublicSuggestedStoriesSection {
  id?: string;
  title: string;
  link_text: string;
  items: PublicSuggestedStory[];
}

export interface PublicTrustItem {
  title: string;
  description: string;
}

export interface PublicTrustSection {
  id?: string;
  title: string;
  description: string;
  items: PublicTrustItem[];
}

export interface PublicJourneyMilestone {
  title: string;
  description: string;
}

export interface PublicJourneySection {
  id?: string;
  title: string;
  subtitle: string;
  milestones: PublicJourneyMilestone[];
}

export interface PublicTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  display_order: number;
  status: "active" | "inactive" | string;
  created_at: string;
  updated_at: string;
}

export interface PublicTestimonialsSection {
  id?: string;
  title: string;
  items: PublicTestimonial[];
}

export interface PublicFaqApiItem {
  id: number;
  question: string;
  answer: string;
  status: "active" | "inactive" | string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PublicFaqSection {
  id?: string;
  title: string;
  subtitle: string;
  items: PublicFaqApiItem[];
}

export interface PublicContactSection {
  id?: string;
  title: string;
  subtitle: string;
  button_text: string;
}

export interface PublicNewsletterSection {
  id?: string;
  title: string;
  subtitle: string;
}

export interface PublicLandingData {
  id: number;
  created_at: string;
  updated_at: string;
  hero_banner: PublicHeroBanner;
  why_us_section: PublicWhyUsSection;
  how_it_works_section: PublicHowItWorksSection;
  platform_tour_section: PublicPlatformTourSection;
  instant_report_section: PublicInstantReportSection;
  more_than_stories_section: PublicMoreThanStoriesSection;
  child_benefits_section: PublicChildBenefitsSection;
  suggested_stories_section: PublicSuggestedStoriesSection;
  trust_section: PublicTrustSection;
  journey_section: PublicJourneySection;
  testimonials_section: PublicTestimonialsSection;
  faq_section: PublicFaqSection;
  contact_section: PublicContactSection;
  newsletter_section: PublicNewsletterSection;
}

export type PublicLandingResponse = ApiResponse<PublicLandingData>;

export interface PublicPackage {
  id: string;
  name: string;
  audience: "individual" | "school" | string;
  description: string | null;
  features: string[] | string | null;
  price: string | number | null;
  duration_type: "months" | "years" | "lifetime" | string;
  duration_value: number | null;
  duration_label: string | null;
  start_date: string | null;
  end_date: string | null;
  age_categories: string[];
  status: string;
  cta_type: "checkout" | "whatsapp" | string;
  cta_text: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PublicPackagesData {
  id?: string;
  title: string | null;
  subtitle: string | null;
  packages: PublicPackage[];
}

export type PublicPackagesResponse = ApiResponse<PublicPackagesData>;

