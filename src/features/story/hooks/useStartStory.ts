"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { startStory } from "../api";
import type { StartStoryPayload, StartStoryResponse } from "../types";
import type { ApiError } from "@/types";

export function useStartStory(
  storyId: string,
  options?: UseMutationOptions<StartStoryResponse, ApiError | Error, StartStoryPayload | void>
) {
  const { data: session } = useSession();
  const { userRole, isAuthenticated, activeChild, activeAccountId, isStudent } = useActiveAccount();

  const role = isAuthenticated ? (userRole || "visitor") : "visitor";
  const token = session?.accessToken || session?.token || null;
  const resolvedChildId =
    (activeChild?.id ? activeChild.id : null) ||
    (activeAccountId && activeAccountId !== "parent" ? activeAccountId : null) ||
    (isStudent && session?.user?.id ? session.user.id : null);

  return useMutation<StartStoryResponse, ApiError | Error, StartStoryPayload | void>({
    mutationFn: (payload) => {
      const mergedPayload: StartStoryPayload = {
        ...(isStudent
          ? { student_id: resolvedChildId || undefined }
          : { child_id: resolvedChildId || undefined }),
        ...(payload || {}),
      };
      return startStory(storyId, role, mergedPayload, token);
    },
    ...options,
  });
}
