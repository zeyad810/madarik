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
    mutationFn: (payload: CheckoutSubscriptionPayload) => {
      console.log("[PaymentDebug] useCheckoutSubscription mutation started:", { payload, tokenPresent: Boolean(token) });
      return checkoutSubscription(payload, token);
    },
    onSuccess: (data) => {
      console.log("[PaymentDebug] useCheckoutSubscription mutation success:", data);
      // Invalidate subscription and packages queries
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["packageHistory"] });
    },
    onError: (err) => {
      console.error("[PaymentDebug] useCheckoutSubscription mutation failed:", err);
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

  console.log("[PaymentDebug] useVerifySubscriptionPayment hook state:", {
    paymentId,
    streamPayId,
    sessionStatus,
    hasToken: Boolean(token),
    enabled: sessionStatus !== "loading" && Boolean(paymentId) && (options?.enabled ?? true),
  });

  const query = useQuery<VerifyPaymentData>({
    queryKey: subscriptionKeys.verify(paymentId || "", streamPayId),
    queryFn: async () => {
      if (!paymentId) throw new Error("Payment ID is required");
      console.log("[PaymentDebug] queryFn verifying payment:", { paymentId, streamPayId });
      try {
        const response = await verifySubscriptionPayment(paymentId, streamPayId, token);
        console.log("[PaymentDebug] queryFn verification result:", response);
        return response.data;
      } catch (err) {
        console.warn("[PaymentDebug] verifySubscriptionPayment failed, trying fallback:", err);
        if (typeof getSubscription === "function") {
          try {
            const subRes = await getSubscription(token);
            console.log("[PaymentDebug] getSubscription fallback result:", subRes);
            const subData = subRes?.data;
            const hasActive =
              subData?.is_subscribed === true ||
              (Array.isArray(subData?.subscriptions) &&
                subData.subscriptions.some((s) => s?.status === "active")) ||
              Boolean(
                subData?.subscription &&
                  (subData.subscription as { status?: string }).status === "active"
              );

            if (subRes?.success && hasActive) {
              return {
                ...subData,
                status: "paid",
                is_subscribed: true,
              } as VerifyPaymentData;
            }
          } catch (subErr) {
            console.warn("[PaymentDebug] fallback getSubscription failed:", subErr);
          }
        }
        throw err;
      }
    },
    enabled: sessionStatus !== "loading" && Boolean(paymentId) && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval,
    retry: 2,
  });

  const isSuccess = getPaymentState(query.data) === "success";
  useEffect(() => {
    if (!isSuccess) return;
    console.log("[PaymentDebug] Payment verified successfully, invalidating caches");
    // Do not invalidate the verification query from inside its own queryFn.
    void queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
    void queryClient.invalidateQueries({ queryKey: [...subscriptionKeys.all, "history"] });
    void queryClient.invalidateQueries({ queryKey: ["packages"] });
  }, [isSuccess, queryClient]);

  return { ...query, isAwaitingSession: sessionStatus === "loading" };
}

