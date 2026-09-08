import type { CheckoutPaymentData, VerifyPaymentData } from "./types";

export type PaymentState = "success" | "failed" | "pending";

export function getPaymentState(data?: Partial<VerifyPaymentData> | CheckoutPaymentData): PaymentState {
  const status = data?.status?.toLowerCase();
  if (["failed", "cancelled", "canceled", "expired", "refunded", "voided"].includes(status || "")) {
    return "failed";
  }
  if ((status === "paid" || status === "success") && data?.is_subscribed !== false) {
    return "success";
  }
  if (!status && data?.is_subscribed === true) return "success";
  return "pending";
}

export function getVerificationUrl(paymentId: string, gatewayId?: string | null): string {
  const query = gatewayId ? `?${new URLSearchParams({ id: gatewayId })}` : "";
  return `/subscription/payment/${encodeURIComponent(paymentId)}${query}`;
}

const PENDING_PAYMENT_KEY = "madarik:pending-payment";
const MAX_PAYMENT_AGE = 24 * 60 * 60 * 1000;

export function rememberPayment(paymentId: string): void {
  try {
    sessionStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify({ paymentId, createdAt: Date.now() }));
  } catch {
    // The active checkout still has its ID when storage is unavailable.
  }
}

export function getPendingPaymentId(): string | null {
  try {
    const stored = JSON.parse(sessionStorage.getItem(PENDING_PAYMENT_KEY) || "null");
    return typeof stored?.paymentId === "string" &&
      typeof stored.createdAt === "number" &&
      Date.now() - stored.createdAt < MAX_PAYMENT_AGE
      ? stored.paymentId
      : null;
  } catch {
    return null;
  }
}

// `id` belongs to the gateway; it must never replace our checkout payment ID.
export function resolvePaymentReturn(params: Pick<URLSearchParams, "get">, pendingId: string | null) {
  const isStreamReturn = Boolean(params.get("payment_link_id") || params.get("invoice_id"));
  return {
    paymentId: params.get("paymentId") ||
      (isStreamReturn ? pendingId : params.get("payment_id")) || pendingId,
    gatewayId: params.get("id") || params.get("streampay_id"),
  };
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
