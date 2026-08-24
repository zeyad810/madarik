import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { getFreeStories } from "../api";
import type { FreeStoriesResponse } from "../types";
import type { ApiError } from "@/types";

export const storyQueryKeys = {
  all: ["stories"] as const,
  free: (role?: string) => [...storyQueryKeys.all, "list", role || "public"] as const,
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
  const { data: session, status } = useSession();
  const { userRole, isAuthenticated } = useActiveAccount();

  const role = isAuthenticated ? (userRole || "visitor") : "visitor";
  const token = session?.accessToken || session?.token || null;

  return useQuery({
    queryKey: storyQueryKeys.free(role),
    queryFn: () => getFreeStories(role, token),
    enabled: status !== "loading",
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

