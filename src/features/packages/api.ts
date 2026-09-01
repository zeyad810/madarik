import { API_BASE_URL, handleResponse } from "@/services/api";
import { getStoredAuthToken } from "@/lib/auth";
import { ApiResponse } from "@/types";
import { formatArabicDate } from "@/lib/utils";
import {
  AccountSubscriptionHistoryApiResponse,
  AccountSubscriptionHistoryResponse,
  CurrentSubscription,
  PackageHistoryItem,
  PackagePlan,
  RawAccountSubscriptionHistoryItem,
  SubscriptionApiResponse,
  SubscriptionItemData,
} from "./types";
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
 * Fetches available packages list from backend /public/packages.
 * Maps real server data to UI model without hardcoded mock items.
 */
export const getPackagesList = async (): Promise<PackagePlan[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/public/packages`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (response.ok) {
      const result = await handleResponse<ApiResponse<PublicPackagesData>>(response);
      const packages = result?.data?.packages;
      if (Array.isArray(packages) && packages.length > 0) {
        return packages.map((pkg, idx) => {
          const isSchool = pkg.audience === "school" || pkg.cta_type === "whatsapp";
          const defaultIcon = isSchool
            ? "/iamges/school-icon.svg"
            : idx === 0
            ? "/iamges/family-icon.svg"
            : "/iamges/crown-illustration.svg";
          const icon = pkg.image_url || defaultIcon;

          const features = Array.isArray(pkg.features)
            ? pkg.features.filter(Boolean)
            : typeof pkg.features === "string" && pkg.features.trim()
            ? [pkg.features.trim()]
            : [];

          const ageCategories =
            pkg.levels && pkg.levels.length > 0
              ? pkg.levels
                  .map((lvl) => lvl.age_category || (lvl.age_from && lvl.age_to ? `${lvl.age_from}-${lvl.age_to}` : lvl.name))
                  .filter(Boolean)
              : Array.isArray(pkg.age_categories)
              ? pkg.age_categories
              : [];

          const waNumber = pkg.cta_whatsapp_number?.replace(/\D/g, "") || "966500000000";

          const durationLabel =
            pkg.duration_label ||
            (pkg.duration_type === "days"
              ? pkg.duration_value && pkg.duration_value > 1
                ? `${pkg.duration_value} يوم`
                : "يوميًا"
              : pkg.duration_type === "years"
              ? pkg.duration_value && pkg.duration_value > 1
                ? `${pkg.duration_value} سنوات`
                : "سنويًا"
              : pkg.duration_type === "months"
              ? pkg.duration_value && pkg.duration_value > 1
                ? `${pkg.duration_value} أشهر`
                : "شهريًا"
              : "سنويًا");

          return {
            id: String(pkg.id),
            name: pkg.name,
            description: pkg.description || "",
            audience: pkg.audience || "individual",
            icon,
            imageUrl: pkg.image_url || null,
            ageCategories,
            price: pkg.price !== null && pkg.price !== undefined ? Number(pkg.price) : null,
            discountedPrice:
              pkg.discounted_price !== null && pkg.discounted_price !== undefined
                ? Number(pkg.discounted_price)
                : null,
            currency: "ر.س",
            durationLabel,
            annualNote: undefined,
            features,
            ctaType: pkg.cta_type || (isSchool ? "whatsapp" : "checkout"),
            ctaText: pkg.cta_text || (isSchool ? "اشترك عبر الواتساب" : "اشترك الآن"),
            ctaLink: isSchool || pkg.cta_type === "whatsapp" ? `https://wa.me/${waNumber}` : undefined,
            isFeatured: pkg.display_order === 1 || idx === 0,
          };
        });
      }
    }
  } catch (error) {
    console.error("Error fetching packages list:", error);
  }
  return [];
};

/**
 * Fetches the user's active subscriptions list from GET /subscription.
 * Returns an array of real subscription objects (or empty array if not subscribed).
 */
