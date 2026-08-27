import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  freezeSubscription,
  getCurrentSubscription,
  getPackageHistory,
  getPackagesList,
} from "../api";
import {
  CurrentSubscription,
  FreezeSubscriptionPayload,
  FreezeSubscriptionResponse,
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

  return useQuery<CurrentSubscription>({
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

export const useFreezeSubscription = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = (session as unknown as { accessToken?: string })?.accessToken;

  return useMutation<FreezeSubscriptionResponse, Error, FreezeSubscriptionPayload>({
    mutationFn: (payload) => freezeSubscription(payload, token),
    onSuccess: (data) => {
      queryClient.setQueryData<CurrentSubscription>(
        packageKeys.subscription(),
        (prev) => (data.data ? data.data : prev ? { ...prev, isFrozen: true, status: "frozen" } : undefined)
      );
      queryClient.invalidateQueries({ queryKey: packageKeys.subscription() });
      queryClient.invalidateQueries({ queryKey: packageKeys.history() });
    },
  });
};
