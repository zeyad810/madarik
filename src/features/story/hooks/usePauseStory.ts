"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { pauseStory } from "../api";
import type { PauseStoryPayload, PauseStoryResponse } from "../types";
import type { ApiError } from "@/types";

export function usePauseStory(
  storyId: string,
  options?: UseMutationOptions<PauseStoryResponse, ApiError | Error, PauseStoryPayload | void>
) {
  const { data: session } = useSession();
  const { userRole, isAuthenticated, activeChild, activeAccountId, isStudent } = useActiveAccount();

  const role = isAuthenticated ? (userRole || "visitor") : "visitor";
  const token = session?.accessToken || session?.token || null;
  const resolvedChildId =
    (activeChild?.id ? activeChild.id : null) ||
    (activeAccountId && activeAccountId !== "parent" ? activeAccountId : null) ||
    (isStudent && session?.user?.id ? session.user.id : null);

  return useMutation<PauseStoryResponse, ApiError | Error, PauseStoryPayload | void>({
    mutationFn: async (payload) => {
      if (!isAuthenticated && !token) {
        return {
          success: true,
          message: "Guest mode: story pause skipped",
          data: null as unknown as PauseStoryResponse["data"],
        };
      }

      const mergedPayload: PauseStoryPayload = {
        ...(isStudent
          ? { student_id: resolvedChildId || undefined }
          : { child_id: resolvedChildId || undefined }),
        ...(payload || {}),
      };
      return pauseStory(storyId, role, mergedPayload, token);
    },
    ...options,
  });
}
