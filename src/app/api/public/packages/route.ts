import { API_BASE_URL } from "@/services/api";

export const dynamic = "force-dynamic";

// Public, fixed upstream endpoint: never forward browser cookies or credentials.
export async function GET() {
  try {
    const upstream = await fetch(`${API_BASE_URL.replace(/\/+$/, "")}/public/packages`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
      redirect: "error",
    });
    const isJson = upstream.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await upstream.json().catch(() => null) : null;
    if (!upstream.ok) {
      return Response.json(
        { success: false, message: typeof data?.message === "string" ? data.message : "تعذر تحميل الباقات من الخادم. يرجى المحاولة لاحقاً." },
        { status: upstream.status, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (!data?.success || !Array.isArray(data?.data?.packages)) {
      return Response.json(
        { success: false, message: "استجابة الباقات غير صالحة. يرجى المحاولة لاحقاً." },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { success: false, message: "تعذر الاتصال بخادم الباقات. يرجى إعادة المحاولة." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
