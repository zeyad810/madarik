"use client";

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { finishStory } from "../api";
import { storyQueryKeys } from "./useFreeStories";
import { parentQueryKeys } from "@/features/parent/constants";
import type { FinishStoryPayload, FinishStoryResponse } from "../types";
import type { ApiError } from "@/types";

export function useFinishStory(
  storyId: string,
  options?: UseMutationOptions<FinishStoryResponse, ApiError | Error, FinishStoryPayload | void>
) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { userRole, isAuthenticated, activeChild, activeAccountId } = useActiveAccount();

  const role = isAuthenticated ? (userRole || "visitor") : "visitor";
  const token = session?.accessToken || session?.token || null;
  const childId =
    (activeChild?.id ? activeChild.id : null) ||
    (activeAccountId && activeAccountId !== "parent" ? activeAccountId : null);

  return useMutation<FinishStoryResponse, ApiError | Error, FinishStoryPayload | void>({
    mutationFn: (payload) => {
      const mergedPayload: FinishStoryPayload = {
        child_id: childId,
        student_id: childId,
        ...(payload || {}),
      };
      return finishStory(storyId, role, mergedPayload, token);
    },
    onSuccess: (data, variables, context) => {
      // Invalidate relevant queries to refresh reading activities, reports, and badges
      queryClient.invalidateQueries({ queryKey: storyQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: parentQueryKeys.reports() });
      queryClient.invalidateQueries({ queryKey: parentQueryKeys.children() });
      queryClient.invalidateQueries({ queryKey: ["child-reports"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
      queryClient.invalidateQueries({ queryKey: ["student-reports"] });
      queryClient.invalidateQueries({ queryKey: ["attempts"] });
      queryClient.invalidateQueries({ queryKey: ["results"] });

      if (options?.onSuccess) {
        (options.onSuccess as Function)(data, variables, context);
      }
    },
    ...options,
  });
}
