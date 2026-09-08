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
  targetId?: string | null | undefined
): UseQueryResult<QuizHistoryResponse, Error> {
  const { data: session, status } = useSession();
  const {
    userRole,
    isAuthenticated,
    activeChild,
    activeAccountId,
    isStudent,
    activeAccount,
  } = useActiveAccount();

  const role = isAuthenticated ? (userRole || "parent") : "visitor";
  const token = session?.accessToken || session?.token || null;
  const hasAccess = ROLES_WITH_HISTORY.includes(
    role as (typeof ROLES_WITH_HISTORY)[number]
  );

  // Resolve ID for history request:
  // For student: user's own id (child_id on backend)
  // For parent/child: active child id > activeAccountId > targetId
  const studentId =
    isStudent || role === "student"
      ? session?.user?.id ||
        (session?.user as any)?.user?.id ||
        activeAccount?.id ||
        (activeAccountId && activeAccountId !== "parent" ? activeAccountId : null)
      : null;

  const childId =
    studentId ||
    (activeChild?.id ? activeChild.id : null) ||
    (activeAccountId && activeAccountId !== "parent" ? activeAccountId : null);

  const resolvedTargetId = childId || targetId || null;

  return useQuery({
    queryKey: quizQueryKeys.history(role, resolvedTargetId ?? "all"),
    queryFn: async () => {
      try {
        return await getQuizHistory(resolvedTargetId, role, token);
      } catch {
        return { success: true, data: [] } satisfies QuizHistoryResponse;
      }
    },
    enabled: hasAccess && status !== "loading",
    staleTime: 0,
    refetchOnMount: "always",
    retry: false,
  });
}

