// ────────────────────────────────────────────────────────────────────────────
// useCheckQuizAnswer — mutation for checking a single answer
// ────────────────────────────────────────────────────────────────────────────

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { checkQuizAnswer } from "../api";
import type { CheckAnswerPayload, CheckAnswerResponse } from "../types";
import type { ApiError } from "@/types";

export function useCheckQuizAnswer(
  quizId: string,
  options?: UseMutationOptions<CheckAnswerResponse, ApiError | Error, CheckAnswerPayload>
) {
  const { data: session } = useSession();
  const { userRole, isAuthenticated } = useActiveAccount();

  const role = isAuthenticated ? (userRole || "visitor") : "visitor";
  const token = session?.accessToken ?? null;

  return useMutation<CheckAnswerResponse, ApiError | Error, CheckAnswerPayload>({
    mutationFn: (payload) => checkQuizAnswer(quizId, role, payload, token),
    ...options,
  });
}
