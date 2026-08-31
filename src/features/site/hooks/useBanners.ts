import type { PublicBannersSection } from "../types";
import { usePublicLanding, type UsePublicLandingOptions } from "./usePublicLanding";

/**
 * Hook to retrieve banners_section from the public landing endpoint (GET /public).
 */
export const useLandingBanners = (
  options?: Omit<UsePublicLandingOptions<PublicBannersSection | undefined>, "select">
) => {
  return usePublicLanding({
    select: (res): PublicBannersSection | undefined => res.data?.banners_section,
    ...options,
  });
};
