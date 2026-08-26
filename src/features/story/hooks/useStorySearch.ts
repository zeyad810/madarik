"use client";

import { useState, useEffect, useMemo } from "react";
import { useFreeStories } from "./useFreeStories";
import type { Story } from "../types";

export interface UseStorySearchOptions {
  debounceMs?: number;
  enabled?: boolean;
}

export function useStorySearch(
  query: string,
  options: UseStorySearchOptions = {}
) {
  const { debounceMs = 300, enabled = true } = options;
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setIsDebouncing(false);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceMs]);

  const trimmedQuery = debouncedQuery.trim();

  const { data, isLoading, isFetching, isError, error, refetch } = useFreeStories(
    { search: trimmedQuery || undefined },
    { enabled }
  );

  const stories = useMemo<Story[]>(() => {
    if (!data) return [];
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray((data as any)?.data?.data)) return (data as any).data.data;
    return [];
  }, [data]);

  return {
    stories,
    query,
    debouncedQuery: trimmedQuery,
    isDebouncing,
    isLoading: isLoading || (isDebouncing && !stories.length),
    isFetching,
    isError,
    error,
    refetch,
    hasResults: stories.length > 0,
  };
}
