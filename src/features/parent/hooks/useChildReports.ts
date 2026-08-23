import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getParentChildReports } from "../api";
import { parentQueryKeys } from "../constants";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import type { ChildReportItem } from "../types";

export const useChildReports = () => {
  const { data: session, status } = useSession();
  const { children: sessionChildren, isLoading: isSessionLoading } = useActiveAccount();
  const token = session?.accessToken ?? null;

  const query = useQuery({
    queryKey: parentQueryKeys.reports(),
    queryFn: async () => {
      const res = await getParentChildReports(token);
      const list = res.data || [];
      return list as ChildReportItem[];
    },
    enabled: status === "authenticated" && !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const reports: ChildReportItem[] =
    query.data !== undefined
      ? query.data
      : (sessionChildren || []).map((c) => ({
          id: String(c.id),
          account_id: String(c.account_id || session?.user?.id || ""),
          avatar_img: c.avatar_img || null,
          avatar: c.avatar || null,
          name: c.name,
          birth_date: c.birth_date,
          gender: c.gender,
          status: c.status || "active",
          created_at: c.created_at || "",
          updated_at: c.updated_at || "",
          quizzes_count: 0,
          average_score: 0,
          stories_read_count: 0,
          badges_count: c.badges_count ?? c.badges ?? 0,
          user_type: c.user_type || "child",
          reading_activities: [],
          quiz_attempts: [],
          user_badges: [],
        }));

  const isLoading =
    (status === "loading" || isSessionLoading || query.isLoading) && reports.length === 0;

  return {
    ...query,
    reports,
    isLoading,
  };
};

export default useChildReports;
