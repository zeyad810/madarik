import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getPublicLandingData } from "../api";
import type {
  PublicLandingData,
  PublicHeroBanner,
  PublicWhyUsSection,
  PublicHowItWorksSection,
  PublicPlatformTourSection,
  PublicInstantReportSection,
  PublicMoreThanStoriesSection,
  PublicChildBenefitsSection,
  PublicSuggestedStoriesSection,
  PublicTrustSection,
  PublicJourneySection,
  PublicTestimonialsSection,
  PublicFaqSection,
  PublicContactSection,
  PublicNewsletterSection,
} from "../types";
import type { ApiResponse, ApiError } from "@/types";

export const siteQueryKeys = {
  all: ["site"] as const,
  public: () => [...siteQueryKeys.all, "public"] as const,
};

export interface UsePublicLandingOptions<TData = ApiResponse<PublicLandingData>>
  extends Omit<
    UseQueryOptions<ApiResponse<PublicLandingData>, ApiError | Error, TData>,
    "queryKey" | "queryFn"
  > {}

/**
 * Hook to fetch public landing page data (GET /public)
 */
export const usePublicLanding = <TData = ApiResponse<PublicLandingData>>(
  options?: UsePublicLandingOptions<TData>
) => {
  return useQuery({
    queryKey: siteQueryKeys.public(),
    queryFn: getPublicLandingData,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Returns unwrapped PublicLandingData directly
 */
export const usePublicLandingData = (
  options?: UsePublicLandingOptions<PublicLandingData>
) => {
  return usePublicLanding<PublicLandingData>({
    select: (response) => response.data,
    ...options,
  });
};

// Section Selector Hooks
export const usePublicHero = (options?: UsePublicLandingOptions<PublicHeroBanner | undefined>) =>
  usePublicLanding<PublicHeroBanner | undefined>({
    select: (res) => res.data?.hero_banner,
    ...options,
  });

export const usePublicWhyUs = (options?: UsePublicLandingOptions<PublicWhyUsSection | undefined>) =>
  usePublicLanding<PublicWhyUsSection | undefined>({
    select: (res) => res.data?.why_us_section,
    ...options,
  });

export const usePublicHowItWorks = (options?: UsePublicLandingOptions<PublicHowItWorksSection | undefined>) =>
  usePublicLanding<PublicHowItWorksSection | undefined>({
    select: (res) => res.data?.how_it_works_section,
    ...options,
  });

export const usePublicPlatformTour = (options?: UsePublicLandingOptions<PublicPlatformTourSection | undefined>) =>
  usePublicLanding<PublicPlatformTourSection | undefined>({
    select: (res) => res.data?.platform_tour_section,
    ...options,
  });

export const usePublicInstantReport = (options?: UsePublicLandingOptions<PublicInstantReportSection | undefined>) =>
  usePublicLanding<PublicInstantReportSection | undefined>({
    select: (res) => res.data?.instant_report_section,
    ...options,
  });

export const usePublicMoreThanStories = (options?: UsePublicLandingOptions<PublicMoreThanStoriesSection | undefined>) =>
  usePublicLanding<PublicMoreThanStoriesSection | undefined>({
    select: (res) => res.data?.more_than_stories_section,
    ...options,
  });

export const usePublicChildBenefits = (options?: UsePublicLandingOptions<PublicChildBenefitsSection | undefined>) =>
  usePublicLanding<PublicChildBenefitsSection | undefined>({
    select: (res) => res.data?.child_benefits_section,
    ...options,
  });

export const usePublicSuggestedStories = (options?: UsePublicLandingOptions<PublicSuggestedStoriesSection | undefined>) =>
  usePublicLanding<PublicSuggestedStoriesSection | undefined>({
    select: (res) => res.data?.suggested_stories_section,
    ...options,
  });

export const usePublicTrust = (options?: UsePublicLandingOptions<PublicTrustSection | undefined>) =>
  usePublicLanding<PublicTrustSection | undefined>({
    select: (res) => res.data?.trust_section,
    ...options,
  });

export const usePublicJourney = (options?: UsePublicLandingOptions<PublicJourneySection | undefined>) =>
  usePublicLanding<PublicJourneySection | undefined>({
    select: (res) => res.data?.journey_section,
    ...options,
  });

export const usePublicTestimonials = (options?: UsePublicLandingOptions<PublicTestimonialsSection | undefined>) =>
  usePublicLanding<PublicTestimonialsSection | undefined>({
    select: (res) => res.data?.testimonials_section,
    ...options,
  });

export const usePublicFaq = (options?: UsePublicLandingOptions<PublicFaqSection | undefined>) =>
  usePublicLanding<PublicFaqSection | undefined>({
    select: (res) => res.data?.faq_section,
    ...options,
  });

export const usePublicContact = (options?: UsePublicLandingOptions<PublicContactSection | undefined>) =>
  usePublicLanding<PublicContactSection | undefined>({
    select: (res) => res.data?.contact_section,
    ...options,
  });

export const usePublicNewsletter = (options?: UsePublicLandingOptions<PublicNewsletterSection | undefined>) =>
  usePublicLanding<PublicNewsletterSection | undefined>({
    select: (res) => res.data?.newsletter_section,
    ...options,
  });
