import { API_BASE_URL, handleResponse } from "@/services/api";
import { getStoredAuthToken } from "@/lib/auth";
import { ApiResponse } from "@/types";
import { formatArabicDate } from "@/lib/utils";
import {
  CurrentSubscription,
  PackageHistoryItem,
  PackagePlan,
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
 * Fetches the user's active subscription status from GET /subscription.
 * Returns real subscription data or null if not subscribed.
 */
export const getCurrentSubscription = async (
  token?: string | null
): Promise<CurrentSubscription | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscription`, {
      method: "GET",
      headers: buildHeaders(token),
      cache: "no-store",
    });

    if (response.ok) {
      const result = await handleResponse<{
        success?: boolean;
        data?: {
          is_subscribed?: boolean;
          subscription?: {
            id?: string | number;
            account_id?: string;
            package_id?: string;
            package_name?: string;
            package_description?: string;
            package_price?: string | number;
            package_features?: string[];
            package_duration_type?: string;
            package_duration_value?: number;
            package_duration_label?: string | null;
            status?: string;
            start_date?: string;
            end_date?: string;
            payment_method?: string;
            package?: {
              id?: string | number;
              name?: string;
              price?: number | string;
              discounted_price?: number | string;
              currency?: string;
              duration_label?: string;
              duration_type?: string;
              duration_value?: number;
            };
          } | null;
          unlocked_age_categories?: string[];
        };
      }>(response);

      if (result?.data && result.data.is_subscribed && result.data.subscription) {
        const subData = result.data.subscription;
        const unlockedAges = result.data.unlocked_age_categories || [];
        const pkg = subData.package;

        // Use the price paid during subscription (package_price), fallback to package discounted/regular price
        const rawPaidPrice =
          subData.package_price !== undefined && subData.package_price !== null && subData.package_price !== ""
            ? subData.package_price
            : pkg?.discounted_price ?? pkg?.price;

        const currency = pkg?.currency || "ر.س";
        const paidPriceText =
          rawPaidPrice !== undefined && rawPaidPrice !== null && rawPaidPrice !== ""
            ? `${rawPaidPrice} ${currency}`
            : "";

        const planName = subData.package_name || pkg?.name || "الباقة المشترك بها";
        const description = subData.package_description || "اشتراك طفلك الحالي النشط";
        const packageType =
          subData.package_duration_label ||
          pkg?.duration_label ||
          (subData.package_duration_type === "years" || pkg?.duration_type === "years"
            ? "سنوي"
            : subData.package_duration_type === "months" || pkg?.duration_type === "months"
            ? "شهري"
            : "مخصص");

        return {
          id: String(subData.id || "sub_live"),
          planName,
          subtitle: description,
          packageType,
          durationLabel: subData.package_duration_label || pkg?.duration_label || undefined,
          ageCategory:
            unlockedAges.length > 0
              ? unlockedAges.join("، ")
              : subData.package_duration_label || pkg?.duration_label || "",
          unlockedAgeCategories: unlockedAges,
          isSubscribed: true,
          startDate: formatArabicDate(subData.start_date),
          endDate: formatArabicDate(subData.end_date),
          autoRenewDate: formatArabicDate(subData.end_date),
          paymentMethod: subData.payment_method || "بطاقة ائتمانية (Moyasar)",
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
        };
      }

    }
  } catch (error) {
    console.error("Error fetching current subscription:", error);
  }
  return null;
};

/**
 * Fills package history data directly from the user's current subscription (/subscription).
 * Returns array with the active subscription details or empty array if no active subscription.
 */
export const getPackageHistory = async (
  token?: string | null
): Promise<PackageHistoryItem[]> => {
  try {
    const currentSub = await getCurrentSubscription(token);
    if (!currentSub || !currentSub.isSubscribed) {
      return [];
    }

    return [
      {
        id: currentSub.id,
        invoiceNumber: `INV-${currentSub.id}`,
        packageName: currentSub.planName,
        packageType: currentSub.packageType || currentSub.durationLabel || "سنوي",
        ageCategory:
          currentSub.ageCategory ||
          (currentSub.unlockedAgeCategories && currentSub.unlockedAgeCategories.length > 0
            ? currentSub.unlockedAgeCategories.join("، ")
            : "-"),
        price: currentSub.paidPrice || currentSub.paidPriceText || "-",
        currency: "ر.س",
        startDate: currentSub.startDate,
        endDate: currentSub.endDate,
        status: (currentSub.status as "active" | "expired" | "free" | "cancelled") || "active",
        statusLabel: currentSub.statusLabel || "نشط",
        paymentMethod: currentSub.paymentMethod || "بطاقة ائتمانية (Moyasar)",
      },
    ];
  } catch (error) {
    console.error("Error generating package history from current subscription:", error);
    return [];
  }
};

