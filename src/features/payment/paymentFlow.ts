import type { CheckoutPaymentData, VerifyPaymentData } from "./types";

export type PaymentState = "success" | "failed" | "pending";

export function getPaymentState(data?: Partial<VerifyPaymentData> | CheckoutPaymentData): PaymentState {
  const status = data?.status?.toLowerCase();
  let state: PaymentState = "pending";
  if (["failed", "cancelled", "canceled", "expired", "refunded", "voided"].includes(status || "")) {
    state = "failed";
  } else if ((status === "paid" || status === "success" || status === "active") && data?.is_subscribed !== false) {
    state = "success";
  } else if (!status && data?.is_subscribed === true) {
    state = "success";
  }
  console.log("[PaymentDebug] getPaymentState:", { data, status, calculatedState: state });
  return state;
}

export function getVerificationUrl(
  paymentId: string,
  gatewayId?: string | null,
  additionalParams?: Record<string, string | null | undefined>
): string {
  const searchParams = new URLSearchParams();
  if (gatewayId) searchParams.set("id", gatewayId);
  if (additionalParams) {
    for (const [key, val] of Object.entries(additionalParams)) {
      if (val && key !== "id") {
        searchParams.set(key, val);
      }
    }
  }
  const queryString = searchParams.toString();
  const query = queryString ? `?${queryString}` : "";
  const url = `/subscription/payment/${encodeURIComponent(paymentId)}${query}`;
  console.log("[PaymentDebug] getVerificationUrl generated:", { paymentId, gatewayId, additionalParams, url });
  return url;
}

const PENDING_PAYMENT_KEY = "madarik:pending-payment";
const MAX_PAYMENT_AGE = 24 * 60 * 60 * 1000;

export function rememberPayment(paymentId: string): void {
  try {
    console.log("[PaymentDebug] rememberPayment saving to sessionStorage:", paymentId);
    sessionStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify({ paymentId, createdAt: Date.now() }));
  } catch {
    // The active checkout still has its ID when storage is unavailable.
  }
}

export function getPendingPaymentId(): string | null {
  try {
    const stored = JSON.parse(sessionStorage.getItem(PENDING_PAYMENT_KEY) || "null");
    const validId = typeof stored?.paymentId === "string" &&
      typeof stored.createdAt === "number" &&
      Date.now() - stored.createdAt < MAX_PAYMENT_AGE
      ? stored.paymentId
      : null;
    console.log("[PaymentDebug] getPendingPaymentId retrieved:", { stored, validId });
    return validId;
  } catch {
    return null;
  }
}

// `id` belongs to the gateway; it must never replace our checkout payment ID.
export function resolvePaymentReturn(params: Pick<URLSearchParams, "get">, pendingId: string | null) {
  const resolved = {
    paymentId: params.get("paymentId") ||
      params.get("payment_id") || pendingId,
    gatewayId: params.get("id") || params.get("streampay_id"),
    status: params.get("status") || undefined,
    result: params.get("result") || undefined,
    message: params.get("message") || undefined,
  };
  console.log("[PaymentDebug] resolvePaymentReturn:", {
    resolved,
    pendingId,
    raw_payment_id: params.get("payment_id"),
    raw_paymentId: params.get("paymentId"),
    raw_id: params.get("id"),
    raw_streampay_id: params.get("streampay_id"),
    raw_status: params.get("status"),
    raw_result: params.get("result"),
    raw_message: params.get("message"),
  });
  return resolved;
}

export function getCheckoutUrl(value: string): URL {
  const url = /^[a-zA-Z0-9_-]+$/.test(value)
    ? new URL(`https://streampay.sa/ds/${value}`)
    : new URL(value);
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("رابط الدفع غير صالح. يرجى المحاولة لاحقاً.");
  }
  return url;
}
