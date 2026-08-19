// ────────────────────────────────────────────────────────────────────────────
// useQuizHistory — fetches past quiz attempts (parent/child/student only)
// Gracefully returns empty if API endpoint doesn't exist yet (404 silenced).
// ────────────────────────────────────────────────────────────────────────────

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { getQuizHistory } from "../api";
import { quizQueryKeys, ROLES_WITH_HISTORY } from "../constants";
import type { QuizHistoryResponse } from "../types";

export function useQuizHistory(
  quizId: string | null | undefined
): UseQueryResult<QuizHistoryResponse, Error> {
  const { data: session, status } = useSession();
  const { userRole, isAuthenticated } = useActiveAccount();

  const role = isAuthenticated ? (userRole || "parent") : "visitor";
  const token = session?.accessToken ?? null;
  const hasAccess = ROLES_WITH_HISTORY.includes(role as (typeof ROLES_WITH_HISTORY)[number]);

  return useQuery({
    queryKey: quizQueryKeys.history(role, quizId ?? ""),
    queryFn: async () => {
      try {
        return await getQuizHistory(quizId!, role, token);
      } catch {
        // History endpoint may not exist yet — return empty gracefully
        return { success: true, data: [] } satisfies QuizHistoryResponse;
      }
    },
    enabled: Boolean(quizId) && hasAccess && status !== "loading",
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}