export const getCurrentSubscriptions = async (
  token?: string | null
): Promise<CurrentSubscription[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscription`, {
      method: "GET",
      headers: buildHeaders(token),
      cache: "no-store",
    });

    if (response.ok) {
      const result = await handleResponse<SubscriptionApiResponse>(response);

      if (result?.data && result.data.is_subscribed) {
        const unlockedAges = result.data.unlocked_age_categories || [];

        const rawList: SubscriptionItemData[] = Array.isArray(result.data.subscriptions)
          ? result.data.subscriptions
          : result.data.subscription
          ? [result.data.subscription]
          : [];

        if (rawList.length === 0) {
          return [];
        }

        return rawList.map((subData) => {
          const pkg = subData.package;

          // Use the price paid during subscription (package_price), fallback to package discounted/regular price
          const rawPaidPrice =
            subData.package_price !== undefined && subData.package_price !== null && subData.package_price !== ""
              ? subData.package_price
              : pkg?.discounted_price ?? pkg?.price;

          const currency = "ر.س";
          const paidPriceText =
            rawPaidPrice !== undefined && rawPaidPrice !== null && rawPaidPrice !== ""
              ? `${rawPaidPrice} ${currency}`
              : "";

          const planName = subData.package_name || pkg?.name || "الباقة المشترك بها";
          const description = subData.package_description || pkg?.description || "اشتراك طفلك الحالي النشط";
          const packageType =
            subData.package_duration_label ||
            pkg?.duration_label ||
            (subData.package_duration_type === "years" || pkg?.duration_type === "years"
              ? "سنوي"
              : subData.package_duration_type === "months" || pkg?.duration_type === "months"
              ? "شهري"
              : "مخصص");

          const features =
            subData.package_features && subData.package_features.length > 0
              ? subData.package_features
              : pkg?.features || [];

          return {
            id: String(subData.id || "sub_live"),
            accountId: subData.account_id,
            packageId: subData.package_id,
            planName,
            subtitle: description,
            packageType,
            durationLabel: subData.package_duration_label || pkg?.duration_label || undefined,
            durationType: subData.package_duration_type || pkg?.duration_type,
            durationValue: subData.package_duration_value || pkg?.duration_value,
            ageCategory:
              unlockedAges.length > 0
                ? unlockedAges.join("، ")
                : subData.package_duration_label || pkg?.duration_label || "",
            unlockedAgeCategories: unlockedAges,
            isSubscribed: true,
            startDate: formatArabicDate(subData.start_date),
            endDate: formatArabicDate(subData.end_date),
            autoRenewDate: formatArabicDate(subData.end_date),
            paymentMethod: subData.payment_method || "بطاقة دفع إلكتروني (Moyasar)",
            paidPrice: rawPaidPrice !== undefined && rawPaidPrice !== null ? String(rawPaidPrice) : undefined,
            paidPriceText,
            monthlyPriceText: paidPriceText,
            status: (subData.status as "active" | "expired" | "cancelled") || "active",
            statusLabel:
              subData.status === "active"
                ? "نشط"
                : subData.status === "expired"
                ? "منتهية"
                : subData.status === "cancelled"
                ? "ملغاة"
                : "نشط",
            features,
            rawSubscription: subData,
          };
        });
      }
    }
  } catch (error) {
    console.error("Error fetching current subscriptions:", error);
  }
  return [];
};

/**
 * Fetches the user's primary active subscription status from GET /subscription.
 * Returns the primary subscription data or null if not subscribed.
 */
export const getCurrentSubscription = async (
  token?: string | null
): Promise<CurrentSubscription | null> => {
  const list = await getCurrentSubscriptions(token);
  return list[0] || null;
};

/**
 * Fetches the parent account subscription history from GET /account/subscription/history.
 * Returns raw response from the backend.
 */
export const getAccountSubscriptionHistory = async (
  token?: string | null
): Promise<AccountSubscriptionHistoryApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/account/subscription/history`, {
    method: "GET",
    headers: buildHeaders(token),
    cache: "no-store",
  });

  return await handleResponse<AccountSubscriptionHistoryApiResponse>(response);
};

/**
 * Fetches and transforms package history data directly from GET /account/subscription/history.
 * Maps real server history data (with transaction_code, age_categories, status, price, etc.)
 * to UI models for the history table and invoice modal.
 */
export const getPackageHistory = async (
  token?: string | null
): Promise<PackageHistoryItem[]> => {
  try {
    const result = await getAccountSubscriptionHistory(token);
    const rawList: RawAccountSubscriptionHistoryItem[] = Array.isArray(result?.data)
      ? result.data
      : Array.isArray((result as any)?.data?.subscriptions)
      ? (result as any).data.subscriptions
      : [];

    if (rawList.length === 0) {
      return [];
    }

    const formatAge = (cat: string) => {
      const trimmed = String(cat).trim();
      if (trimmed.includes("سنوات") || trimmed.includes("سنة")) return trimmed;
      if (trimmed === "5-9") return "5-9 سنوات";
      if (trimmed === "10-12") return "10-12 سنة";
      if (trimmed === "13-15") return "13-15 سنة";
      return `${trimmed} سنة`;
    };

    return rawList.map((item, idx) => {
      const ageCategories = Array.isArray(item.age_categories)
        ? item.age_categories
        : typeof (item as any).age_category === "string"
        ? [(item as any).age_category]
        : [];

      const ageText =
        ageCategories.length > 0
          ? ageCategories.map(formatAge).join("، ")
          : "-";

      const rawStatus = (item.status || "active").toLowerCase().trim();
      const status: "active" | "expired" | "free" | "cancelled" =
        rawStatus === "expired"
          ? "expired"
          : rawStatus === "cancelled" || rawStatus === "canceled"
          ? "cancelled"
          : rawStatus === "free"
          ? "free"
          : "active";

      const statusLabel =
        status === "active"
          ? "نشط"
          : status === "expired"
          ? "منتهية"
          : status === "cancelled"
          ? "ملغاة"
          : "مجانية";

      const priceNum = Number(item.price);
      const formattedPrice =
        !isNaN(priceNum) && item.price !== null && item.price !== undefined && item.price !== ""
          ? `${item.price}`
          : item.price
          ? String(item.price)
          : "-";

      const subId = item.subscription_id || `hist_${idx}_${Date.now()}`;
      const transactionCode =
        item.transaction_code ||
        `PAY-${subId.replace(/^01[a-z0-9]{2}/i, "").slice(0, 4).toUpperCase() || "0001"}`;

      return {
        id: subId,
        packageId: item.package_id,
        invoiceNumber: transactionCode,
        packageName: item.name || "الباقة",
        packageType: item.type || "مدفوع",
        ageCategory: ageText,
        ageCategories,
        price: formattedPrice,
        currency: "ر.س",
        startDate: formatArabicDate(item.start_date),
        endDate: formatArabicDate(item.end_date),
        status,
        statusLabel,
        paymentMethod: item.payment_method || "بطاقة ائتمان",
        raw: item,
      };
    });
  } catch (error) {
    console.error("Error fetching package history from /account/subscription/history:", error);
    return [];
  }
};



