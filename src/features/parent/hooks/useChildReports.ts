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
      const raw: any =
        res?.data?.data ||
        res?.data?.child ||
        res?.data?.report ||
        res?.data ||
        res?.report ||
        res?.child ||
        res;

      if (!raw || (!raw.id && !raw.name)) {
        return null;
      }

      const normalized: ChildReportItem = {
        id: String(raw.id || childId),
        account_id: String(raw.account_id || session?.user?.id || ""),
        avatar_img: raw.avatar_img || raw.avatar || null,
        avatar: raw.avatar || raw.avatar_img || null,
        name: raw.name || "",
        birth_date: raw.birth_date || "",
        gender: raw.gender || "male",
        status: raw.status || "active",
        created_at: raw.created_at || "",
        updated_at: raw.updated_at || "",
        quizzes_count: Number(raw.quizzes_count ?? raw.quiz_attempts?.length ?? 0),
        average_score: Number(raw.average_score ?? 0),
        stories_read_count: Number(raw.stories_read_count ?? raw.reading_activities?.length ?? 0),
        badges_count: Number(raw.badges_count ?? raw.badges ?? raw.user_badges?.length ?? 0),
        user_type: raw.user_type || "child",
        reading_activities: raw.reading_activities || [],
        quiz_attempts: raw.quiz_attempts || [],
        user_badges: raw.user_badges || [],
      };

      return normalized;
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

