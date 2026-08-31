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

export interface CurrentSubscription {
  id: string;
  planName: string;
  subtitle?: string;
  ageCategory: string;
  startDate: string;
  endDate: string;
  autoRenewDate?: string;
  paymentMethod: string;
  monthlyPriceText?: string;
  annualPriceText?: string;
  status: "active" | "frozen" | "expired" | "cancelled";
  statusLabel?: string;
  isFrozen?: boolean;
  freezeUntil?: string;
  description?: string;
}

export type HistoryFilterType = "all" | "active" | "expired" | "cancelled";

export interface PackageHistoryItem {
  id: string;
  invoiceNumber: string;
  packageName: string;
  packageType: string; // "سنوي" | "شهري" | "مجاني"
  ageCategory: string;
  price: number | string;
  currency?: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "free" | "cancelled";
  statusLabel: string;
  paymentMethod: string;
  invoiceUrl?: string;
}

export interface FreezeSubscriptionPayload {
  subscriptionId?: string;
  durationMonths: number;
  reason?: string;
}

export interface FreezeSubscriptionResponse {
  success: boolean;
  message?: string;
  data?: CurrentSubscription;
}
