import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getCurrentSubscription,
  getPackageHistory,
  getPackagesList,
} from "../api";
import {
  CurrentSubscription,
  PackageHistoryItem,
  PackagePlan,
} from "../types";

export const packageKeys = {
  all: ["packages"] as const,
  lists: () => [...packageKeys.all, "list"] as const,
  subscription: () => [...packageKeys.all, "subscription"] as const,
  history: () => [...packageKeys.all, "history"] as const,
};

export const usePackagesList = () => {
  return useQuery<PackagePlan[]>({
    queryKey: packageKeys.lists(),
    queryFn: getPackagesList,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCurrentSubscription = () => {
  const { data: session } = useSession();
  const token = (session as unknown as { accessToken?: string })?.accessToken;

  return useQuery<CurrentSubscription | null>({
    queryKey: packageKeys.subscription(),
    queryFn: () => getCurrentSubscription(token),
    staleTime: 2 * 60 * 1000,
  });
};

export const usePackageHistory = () => {
  const { data: session } = useSession();
  const token = (session as unknown as { accessToken?: string })?.accessToken;

  return useQuery<PackageHistoryItem[]>({
    queryKey: packageKeys.history(),
    queryFn: () => getPackageHistory(token),
    staleTime: 2 * 60 * 1000,
  });
};

