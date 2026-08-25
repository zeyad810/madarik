// ────────────────────────────────────────────────────────────────────────────
// useSubmitQuiz — mutation for submitting the complete quiz
// ────────────────────────────────────────────────────────────────────────────

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { submitQuiz } from "../api";
import { quizQueryKeys } from "../constants";
import type { SubmitQuizPayload, SubmitQuizResponse } from "../types";
import type { ApiError } from "@/types";

export function useSubmitQuiz(
  quizId: string,
  options?: UseMutationOptions<SubmitQuizResponse, ApiError | Error, SubmitQuizPayload>
) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { userRole, isAuthenticated, activeChild, activeAccountId } = useActiveAccount();

  const role = isAuthenticated ? (userRole || "visitor") : "visitor";
  const token = session?.accessToken || session?.token || null;
  const childId =
    (activeChild?.id ? activeChild.id : null) ||
    (activeAccountId && activeAccountId !== "parent" ? activeAccountId : null);

  return useMutation<SubmitQuizResponse, ApiError | Error, SubmitQuizPayload>({
    mutationFn: (payload) => submitQuiz(quizId, role, payload, token, childId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: quizQueryKeys.all });
      if (options?.onSuccess) {
        (options.onSuccess as Function)(data, variables, context);
      }
    },
    ...options,
  });
}
