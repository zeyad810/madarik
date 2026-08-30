import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getParentChildren, getFreeChild } from "../api";
import { parentQueryKeys } from "../constants";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { isFreeRole } from "@/lib/roles";
import type { Child } from "@/types/auth";

export const useParentChildren = () => {
  const { data: session, status } = useSession();
  const {
    children: sessionChildren,
    isLoading: isSessionLoading,
    isFreeCustomer,
    sessionUserType,
    user_type,
  } = useActiveAccount();

  const token =
    session?.accessToken ||
    session?.token ||
    (session?.user as any)?.accessToken ||
    (session?.user as any)?.token ||
    null;

  const isFree =
    isFreeCustomer ||
    isFreeRole(sessionUserType) ||
    isFreeRole(session?.user_type) ||
    isFreeRole((session?.user as any)?.user_type) ||
    isFreeRole(user_type) ||
    session?.is_subscribed === false;

  const queryKey = isFree ? (["free", "child"] as const) : parentQueryKeys.children();

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (isFree) {
        const res = await getFreeChild(token);
        const childData: any = res?.data || res?.child || res;
        if (childData && (childData.id || childData.name)) {
          const normalizedChild: Child = {
            id: String(childData.id || "free-child"),
            account_id: String(childData.account_id || session?.user?.id || ""),
            name: childData.name || "الطفل",
            birth_date: childData.birth_date || "",
            gender: childData.gender || "male",
            status: childData.status || "active",
            avatar_img:
              childData.avatar_img ||
              childData.avatar ||
              (childData.gender === "female"
                ? "/assets/girl_avatar.png"
                : "/assets/boy_avatar.png"),
            avatar:
              childData.avatar ||
              childData.avatar_img ||
              (childData.gender === "female"
                ? "/assets/girl_avatar.png"
                : "/assets/boy_avatar.png"),
            user_type: childData.user_type || "child",
            created_at: childData.created_at || new Date().toISOString(),
            updated_at: childData.updated_at || new Date().toISOString(),
            badges_count: childData.badges_count ?? childData.badges ?? 0,
            badges: childData.badges ?? 0,
          };
          return [normalizedChild];
        }
        return [];
      } else {
        const res = await getParentChildren(token);
        const data = (res as any)?.data || (Array.isArray(res) ? res : []);
        return (Array.isArray(data) ? data : [data].filter(Boolean)) as Child[];
      }
    },
    enabled: status === "authenticated" && !!token,
    initialData:
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
    isFree,
  };
};

export default useParentChildren;
