"use client";

import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, RefreshCw, ShieldCheck, AlertCircle } from "lucide-react";

export interface StreamCheckoutEmbedProps {
  paymentUrl: string;
  paymentId: string;
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

export function loadStreamScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).Stream?.Checkout) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.getElementById("streampay-embed-sdk") as HTMLScriptElement | null;
    if (existing) {
      if ((window as any).Stream?.Checkout) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Stream SDK")));
      return;
    }

    const script = document.createElement("script");
    script.id = "streampay-embed-sdk";
    script.src = "https://stream-embed.streampay.sa/sdk/embed.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Stream SDK"));
    document.head.appendChild(script);
  });
}

export const StreamCheckoutEmbed: React.FC<StreamCheckoutEmbedProps> = ({
  paymentUrl,
  paymentId,
  onSuccess,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let checkoutInstance: { destroy: () => void; getIframe?: () => HTMLIFrameElement } | null = null;
    let isCancelled = false;

    async function initCheckout() {
      try {
        setLoading(true);
        setLoadError(null);
        await loadStreamScript();

        if (isCancelled) return;

        const streamGlobal = (window as any).Stream;
        if (!streamGlobal?.Checkout) {
          throw new Error("Stream.Checkout is not available");
        }

        if (containerRef.current) {
          checkoutInstance = streamGlobal.Checkout({
            paymentLink: paymentUrl,
            container: containerRef.current,
            minHeightPx: 380,
            maxHeightPx: 800,
          });
          setLoading(false);
        }
      } catch (err: any) {
        if (isCancelled) return;
        setLoading(false);
        setLoadError(err?.message || "تعذر تحميل نافذة الدفع");
        if (onError) onError(err?.message);
      }
    }

    initCheckout();

    // Listen to iframe postMessages from StreamPay
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data?.type === "string" && event.data.type.startsWith("stream:")) {
        const type = event.data.type;
        if (
          type === "stream:success" ||
          type === "stream:paid" ||
          type === "stream:complete"
        ) {
          if (onSuccess) onSuccess();
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      isCancelled = true;
      window.removeEventListener("message", handleMessage);
      try {
        if (checkoutInstance && typeof checkoutInstance.destroy === "function") {
          checkoutInstance.destroy();
        }
      } catch (e) {
        // ignore destroy error
      }
    };
  }, [paymentUrl, onSuccess, onError]);

  const handleOpenExternal = () => {
    window.open(paymentUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full space-y-3" dir="rtl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-2 py-1 text-xs text-gray-500">
        <div className="flex items-center gap-1.5 font-medium text-emerald-700">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>بوابة StreamPay الآمنة</span>
        </div>
        <button
          type="button"
          onClick={handleOpenExternal}
          className="inline-flex items-center gap-1 text-mad-main hover:underline cursor-pointer"
        >
          <span>فتح في نافذة مستقلة</span>
          <ExternalLink className="size-3" />
        </button>
      </div>

      {/* Embed Container with id="stream-checkout" */}
      <div className="relative w-full min-h-[380px] rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-inner">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/90 z-10">
            <RefreshCw className="size-8 animate-spin text-mad-main" />
            <p className="text-xs text-gray-500 font-medium">جاري تجهيز بوابة الدفع الآمنة...</p>
          </div>
        )}

        {loadError && (
          <div className="p-6 text-center space-y-3">
            <AlertCircle className="size-8 text-rose-500 mx-auto" />
            <p className="text-xs text-rose-600 font-semibold">{loadError}</p>
            <button
              type="button"
              onClick={handleOpenExternal}
              className="px-5 py-2 rounded-xl bg-mad-main text-white font-bold text-xs"
            >
              المتابعة والدفع عبر صفحة StreamPay الخارجية
            </button>
          </div>
        )}

        <div
          id="stream-checkout"
          ref={containerRef}
          className="w-full min-h-[380px]"
        />
      </div>

      {/* Verification footer action */}
      <div className="flex items-center justify-between pt-1 text-xs text-gray-500">
        <span>رقم العملية: {paymentId}</span>
        {onSuccess && (
          <button
            type="button"
            onClick={onSuccess}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className="size-3.5" />
            <span>تأكيد نجاح الدفع</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StreamCheckoutEmbed;
