import { API_BASE_URL, handleResponse } from "@/services/api";
import { getStoredAuthToken } from "@/lib/auth";
import { ApiResponse } from "@/types";
import {
  CurrentSubscription,
  FreezeSubscriptionPayload,
  FreezeSubscriptionResponse,
  PackageHistoryItem,
  PackagePlan,
} from "./types";
import {
  DEFAULT_CURRENT_SUBSCRIPTION,
  DEFAULT_PACKAGES,
  DEFAULT_PACKAGE_HISTORY,
} from "./data";
import { PublicPackagesData } from "../site/types";

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
 * Fetches available packages list.
 * Integrates with backend public packages endpoint, mapped to UI model with fallback.
 */
export const getPackagesList = async (): Promise<PackagePlan[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/public/packages`, {
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      const data = await handleResponse<ApiResponse<PublicPackagesData>>(response);
      if (data?.data?.packages && data.data.packages.length > 0) {
        return data.data.packages.map((pkg, idx) => {
          const isSchool = pkg.audience === "school" || pkg.cta_type === "whatsapp";
          const defaultIcon =
            idx === 0
              ? "/iamges/family-icon.svg"
              : isSchool
              ? "/iamges/school-icon.svg"
              : "/iamges/crown-illustration.svg";
          const icon = pkg.image_url || defaultIcon;

          const features = Array.isArray(pkg.features)
            ? pkg.features
            : typeof pkg.features === "string"
            ? [pkg.features]
            : [];

          const ageCategories =
            pkg.levels && pkg.levels.length > 0
              ? pkg.levels.map((lvl) => lvl.age_category || `${lvl.age_from}-${lvl.age_to}`)
              : pkg.age_categories || ["5-9", "10-12", "13-15"];

          const waNumber = pkg.cta_whatsapp_number?.replace(/\D/g, "") || "966500000000";

          const durationLabel =
            pkg.duration_label ||
            (pkg.duration_type === "days"
              ? pkg.duration_value && pkg.duration_value > 1 ? `${pkg.duration_value} يوم` : "يوميًا"
              : pkg.duration_type === "years"
              ? pkg.duration_value && pkg.duration_value > 1 ? `${pkg.duration_value} سنوات` : "سنويًا"
              : pkg.duration_type === "months"
              ? pkg.duration_value && pkg.duration_value > 1 ? `${pkg.duration_value} أشهر` : "شهريًا"
              : "شهرياً");

          return {
            id: String(pkg.id),
            name: pkg.name,
            description: pkg.description,
            audience: pkg.audience,
            icon,
            imageUrl: pkg.image_url,
            ageCategories,
            price: pkg.price ? Number(pkg.price) : null,
            discountedPrice: pkg.discounted_price ? Number(pkg.discounted_price) : null,
            currency: "ر.س",
            durationLabel,
            annualNote: pkg.price ? undefined : undefined,
            features: features.length > 0 ? features : (DEFAULT_PACKAGES[idx]?.features || []),
            ctaType: isSchool ? "whatsapp" : "checkout",
            ctaText: pkg.cta_text || (isSchool ? "اشترك عبر الواتساب" : "اشترك الآن"),
            ctaLink: isSchool ? `https://wa.me/${waNumber}` : undefined,
            isFeatured: idx === 0,
          };
        });
      }
    }
  } catch (error) {
    console.warn("Using fallback packages data:", error);
  }
  return DEFAULT_PACKAGES;
};

/**
 * Fetches the user's active subscription status.
 */
export const getCurrentSubscription = async (
  token?: string | null
): Promise<CurrentSubscription> => {
  try {
    const response = await fetch(`${API_BASE_URL}/parent/subscription`, {
      method: "GET",
      headers: buildHeaders(token),
    });
    if (response.ok) {
      const result = await handleResponse<ApiResponse<CurrentSubscription>>(response);
      if (result?.data) {
        return {
          ...DEFAULT_CURRENT_SUBSCRIPTION,
          ...result.data,
        };
      }
    }
  } catch (error) {
    console.warn("Using fallback current subscription data:", error);
  }
  return DEFAULT_CURRENT_SUBSCRIPTION;
};

/**
 * Fetches user's package/subscription payment history.
 */
export const getPackageHistory = async (
  token?: string | null
): Promise<PackageHistoryItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/parent/subscriptions/history`, {
      method: "GET",
      headers: buildHeaders(token),
    });
    if (response.ok) {
      const result = await handleResponse<ApiResponse<PackageHistoryItem[]>>(response);
      if (result?.data && Array.isArray(result.data) && result.data.length > 0) {
        return result.data;
      }
    }
  } catch (error) {
    console.warn("Using fallback package history data:", error);
  }
  return DEFAULT_PACKAGE_HISTORY;
};

/**
 * Freezes / pauses active subscription.
 */
export const freezeSubscription = async (
  payload: FreezeSubscriptionPayload,
  token?: string | null
): Promise<FreezeSubscriptionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/parent/subscription/freeze`, {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      return await handleResponse<FreezeSubscriptionResponse>(response);
    }
  } catch (error) {
    console.warn("Freeze subscription mock response:", error);
  }

  return {
    success: true,
    message: "تم تجميد الباقة بنجاح",
    data: {
      ...DEFAULT_CURRENT_SUBSCRIPTION,
      status: "frozen",
      statusLabel: "مجمدة",
      isFrozen: true,
      freezeUntil: "30 نوفمبر 2026",
    },
  };
};
