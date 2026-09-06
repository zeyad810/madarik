"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { resumeStory } from "../api";
import type { ResumeStoryPayload, ResumeStoryResponse } from "../types";
import type { ApiError } from "@/types";

export function useResumeStory(
  storyId: string,
  options?: UseMutationOptions<ResumeStoryResponse, ApiError | Error, ResumeStoryPayload | void>
) {
  const { data: session } = useSession();
  const { userRole, isAuthenticated, activeChild, activeAccountId, isStudent } = useActiveAccount();

  const role = isAuthenticated ? (userRole || "visitor") : "visitor";
  const token = session?.accessToken || session?.token || null;
  const resolvedChildId =
    (activeChild?.id ? activeChild.id : null) ||
    (activeAccountId && activeAccountId !== "parent" ? activeAccountId : null) ||
    (isStudent && session?.user?.id ? session.user.id : null);

  return useMutation<ResumeStoryResponse, ApiError | Error, ResumeStoryPayload | void>({
    mutationFn: async (payload) => {
      if (!isAuthenticated && !token) {
        return {
          success: true,
          message: "Guest mode: story resume skipped",
          data: null as unknown as ResumeStoryResponse["data"],
        };
      }

      const mergedPayload: ResumeStoryPayload = {
        ...(isStudent
          ? { student_id: resolvedChildId || undefined }
          : { child_id: resolvedChildId || undefined }),
        ...(payload || {}),
      };
      return resumeStory(storyId, role, mergedPayload, token);
    },
    ...options,
  });
}
