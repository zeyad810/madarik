// ────────────────────────────────────────────────────────────────────────────
// useSubmitQuiz — mutation for submitting the complete quiz
// ────────────────────────────────────────────────────────────────────────────

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { submitQuiz } from "../api";
import type { SubmitQuizPayload, SubmitQuizResponse } from "../types";
import type { ApiError } from "@/types";

export function useSubmitQuiz(
  quizId: string,
  options?: UseMutationOptions<SubmitQuizResponse, ApiError | Error, SubmitQuizPayload>
) {
  const { data: session } = useSession();
  const { userRole, isAuthenticated } = useActiveAccount();

  const role = isAuthenticated ? (userRole || "visitor") : "visitor";
  const token = session?.accessToken || session?.token || null;

  return useMutation<SubmitQuizResponse, ApiError | Error, SubmitQuizPayload>({
    mutationFn: (payload) => submitQuiz(quizId, role, payload, token),
    ...options,
  });
}
