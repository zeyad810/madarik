import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
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
  const { data: session, status } = useSession();
  const { userRole, isAuthenticated } = useActiveAccount();

  const role = isAuthenticated ? (userRole || "visitor") : "visitor";
  const token = session?.accessToken ?? null;

  return useQuery({
    queryKey: [...storyQueryKeys.detail(id), role],
    queryFn: () => getStoryById(id, role, token),
    enabled: Boolean(id) && status !== "loading",
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
