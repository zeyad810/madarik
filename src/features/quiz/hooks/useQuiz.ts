// ────────────────────────────────────────────────────────────────────────────
// useQuiz — fetches quiz data for the current user's role
// ────────────────────────────────────────────────────────────────────────────

import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { getQuiz } from "../api";
import { quizQueryKeys } from "../constants";
import type { QuizResponse } from "../types";
import type { ApiError } from "@/types";

export interface UseQuizOptions<TData = QuizResponse>
  extends Omit<UseQueryOptions<QuizResponse, ApiError | Error, TData>, "queryKey" | "queryFn"> {}

export function useQuiz<TData = QuizResponse>(
  quizId: string | null | undefined,
  options?: UseQuizOptions<TData>
): UseQueryResult<TData, ApiError | Error> {
  const { data: session, status } = useSession();
  const { userRole, isAuthenticated } = useActiveAccount();

  // Resolve role: visitor when not authenticated or no parent role
  const role = isAuthenticated ? (userRole || "visitor") : "visitor";
  const token = session?.accessToken ?? null;

  return useQuery({
    queryKey: quizQueryKeys.detail(role, quizId ?? ""),
    queryFn: () => getQuiz(quizId!, role, token),
    enabled: Boolean(quizId) && status !== "loading",
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
