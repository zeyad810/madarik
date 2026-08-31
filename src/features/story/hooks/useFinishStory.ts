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
  const { userRole, isAuthenticated, activeChild, activeAccountId, isStudent } = useActiveAccount();

  const role = isAuthenticated ? (userRole || "visitor") : "visitor";
  const token = session?.accessToken || session?.token || null;
  const resolvedChildId =
    (activeChild?.id ? activeChild.id : null) ||
    (activeAccountId && activeAccountId !== "parent" ? activeAccountId : null) ||
    (isStudent && session?.user?.id ? session.user.id : null);

  return useMutation<FinishStoryResponse, ApiError | Error, FinishStoryPayload | void>({
    mutationFn: async (payload) => {
      // Guard: Do not run finish story for unauthenticated guest users
      if (!isAuthenticated && !token) {
        return {
          success: true,
          message: "Guest mode: story finish skipped",
          data: null as unknown as FinishStoryResponse["data"],
        };
      }

      const mergedPayload: FinishStoryPayload = {
        ...(isStudent
          ? { student_id: resolvedChildId || undefined }
          : { child_id: resolvedChildId || undefined }),
        ...(payload || {}),
      };
      return finishStory(storyId, role, mergedPayload, token);
    },
    onSuccess: (data, variables, context) => {
      // Invalidate relevant queries only for authenticated users
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: parentQueryKeys.reports() });
        queryClient.invalidateQueries({ queryKey: parentQueryKeys.children() });
        queryClient.invalidateQueries({ queryKey: ["child-reports"] });
        queryClient.invalidateQueries({ queryKey: ["student"] });
        queryClient.invalidateQueries({ queryKey: ["student-reports"] });
        queryClient.invalidateQueries({ queryKey: ["reading-activities"] });
        queryClient.invalidateQueries({ queryKey: ["reading-activity"] });
        queryClient.invalidateQueries({ queryKey: ["attempts"] });
        queryClient.invalidateQueries({ queryKey: ["results"] });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }

      if (options?.onSuccess) {
        (options.onSuccess as Function)(data, variables, context);
      }
    },
    ...options,
  });
}

