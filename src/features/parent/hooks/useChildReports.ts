import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getParentChildReports, getChildReport } from "../api";
import { parentQueryKeys } from "../constants";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { getStoredAuthToken } from "@/lib/auth";
import type { ChildReportItem } from "../types";

export const useChildReports = () => {
  const { data: session, status } = useSession();
  const { children: sessionChildren, isLoading: isSessionLoading } = useActiveAccount();
  const token = getStoredAuthToken(session);

  const query = useQuery({
    queryKey: parentQueryKeys.reports(),
    queryFn: async () => {
      const res = await getParentChildReports(token);
      const rawData = (res as any)?.data || (res as any)?.children || res || [];
      const list: any[] = Array.isArray(rawData) ? rawData : [rawData].filter(Boolean);
      return list.map((c: any) => ({
        id: String(c.id),
        account_id: String(c.account_id || session?.user?.id || ""),
        avatar_img: c.avatar_img || c.avatar || null,
        avatar: c.avatar || c.avatar_img || null,
        name: c.name || "",
        birth_date: c.birth_date || "",
        gender: c.gender || "male",
        status: c.status || "active",
        created_at: c.created_at || "",
        updated_at: c.updated_at || "",
        quizzes_count: Number(c.quizzes_count ?? c.quiz_attempts?.length ?? 0),
        average_score: Number(c.average_score ?? 0),
        stories_read_count: Number(c.stories_read_count ?? c.reading_activities?.length ?? 0),
        badges_count: Number(c.badges_count ?? c.badges ?? c.user_badges?.length ?? 0),
        user_type: c.user_type || "child",
        reading_activities: c.reading_activities || [],
        quiz_attempts: c.quiz_attempts || [],
        user_badges: c.user_badges || [],
      })) as ChildReportItem[];
    },
    enabled: status === "authenticated" && !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const reports: ChildReportItem[] =
    query.data !== undefined && query.data.length > 0
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
  const token = getStoredAuthToken(session);
  const { reports, isLoading: isReportsLoading, refetch: refetchAll } = useChildReports();

  const singleQuery = useQuery({
    queryKey: parentQueryKeys.childReport(childId),
    queryFn: async () => {
      const res = await getChildReport(childId, token);
      const resData = (res as any)?.data || (res as any)?.report || res;

      if (!resData) return null;

      const rawChild: any = resData.child || (resData.id || resData.name ? resData : null);
      const rawStats: any = resData.stats || {};
      const rawQuizResults: any[] = resData.quiz_results || resData.quiz_attempts || [];
      const rawReadingLog: any[] = resData.reading_log || resData.reading_activities || [];

      const fallbackFromList = reports.find((c) => String(c.id) === String(childId));
      const effectiveChild = rawChild || fallbackFromList;

      if (!effectiveChild && rawQuizResults.length === 0 && rawReadingLog.length === 0) {
        return null;
      }

      const normalizedChild: ChildReportItem = {
        id: String(effectiveChild?.id || childId),
        account_id: String(effectiveChild?.account_id || session?.user?.id || ""),
        avatar_img: effectiveChild?.avatar_img || effectiveChild?.avatar || null,
        avatar: effectiveChild?.avatar || effectiveChild?.avatar_img || null,
        name: effectiveChild?.name || "",
        birth_date: effectiveChild?.birth_date || "",
        gender: effectiveChild?.gender || "male",
        status: effectiveChild?.status || "active",
        created_at: effectiveChild?.created_at || "",
        updated_at: effectiveChild?.updated_at || "",
        quizzes_count: Number(
          rawStats.quizzes_count ??
            effectiveChild?.quizzes_count ??
            rawQuizResults.length
        ),
        average_score: Number(
          rawStats.average_success_rate ??
            rawStats.average_score ??
            effectiveChild?.average_score ??
            0
        ),
        stories_read_count: Number(
          rawStats.stories_read_count ??
            effectiveChild?.stories_read_count ??
            rawReadingLog.length
        ),
        badges_count: Number(
          effectiveChild?.badges_count ??
            effectiveChild?.badges ??
            effectiveChild?.user_badges?.length ??
            0
        ),
        user_type: effectiveChild?.user_type || "child",
        reading_activities: effectiveChild?.reading_activities || [],
        quiz_attempts: effectiveChild?.quiz_attempts || [],
        user_badges: effectiveChild?.user_badges || [],
      };

      return {
        child: normalizedChild,
        stats: {
          average_score: normalizedChild.average_score,
          quizzes_count: normalizedChild.quizzes_count,
          stories_read_count: normalizedChild.stories_read_count,
          badges_count: normalizedChild.badges_count,
        },
        rawQuizResults,
        rawReadingLog,
      };
    },
    enabled: status === "authenticated" && !!token && !!childId,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const fallbackChild = reports.find((c) => String(c.id) === String(childId)) || null;
  const child = singleQuery.data?.child || fallbackChild;
  const stats = singleQuery.data?.stats;
  const rawQuizResults = singleQuery.data?.rawQuizResults;
  const rawReadingLog = singleQuery.data?.rawReadingLog;

  const isLoading =
    (status === "loading" || singleQuery.isLoading || isReportsLoading) && !child;

  const refetch = async () => {
    await Promise.all([singleQuery.refetch(), refetchAll()]);
  };

  return {
    child,
    stats,
    rawQuizResults,
    rawReadingLog,
    isLoading,
    isError: singleQuery.isError,
    refetch,
  };
};

export default useChildReports;

