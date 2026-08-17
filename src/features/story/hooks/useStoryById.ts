import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { getStoryById } from "../api";
import { storyQueryKeys } from "./useFreeStories";
import type { StoryDetailResponse } from "../types";
import type { ApiError } from "@/types";

export interface UseStoryByIdOptions<TData = StoryDetailResponse>
  extends Omit<
    UseQueryOptions<StoryDetailResponse, ApiError | Error, TData>,
    "queryKey" | "queryFn"
  > {}

export const useStoryById = <TData = StoryDetailResponse>(
  id: string,
  options?: UseStoryByIdOptions<TData>
): UseQueryResult<TData, ApiError | Error> => {
  return useQuery({
    queryKey: storyQueryKeys.detail(id),
    queryFn: () => getStoryById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
