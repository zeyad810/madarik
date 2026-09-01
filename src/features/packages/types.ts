export type PackageAudience = "individual" | "school" | "family" | string;

export interface PackagePlan {
  id: string;
  name: string;
  description?: string | null;
  audience?: PackageAudience;
  icon: string;
  imageUrl?: string | null;
  ageCategories: string[];
  price: number | string | null;
  discountedPrice?: number | string | null;
  currency?: string;
  durationLabel?: string;
  annualNote?: string;
  features: string[];
  ctaType: "checkout" | "whatsapp" | "renew" | string;
  ctaText?: string;
  ctaLink?: string;
  isFeatured?: boolean;
}

export interface SubscriptionPackageDetails {
  id: string | number;
  name: string;
  image_url?: string | null;
  audience?: string;
  description?: string | null;
  features?: string[];
  price?: string | number | null;
  discounted_price?: string | number | null;
  duration_type?: string;
  duration_value?: number;
  duration_label?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: string;
  cta_type?: string;
  cta_text?: string;
  cta_whatsapp_number?: string | null;
  display_order?: number;
  is_system?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionItemData {
  id?: string | number;
  subscription_id?: string;
  account_id?: string;
  package_id?: string;
  name?: string;
  package_name?: string;
  type?: string;
  package_description?: string;
  price?: string | number;
  package_price?: string | number;
  age_categories?: string[];
  package_features?: string[];
  package_duration_type?: string;
  package_duration_value?: number;
  package_duration_label?: string | null;
  start_date?: string;
  end_date?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  payment_method?: string;
  transaction_code?: string;
  package?: SubscriptionPackageDetails;
}

export interface SubscriptionApiResponse {
  success: boolean;
  data: {
    is_subscribed: boolean;
    subscription?: SubscriptionItemData | null;
    subscriptions?: SubscriptionItemData[];
    unlocked_age_categories: string[];
  };
}

export interface CurrentSubscription {
  id: string;
  subscriptionId?: string;
  accountId?: string;
  packageId?: string;
  planName: string;
  subtitle?: string;
  packageType?: string;
  durationLabel?: string;
  durationType?: string;
  durationValue?: number;
  ageCategory: string;
  ageCategories?: string[];
  unlockedAgeCategories?: string[];
  isSubscribed?: boolean;
  startDate: string;
  endDate: string;
  autoRenewDate?: string;
  paymentMethod: string;
  paidPrice?: string | number;
  paidPriceText?: string;
  monthlyPriceText?: string;
  annualPriceText?: string;
  status: "active" | "frozen" | "expired" | "cancelled" | string;
  statusLabel?: string;
  features?: string[];
  isFrozen?: boolean;
  freezeUntil?: string;
  description?: string;
  transactionCode?: string;
  rawSubscription?: SubscriptionItemData;
}


export type HistoryFilterType = "all" | "active" | "expired" | "cancelled";

export interface RawAccountSubscriptionHistoryItem {
  subscription_id: string;
  package_id: string;
  name: string;
  type: string;
  age_categories: string[];
  price: string | number;
  start_date: string;
  end_date: string;
  status: "active" | "expired" | "cancelled" | string;
  payment_method: string;
  transaction_code: string;
}

export interface AccountSubscriptionHistoryFilters {
  status?: string[];
}

export interface AccountSubscriptionHistoryApiResponse {
  success: boolean;
  data: RawAccountSubscriptionHistoryItem[];
  filters?: AccountSubscriptionHistoryFilters;
  message?: string;
}

export interface PackageHistoryItem {
  id: string;
  packageId?: string;
  invoiceNumber: string;
  packageName: string;
  packageType: string; // "مدفوع" | "مجاني" | string
  ageCategory: string;
  ageCategories?: string[];
  price: number | string;
  currency?: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "free" | "cancelled";
  statusLabel: string;
  paymentMethod: string;
  invoiceUrl?: string;
  raw?: RawAccountSubscriptionHistoryItem;
}

// Backward compatibility alias if needed
export type AccountSubscriptionHistoryResponse = AccountSubscriptionHistoryApiResponse;



