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
  const body = {
    package_id: payload.package_id,
    source: payload.source !== undefined ? payload.source : [],
  };

  const response = await fetch(`${API_BASE_URL}/subscription/checkout`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(body),
  });

  const result = await handleResponse<CheckoutSubscriptionResponse>(response);

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
  const response = await fetch(`${API_BASE_URL}/subscription/payment/${paymentId}${query}`, {
    method: "GET",
    headers: buildHeaders(token),
    cache: "no-store",
  });

  return handleResponse<VerifyPaymentResponse>(response);
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

