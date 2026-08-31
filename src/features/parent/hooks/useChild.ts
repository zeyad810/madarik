import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { Child } from "@/types/auth";
import { getChild } from "../api";
import { parentQueryKeys } from "../constants";

export const useChild = (childId?: string | null) => {
  const { data: session, status } = useSession();
  const token =
    session?.accessToken ||
    session?.token ||
    (session?.user as { accessToken?: string; token?: string } | undefined)
      ?.accessToken ||
    (session?.user as { accessToken?: string; token?: string } | undefined)
      ?.token ||
    null;

  const query = useQuery({
    queryKey: parentQueryKeys.child(childId || ""),
    queryFn: async () => {
      const response = await getChild(childId as string, token);
      return (response.data || response.child || response) as Child;
    },
    enabled: status === "authenticated" && !!token && !!childId,
    staleTime: 1000 * 60,
  });

  return {
    ...query,
    child: query.data || null,
  };
};

export default useChild;
