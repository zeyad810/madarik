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

export type PaymentSource =
  | MoyasarPaymentSource
  | unknown[]
  | Record<string, unknown>;

export interface CheckoutSubscriptionPayload {
  package_id: string;
  source?: PaymentSource;
}

export type PaymentStatus = "initiated" | "paid" | "success" | "failed" | "refunded" | string;

export interface CheckoutPaymentData {
  payment_id: string;
  payment_url?: string | null;
  transaction_url?: string | null;
  status?: PaymentStatus;
  is_subscribed?: boolean;
}

export interface CheckoutSubscriptionResponse {
  success: boolean;
  message?: string;
  data: CheckoutPaymentData;
}

export interface VerifyPaymentQueryParams {
  paymentId: string;
  id?: string | null; // streampay_id
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
  id?: string;
  subscription_id?: string;
  user_id?: string | number;
  package_id?: string | number;
  name?: string;
  type?: string;
  age_categories?: string[];
  price?: string | number;
  status: "active" | "frozen" | "expired" | "cancelled" | string;
  start_date?: string;
  end_date?: string;
  payment_method?: string;
  transaction_code?: string;
  auto_renew?: boolean;
  package?: BackendPackage | null;
  [key: string]: unknown;
}

export interface SubscriptionData {
  is_subscribed: boolean;
  subscriptions?: BackendSubscription[];
  subscription?: BackendSubscription | null;
  unlocked_age_categories: string[];
}

export interface SubscriptionResponse {
  success: boolean;
  message?: string;
  data: SubscriptionData;
}

export interface SubscriptionHistoryAccount {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  change_by_admin?: boolean;
  type: string;
  status: string;
  phone_verified_at?: string | null;
  otp_attempts?: number;
  otp_locked_until?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionHistoryData {
  account: SubscriptionHistoryAccount;
  children_count: number;
  is_subscribed: boolean;
  unlocked_age_categories: string[];
}

export interface SubscriptionHistoryResponse {
  success: boolean;
  message?: string;
  data: SubscriptionHistoryData;
}

