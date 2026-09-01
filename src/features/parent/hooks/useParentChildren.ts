import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getParentChildren } from "../api";
import { parentQueryKeys } from "../constants";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { getStoredAuthToken } from "@/lib/auth";
import type { Child } from "@/types/auth";

export const useParentChildren = () => {
  const { data: session, status } = useSession();
  const {
    children: sessionChildren,
    isLoading: isSessionLoading,
  } = useActiveAccount();

  const token = getStoredAuthToken(session);

  const query = useQuery({
    queryKey: parentQueryKeys.children(),
    queryFn: async () => {
      const res = await getParentChildren(token);
      const data = (res as any)?.data || (Array.isArray(res) ? res : []);
      const list = (Array.isArray(data) ? data : [data].filter(Boolean)) as Child[];
      return list.map((c: any) => ({
        id: String(c.id),
        account_id: String(c.account_id || session?.user?.id || ""),
        name: c.name || "",
        birth_date: c.birth_date || "",
        gender: c.gender || "male",
        status: c.status || "active",
        avatar_img:
          c.avatar_img ||
          c.avatar ||
          (c.gender === "female" ? "/assets/girl_avatar.png" : "/assets/boy_avatar.png"),
        avatar:
          c.avatar ||
          c.avatar_img ||
          (c.gender === "female" ? "/assets/girl_avatar.png" : "/assets/boy_avatar.png"),
        user_type: c.user_type || "child",
        created_at: c.created_at || "",
        updated_at: c.updated_at || "",
        badges_count: c.badges_count ?? c.badges ?? 0,
        badges: c.badges ?? 0,
      })) as Child[];
    },
    enabled: status === "authenticated" && !!token,
    placeholderData:
      sessionChildren && sessionChildren.length > 0
        ? sessionChildren
        : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const children: Child[] =
    query.data && query.data.length > 0 ? query.data : sessionChildren || [];

  const isLoading =
    (status === "loading" || isSessionLoading) && children.length === 0;

  return {
    ...query,
    children,
    isLoading,
    isFree: false,
  };
};

export default useParentChildren;
