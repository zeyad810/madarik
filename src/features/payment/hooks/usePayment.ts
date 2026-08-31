import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  checkoutSubscription,
  getSubscription,
  verifySubscriptionPayment,
} from "../api";
import {
  CheckoutSubscriptionPayload,
  CheckoutSubscriptionResponse,
  SubscriptionData,
  VerifyPaymentData,
} from "../types";

export const subscriptionKeys = {
  all: ["subscription"] as const,
  current: () => [...subscriptionKeys.all, "current"] as const,
  verify: (id: string) => [...subscriptionKeys.all, "verify", id] as const,
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
 * Hook to initiate subscription checkout with Moyasar.
 * Calls POST /subscription/checkout
 */
export function useCheckoutSubscription() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = (session as unknown as { accessToken?: string })?.accessToken;

  return useMutation<CheckoutSubscriptionResponse, Error, CheckoutSubscriptionPayload>({
    mutationFn: (payload: CheckoutSubscriptionPayload) => checkoutSubscription(payload, token),
    onSuccess: (data) => {
      // If paid immediately, invalidate subscription queries and packages queries
      if (data.data.status === "paid" || data.data.status === "success") {
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
        queryClient.invalidateQueries({ queryKey: ["packages"] });
      }
    },
  });
}

/**
 * Hook to verify subscription payment status (e.g., after 3D Secure return).
 * Calls GET /subscription/payment/{paymentId}
 */
export function useVerifySubscriptionPayment(
  paymentId: string | null | undefined,
  options?: {
    enabled?: boolean;
    refetchInterval?: number | false | ((query: unknown) => number | false);
  }
) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = (session as unknown as { accessToken?: string })?.accessToken;

  return useQuery<VerifyPaymentData>({
    queryKey: subscriptionKeys.verify(paymentId || ""),
    queryFn: async () => {
      if (!paymentId) throw new Error("Payment ID is required");
      const response = await verifySubscriptionPayment(paymentId, token);
      if (response.data.is_subscribed || response.data.status === "paid" || response.data.status === "success") {
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
        queryClient.invalidateQueries({ queryKey: ["packages"] });
      }
      return response.data;
    },
    enabled: Boolean(paymentId) && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval,
  });
}
