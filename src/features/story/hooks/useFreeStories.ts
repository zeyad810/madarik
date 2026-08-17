import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { getFreeStories } from "../api";
import type { FreeStoriesResponse } from "../types";
import type { ApiError } from "@/types";

export const storyQueryKeys = {
  all: ["stories"] as const,
  free: () => [...storyQueryKeys.all, "free"] as const,
  detail: (id: string) => [...storyQueryKeys.all, "detail", id] as const,
};

export interface UseFreeStoriesOptions<TData = FreeStoriesResponse>
  extends Omit<
    UseQueryOptions<FreeStoriesResponse, ApiError | Error, TData>,
    "queryKey" | "queryFn"
  > {}

export const useFreeStories = <TData = FreeStoriesResponse>(
  options?: UseFreeStoriesOptions<TData>
): UseQueryResult<TData, ApiError | Error> => {
  return useQuery({
    queryKey: storyQueryKeys.free(),
    queryFn: getFreeStories,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
