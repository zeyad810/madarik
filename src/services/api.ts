export const API_BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://madarik.themiify.com/api/v1";

/**
 * Simple helper to parse response and handle API errors cleanly.
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    let message = data?.message || data?.error;

    // Handle nested validation errors (e.g., { errors: { phone: ["..."] } })
    if (!message && data?.errors) {
      if (Array.isArray(data.errors)) {
        message = data.errors.join(" - ");
      } else if (typeof data.errors === "object") {
        message = Object.values(data.errors).flat().join(" - ");
      }
    }

    // Fallbacks based on HTTP status code
    if (!message) {
      if (response.status === 401) message = "انتهت الجلسة أو غير مصرح لك بالدخول";
      else if (response.status === 403) message = "ليس لديك الصلاحية للوصول";
      else if (response.status === 404) message = "المورد المطلوب غير موجود";
      else if (response.status >= 500) message = "حدث خطأ في الخادم، يرجى المحاولة لاحقاً";
      else message = response.statusText || `فشل الطلب برمز الحالة (${response.status})`;
    }

    throw new Error(message);
  }

  return data as T;
}
