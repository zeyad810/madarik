import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getAccountSubscriptionHistory,
  getCurrentSubscription,
  getCurrentSubscriptions,
  getPackageHistory,
  getPackagesList,
} from "../api";
import {
  AccountSubscriptionHistoryResponse,
  CurrentSubscription,
  PackageHistoryItem,
  PackagePlan,
} from "../types";
import { getStoredAuthToken } from "@/lib/auth";

export const packageKeys = {
  all: ["packages"] as const,
  lists: () => [...packageKeys.all, "list"] as const,
  subscription: () => [...packageKeys.all, "subscription"] as const,
  subscriptions: () => [...packageKeys.all, "subscriptions"] as const,
  history: () => [...packageKeys.all, "history"] as const,
  accountHistory: () => [...packageKeys.all, "account-history"] as const,
};

export const usePackagesList = () => {
  return useQuery<PackagePlan[]>({
    queryKey: packageKeys.lists(),
    queryFn: getPackagesList,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCurrentSubscriptions = () => {
  const { data: session } = useSession();
  const token = getStoredAuthToken(session);

  return useQuery<CurrentSubscription[]>({
    queryKey: packageKeys.subscriptions(),
    queryFn: () => getCurrentSubscriptions(token),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCurrentSubscription = () => {
  const { data: session } = useSession();
  const token = getStoredAuthToken(session);

  const query = useQuery<CurrentSubscription | null>({
    queryKey: packageKeys.subscription(),
    queryFn: () => getCurrentSubscription(token),
    staleTime: 2 * 60 * 1000,
  });

  return query;
};

export const usePackageHistory = () => {
  const { data: session, status } = useSession();
  const token = getStoredAuthToken(session);

  return useQuery<PackageHistoryItem[]>({
    queryKey: packageKeys.history(),
    queryFn: () => getPackageHistory(token),
    enabled: status === "authenticated" && !!token,
    staleTime: 2 * 60 * 1000,
  });
};

export const useAccountSubscriptionHistory = () => {
  const { data: session, status } = useSession();
  const token = getStoredAuthToken(session);

  const query = useQuery<AccountSubscriptionHistoryResponse>({
    queryKey: packageKeys.accountHistory(),
    queryFn: () => getAccountSubscriptionHistory(token),
    enabled: status === "authenticated" && !!token,
    staleTime: 2 * 60 * 1000,
  });

  const historyData = query.data?.data;
  const historyList = Array.isArray(historyData) ? historyData : [];

  return {
    ...query,
    data: historyData,
    historyList,
    filters: query.data?.filters,
  };
};

export const useSubscriptionHistory = usePackageHistory;


