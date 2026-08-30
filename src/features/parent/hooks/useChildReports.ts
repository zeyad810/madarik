import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getParentChildReports, getChildReport } from "../api";
import { parentQueryKeys } from "../constants";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import type { ChildReportItem } from "../types";

export const useChildReports = () => {
  const { data: session, status } = useSession();
  const { children: sessionChildren, isLoading: isSessionLoading } = useActiveAccount();
  const token = session?.accessToken || session?.token || null;

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

export const useChildReport = (childId: string) => {
  const { data: session, status } = useSession();
  const token = session?.accessToken || session?.token || null;
  const { reports, isLoading: isReportsLoading, refetch: refetchAll } = useChildReports();

  const singleQuery = useQuery({
    queryKey: parentQueryKeys.childReport(childId),
    queryFn: async () => {
      const res = await getChildReport(childId, token);
      return (res?.data || res?.report || res) as ChildReportItem;
    },
    enabled: status === "authenticated" && !!token && !!childId,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const fallbackChild = reports.find((c) => String(c.id) === String(childId)) || null;
  const child = singleQuery.data || fallbackChild;

  const isLoading =
    (status === "loading" || singleQuery.isLoading || isReportsLoading) && !child;

  const refetch = async () => {
    await Promise.all([singleQuery.refetch(), refetchAll()]);
  };

  return {
    child,
    isLoading,
    isError: singleQuery.isError,
    refetch,
  };
};

export default useChildReports;

