import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getParentChildren } from "../api";
import { parentQueryKeys } from "../constants";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import type { Child } from "@/types/auth";

export const useParentChildren = () => {
  const { data: session, status } = useSession();
  const { children: sessionChildren, isLoading: isSessionLoading } = useActiveAccount();
  const token = session?.accessToken ?? null;

  const query = useQuery({
    queryKey: parentQueryKeys.children(),
    queryFn: async () => {
      const res = await getParentChildren(token);
      return res.data || [];
    },
    enabled: status === "authenticated" && !!token,
    initialData: sessionChildren && sessionChildren.length > 0 ? sessionChildren : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const children: Child[] =
    query.data && query.data.length > 0
      ? query.data
      : sessionChildren || [];

  const isLoading =
    (status === "loading" || isSessionLoading) && children.length === 0;

  return {
    ...query,
    children,
    isLoading,
  };
};
