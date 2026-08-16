import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { getPublicLandingData } from "../api";
import type { PublicLandingData } from "../types";
import type { ApiResponse, ApiError } from "@/types";

/**
 * Centralized query key factory for site resources.
 */
export const siteQueryKeys = {
  all: ["site"] as const,
  public: () => [...siteQueryKeys.all, "public"] as const,
};

/**
 * Options for usePublicLanding hook.
 */
export interface UsePublicLandingOptions<TData = ApiResponse<PublicLandingData>>
  extends Omit<
    UseQueryOptions<ApiResponse<PublicLandingData>, ApiError | Error, TData>,
    "queryKey" | "queryFn"
  > {}

/**
 * Single hook to fetch public landing page data (GET /public).
 *
 * @example
 * // 1. Fetch entire response
 * const { data, isLoading } = usePublicLanding();
 *
 * @example
 * // 2. Fetch with custom selector
 * const { data: faq } = usePublicLanding({
 *   select: (res) => res.data?.faq_section,
 * });
 */
export const usePublicLanding = <TData = ApiResponse<PublicLandingData>>(
  options?: UsePublicLandingOptions<TData>
): UseQueryResult<TData, ApiError | Error> => {
  return useQuery({
    queryKey: siteQueryKeys.public(),
    queryFn: getPublicLandingData,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
