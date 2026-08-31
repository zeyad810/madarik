export type MoyasarSourceType = "creditcard" | "token" | "applepay" | "stcpay" | string;

export interface MoyasarCreditCardSource {
  type: "creditcard";
  name: string;
  number: string;
  month: string;
  year: string;
  cvc: string;
}

export interface MoyasarTokenSource {
  type: "token";
  token: string;
  [key: string]: unknown;
}

export type MoyasarPaymentSource =
  | MoyasarCreditCardSource
  | MoyasarTokenSource
  | ({ type: string } & Record<string, unknown>);

export interface CheckoutSubscriptionPayload {
  package_id: string;
  source: MoyasarPaymentSource;
}

export type PaymentStatus = "initiated" | "paid" | "success" | "failed" | "refunded" | string;

export interface CheckoutPaymentData {
  payment_id: string;
  status: PaymentStatus;
  transaction_url?: string | null;
}

export interface CheckoutSubscriptionResponse {
  success: boolean;
  message?: string;
  data: CheckoutPaymentData;
}

export interface VerifyPaymentData {
  status: PaymentStatus;
  is_subscribed: boolean;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  data: VerifyPaymentData;
}

export interface BackendPackage {
  id: string | number;
  name: string;
  description?: string | null;
  audience?: string;
  price?: number | string | null;
  discounted_price?: number | string | null;
  currency?: string;
  duration_type?: "days" | "months" | "years" | string;
  duration_value?: number;
  duration_label?: string;
  features?: string[] | string;
  image_url?: string | null;
  cta_type?: string;
  cta_text?: string;
  cta_whatsapp_number?: string;
  is_active?: boolean | number;
  [key: string]: unknown;
}

export interface BackendSubscription {
  id: string;
  user_id?: string | number;
  package_id: string | number;
  status: "active" | "frozen" | "expired" | "cancelled" | string;
  start_date?: string;
  end_date?: string;
  auto_renew?: boolean;
  package?: BackendPackage | null;
  [key: string]: unknown;
}

export interface SubscriptionData {
  is_subscribed: boolean;
  subscription: BackendSubscription | null;
  unlocked_age_categories: string[];
}

export interface SubscriptionResponse {
  success: boolean;
  message?: string;
  data: SubscriptionData;
}
