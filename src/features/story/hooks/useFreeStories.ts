"use client";

import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { getFreeStories } from "../api";
import type { FreeStoriesResponse } from "../types";
import type { ApiError } from "@/types";

export const storyQueryKeys = {
  all: ["stories"] as const,
  lists: () => [...storyQueryKeys.all, "list"] as const,
  free: (role?: string, search?: string) =>
    [...storyQueryKeys.lists(), role || "public", ...(search ? [{ search }] : [])] as const,
  detail: (id: string) => [...storyQueryKeys.all, "detail", id] as const,
};

export interface UseFreeStoriesParams {
  search?: string;
}

export interface UseFreeStoriesOptions<TData = FreeStoriesResponse>
  extends Omit<
    UseQueryOptions<FreeStoriesResponse, ApiError | Error, TData>,
    "queryKey" | "queryFn"
  > {}

export const useFreeStories = <TData = FreeStoriesResponse>(
  paramsOrOptions?: UseFreeStoriesParams | UseFreeStoriesOptions<TData>,
  options?: UseFreeStoriesOptions<TData>
): UseQueryResult<TData, ApiError | Error> => {
  // Support both useFreeStories(options) and useFreeStories({ search: "..." }, options)
  const isParams =
    paramsOrOptions &&
    ("search" in paramsOrOptions && typeof paramsOrOptions.search !== "function");
  const params: UseFreeStoriesParams = isParams
    ? (paramsOrOptions as UseFreeStoriesParams)
    : {};
  const queryOptions: UseFreeStoriesOptions<TData> | undefined = isParams
    ? options
    : (paramsOrOptions as UseFreeStoriesOptions<TData>);

  const { data: session, status } = useSession();
  const { userRole, isAuthenticated } = useActiveAccount();

  const role = isAuthenticated ? userRole || "visitor" : "visitor";
  const token = session?.accessToken || session?.token || null;
  const search = params.search?.trim();

  return useQuery({
    queryKey: storyQueryKeys.free(role, search),
    queryFn: () => getFreeStories(role, token, search),
    enabled: status !== "loading",
    staleTime: 5 * 60 * 1000,
    ...queryOptions,
  });
};

