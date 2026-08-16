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
