import { API_BASE_URL, handleResponse } from "@/services/api";
import { getStoredAuthToken } from "@/lib/auth";
import {
  CheckoutSubscriptionPayload,
  CheckoutSubscriptionResponse,
  SubscriptionHistoryResponse,
  SubscriptionResponse,
  VerifyPaymentResponse,
} from "./types";

function buildHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const resolvedToken = token || getStoredAuthToken();
  if (resolvedToken) {
    headers["Authorization"] = `Bearer ${resolvedToken}`;
  }
  return headers;
}

/**
 * Initiates subscription checkout via StreamPay (payment link flow).
 * For free packages (price 0), subscription is activated immediately.
 * For paid packages, returns payment_id and payment_url for customer checkout.
 * Endpoint: POST /subscription/checkout
 */
export async function checkoutSubscription(
  payload: CheckoutSubscriptionPayload,
  token?: string | null
): Promise<CheckoutSubscriptionResponse> {
  console.log("[PaymentDebug] checkoutSubscription called:", { payload, hasToken: Boolean(token) });

  const envRedirectUrl =
    typeof process !== "undefined" ? process.env?.NEXT_PUBLIC_PAYMENT_REDIRECT_URL : undefined;

  const browserOrigin =
    typeof window !== "undefined" && window.location?.origin ? window.location.origin : null;

  const redirectUrl =
    payload.redirect_url ||
    (browserOrigin
      ? `${browserOrigin}/payment/callback`
      : (envRedirectUrl || "http://localhost:3000/payment/callback"));

  const body: Record<string, unknown> = {
    package_id: payload.package_id,
    redirect_url: redirectUrl,
    callback_url: redirectUrl,
    success_redirect_url: redirectUrl,
    failure_redirect_url: redirectUrl,
    return_url: redirectUrl,
  };

  if (payload.source && (!Array.isArray(payload.source) || payload.source.length > 0)) {
    body.source = payload.source;
  }

  const response = await fetch(`${API_BASE_URL}/subscription/checkout`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(body),
  });

  const result = await handleResponse<CheckoutSubscriptionResponse>(response);
  console.log("[PaymentDebug] checkoutSubscription response:", { status: response.status, ok: response.ok, result });

  if (!result?.success || !result.data) {
    throw new Error(result?.message || "تعذر بدء عملية الدفع. يرجى المحاولة لاحقاً.");
  }

  // Normalize payment_url & transaction_url for compatibility
  if (result?.data) {
    const paymentUrl = result.data.payment_url || result.data.transaction_url || null;
    result.data.payment_url = paymentUrl;
    result.data.transaction_url = paymentUrl;
  }

  return result;
}

/**
 * Verifies subscription payment status after customer completes checkout or 3DS return.
 * Endpoint: GET /subscription/payment/{paymentId}?id={streamPayId}
 */
export async function verifySubscriptionPayment(
  paymentId: string,
  streamPayId?: string | null,
  token?: string | null
): Promise<VerifyPaymentResponse> {
  const query = streamPayId ? `?id=${encodeURIComponent(streamPayId)}` : "";
  const requestUrl = `${API_BASE_URL}/subscription/payment/${encodeURIComponent(paymentId)}${query}`;
  console.log("[PaymentDebug] verifySubscriptionPayment requesting:", {
    url: requestUrl,
    paymentId,
    streamPayId,
    hasToken: Boolean(token),
  });

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: buildHeaders(token),
    cache: "no-store",
  });

  const result = await handleResponse<VerifyPaymentResponse>(response);
  console.log("[PaymentDebug] verifySubscriptionPayment received:", {
    status: response.status,
    ok: response.ok,
    result,
  });

  if (!result?.success || !result.data) {
    console.error("[PaymentDebug] verifySubscriptionPayment invalid result:", result);
    throw new Error(result?.message || "تعذر التحقق من حالة الدفع حالياً. أعد فحص العملية دون تكرار الدفع.");
  }

  const rawData = result.data as Record<string, unknown>;
  const hasActiveSub =
    rawData.is_subscribed === true ||
    (Array.isArray(rawData.subscriptions) &&
      rawData.subscriptions.some((s: any) => s?.status === "active")) ||
    (typeof rawData.subscription === "object" &&
      rawData.subscription !== null &&
      (rawData.subscription as any)?.status === "active");

  const normalizedStatus =
    typeof rawData.status === "string"
      ? rawData.status
      : hasActiveSub
      ? "paid"
      : "initiated";

  const normalizedIsSubscribed =
    typeof rawData.is_subscribed === "boolean"
      ? rawData.is_subscribed
      : hasActiveSub;

  result.data = {
    ...rawData,
    status: normalizedStatus,
    is_subscribed: normalizedIsSubscribed,
  } as VerifyPaymentData;

  return result;
}

/**
 * Retrieves current active subscription details and unlocked age categories for the parent.
 * Endpoint: GET /subscription
 */
export async function getSubscription(
  token?: string | null
): Promise<SubscriptionResponse> {
  const response = await fetch(`${API_BASE_URL}/subscription`, {
    method: "GET",
    headers: buildHeaders(token),
    cache: "no-store",
  });

  return handleResponse<SubscriptionResponse>(response);
}

/**
 * Retrieves parent subscription package history and dashboard statistics.
 * Endpoint: GET /subscription/history?status={active|expired|cancelled}
 */
export async function getSubscriptionHistory(
  status?: "active" | "expired" | "cancelled" | string | null,
  token?: string | null
): Promise<SubscriptionHistoryResponse> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const response = await fetch(`${API_BASE_URL}/subscription/history${query}`, {
    method: "GET",
    headers: buildHeaders(token),
    cache: "no-store",
  });

  return handleResponse<SubscriptionHistoryResponse>(response);
}

