"use client";

import { useEffect } from "react";
import { getPaymentState } from "../paymentFlow";
import { useMutation, useQuery, useQueryClient, type Query } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  checkoutSubscription,
  getSubscription,
  getSubscriptionHistory,
  verifySubscriptionPayment,
} from "../api";
import {
  CheckoutSubscriptionPayload,
  CheckoutSubscriptionResponse,
  SubscriptionData,
  SubscriptionHistoryData,
  VerifyPaymentData,
} from "../types";

export const subscriptionKeys = {
  all: ["subscription"] as const,
  current: () => [...subscriptionKeys.all, "current"] as const,
  history: (status?: string | null) => [...subscriptionKeys.all, "history", status || "all"] as const,
  verify: (id: string, streamPayId?: string | null) =>
    [...subscriptionKeys.all, "verify", id, streamPayId || ""] as const,
};

/**
 * Hook to retrieve current parent's active subscription and unlocked age categories.
 * Calls GET /subscription
 */
export function useSubscription() {
  const { data: session, status } = useSession();
  const token = (session as unknown as { accessToken?: string })?.accessToken;
  const isAuthenticated = status === "authenticated";

  return useQuery<SubscriptionData>({
    queryKey: subscriptionKeys.current(),
    queryFn: async () => {
      const response = await getSubscription(token);
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to retrieve parent subscription history and dashboard stats.
 * Calls GET /subscription/history?status={status}
 */
export function useSubscriptionHistory(statusFilter?: "active" | "expired" | "cancelled" | string | null) {
  const { data: session, status } = useSession();
  const token = (session as unknown as { accessToken?: string })?.accessToken;
  const isAuthenticated = status === "authenticated";

  return useQuery<SubscriptionHistoryData>({
    queryKey: subscriptionKeys.history(statusFilter),
    queryFn: async () => {
      const response = await getSubscriptionHistory(statusFilter, token);
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to initiate subscription checkout with StreamPay.
 * Calls POST /subscription/checkout
 */
export function useCheckoutSubscription() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = (session as unknown as { accessToken?: string })?.accessToken;

  return useMutation<CheckoutSubscriptionResponse, Error, CheckoutSubscriptionPayload>({
    mutationFn: (payload: CheckoutSubscriptionPayload) => checkoutSubscription(payload, token),
    onSuccess: () => {
      // Invalidate subscription and packages queries
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["packageHistory"] });
    },
  });
}

export interface VerifyPaymentHookOptions {
  enabled?: boolean;
  refetchInterval?: number | false | ((query: Query<VerifyPaymentData, Error>) => number | false);
}

/**
 * Hook to verify subscription payment status (e.g., after StreamPay return or 3DS return).
 * Calls GET /subscription/payment/{paymentId}?id={streamPayId}
 */
export function useVerifySubscriptionPayment(
  paymentId: string | null | undefined,
  streamPayIdOrOptions?: string | null | VerifyPaymentHookOptions,
  maybeOptions?: VerifyPaymentHookOptions
) {
  const queryClient = useQueryClient();
  const { data: session, status: sessionStatus } = useSession();
  const token = (session as unknown as { accessToken?: string })?.accessToken;

  // Flexible argument handling: streamPayId can be passed or omitted
  const streamPayId =
    typeof streamPayIdOrOptions === "string" ? streamPayIdOrOptions : null;
  const options: VerifyPaymentHookOptions | undefined =
    typeof streamPayIdOrOptions === "object" && streamPayIdOrOptions !== null
      ? (streamPayIdOrOptions as VerifyPaymentHookOptions)
      : maybeOptions;

  const query = useQuery<VerifyPaymentData>({
    queryKey: subscriptionKeys.verify(paymentId || "", streamPayId),
    queryFn: async () => {
      if (!paymentId) throw new Error("Payment ID is required");
      const response = await verifySubscriptionPayment(paymentId, streamPayId, token);
      return response.data;
    },
    enabled: sessionStatus !== "loading" && Boolean(paymentId) && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval,
    retry: 2,
  });

  const isSuccess = getPaymentState(query.data) === "success";
  useEffect(() => {
    if (!isSuccess) return;
    // Do not invalidate the verification query from inside its own queryFn.
    void queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
    void queryClient.invalidateQueries({ queryKey: [...subscriptionKeys.all, "history"] });
    void queryClient.invalidateQueries({ queryKey: ["packages"] });
  }, [isSuccess, queryClient]);

  return { ...query, isAwaitingSession: sessionStatus === "loading" };
}

