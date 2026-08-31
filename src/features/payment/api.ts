import { API_BASE_URL, handleResponse } from "@/services/api";
import { getStoredAuthToken } from "@/lib/auth";
import {
  CheckoutSubscriptionPayload,
  CheckoutSubscriptionResponse,
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
 * Initiates subscription payment via Moyasar gateway.
 * Endpoint: POST /subscription/checkout
 */
export async function checkoutSubscription(
  payload: CheckoutSubscriptionPayload,
  token?: string | null
): Promise<CheckoutSubscriptionResponse> {
  const response = await fetch(`${API_BASE_URL}/subscription/checkout`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });

  return handleResponse<CheckoutSubscriptionResponse>(response);
}

/**
 * Verifies subscription payment status after 3D Secure redirect or on demand.
 * Endpoint: GET /subscription/payment/{paymentId}
 */
export async function verifySubscriptionPayment(
  paymentId: string,
  token?: string | null
): Promise<VerifyPaymentResponse> {
  const response = await fetch(`${API_BASE_URL}/subscription/payment/${paymentId}`, {
    method: "GET",
    headers: buildHeaders(token),
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
  });

  return handleResponse<SubscriptionResponse>(response);
}
