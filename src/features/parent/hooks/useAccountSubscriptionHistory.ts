import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getAccountSubscriptionHistory } from "../api";
import { parentQueryKeys } from "../constants";
import { getStoredAuthToken } from "@/lib/auth";
import type { AccountSubscriptionHistoryResponse } from "../types";

export const useAccountSubscriptionHistory = () => {
  const { data: session, status } = useSession();
  const token = getStoredAuthToken(session);

  const query = useQuery<AccountSubscriptionHistoryResponse>({
    queryKey: parentQueryKeys.subscriptionHistory(),
    queryFn: () => getAccountSubscriptionHistory(token),
    enabled: status === "authenticated" && !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const historyData = query.data?.data;

  return {
    ...query,
    data: historyData,
    account: historyData?.account,
    childrenCount: historyData?.children_count ?? 0,
    isSubscribed: Boolean(historyData?.is_subscribed),
    unlockedAgeCategories: historyData?.unlocked_age_categories ?? [],
  };
};

export default useAccountSubscriptionHistory;
