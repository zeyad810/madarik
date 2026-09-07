import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    onSuccess: (data) => {
      // Invalidate subscription and packages queries
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["packageHistory"] });
    },
  });
}

export interface VerifyPaymentHookOptions {
  enabled?: boolean;
  refetchInterval?: number | false | ((query: unknown) => number | false);
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
  const { data: session } = useSession();
  const token = (session as unknown as { accessToken?: string })?.accessToken;

  // Flexible argument handling: streamPayId can be passed or omitted
  const streamPayId =
    typeof streamPayIdOrOptions === "string" ? streamPayIdOrOptions : null;
  const options: VerifyPaymentHookOptions | undefined =
    typeof streamPayIdOrOptions === "object" && streamPayIdOrOptions !== null
      ? (streamPayIdOrOptions as VerifyPaymentHookOptions)
      : maybeOptions;

  return useQuery<VerifyPaymentData>({
    queryKey: subscriptionKeys.verify(paymentId || "", streamPayId),
    queryFn: async () => {
      if (!paymentId) throw new Error("Payment ID is required");
      const response = await verifySubscriptionPayment(paymentId, streamPayId, token);
      if (
        response.data.is_subscribed ||
        response.data.status === "paid" ||
        response.data.status === "success"
      ) {
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
        queryClient.invalidateQueries({ queryKey: ["packages"] });
        queryClient.invalidateQueries({ queryKey: ["packageHistory"] });
      }
      return response.data;
    },
    enabled: Boolean(paymentId) && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval,
  });
}

