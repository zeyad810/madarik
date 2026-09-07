import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { getPublicTerms, getPublicPrivacy } from "../api";
import type { LegalItem } from "../types";
import type { ApiResponse, ApiError } from "@/types";

/**
 * Extended query keys for legal resources
 */
export const legalQueryKeys = {
  terms: () => ["site", "terms"] as const,
  privacy: () => ["site", "privacy"] as const,
};

export interface UseLegalOptions<TData = ApiResponse<LegalItem[]>>
  extends Omit<
    UseQueryOptions<ApiResponse<LegalItem[]>, ApiError | Error, TData>,
    "queryKey" | "queryFn"
  > {}

/**
 * Hook to fetch Terms & Conditions items
 */
export const usePublicTerms = <TData = ApiResponse<LegalItem[]>>(
  options?: UseLegalOptions<TData>
): UseQueryResult<TData, ApiError | Error> => {
  return useQuery({
    queryKey: legalQueryKeys.terms(),
    queryFn: getPublicTerms,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch Privacy Policy items
 */
export const usePublicPrivacy = <TData = ApiResponse<LegalItem[]>>(
  options?: UseLegalOptions<TData>
): UseQueryResult<TData, ApiError | Error> => {
  return useQuery({
    queryKey: legalQueryKeys.privacy(),
    queryFn: getPublicPrivacy,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};
