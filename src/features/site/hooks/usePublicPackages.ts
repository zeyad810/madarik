import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { getPublicPackages } from "../api";
import type { PublicPackagesData } from "../types";
import type { ApiResponse, ApiError } from "@/types";
import { siteQueryKeys } from "./usePublicLanding";

export interface UsePublicPackagesOptions<TData = ApiResponse<PublicPackagesData>>
  extends Omit<
    UseQueryOptions<ApiResponse<PublicPackagesData>, ApiError | Error, TData>,
    "queryKey" | "queryFn"
  > {}

export const usePublicPackages = <TData = ApiResponse<PublicPackagesData>>(
  options?: UsePublicPackagesOptions<TData>
): UseQueryResult<TData, ApiError | Error> => {
  return useQuery({
    queryKey: [...siteQueryKeys.all, "packages"] as const,
    queryFn: getPublicPackages,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
