"use client";

import React, { useEffect, useEffectEvent, useRef, useState } from "react";
import { getCheckoutUrl } from "../paymentFlow";
import { ExternalLink, RefreshCw, ShieldCheck, AlertCircle } from "lucide-react";

export interface StreamCheckoutEmbedProps {
  paymentUrl: string;
  paymentId: string;
  onSuccess?: (gatewayId?: string | null) => void;
  onError?: (err: string) => void;
}

interface StreamCheckoutInstance {
  destroy: () => void;
  getIframe: () => HTMLIFrameElement;
}

type StreamWindow = Window & {
  Stream?: {
    Checkout: (options: {
      paymentLink: string;
      container: HTMLElement;
      minHeightPx: number;
      maxHeightPx: number;
    }) => StreamCheckoutInstance;
  };
};

let streamScriptPromise: Promise<void> | null = null;

export function loadStreamScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as StreamWindow).Stream?.Checkout) return Promise.resolve();
  if (streamScriptPromise) return streamScriptPromise;

  streamScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById("streampay-embed-sdk");
    const script = existing as HTMLScriptElement | null || document.createElement("script");
    const cleanup = () => {
      clearTimeout(timeout);
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
    const handleError = () => {
      cleanup();
      script.remove();
      reject(new Error("تعذر تحميل بوابة الدفع. يمكنك المتابعة في صفحة الدفع الخارجية."));
    };
    const handleLoad = () => {
      if (!(window as StreamWindow).Stream?.Checkout) return handleError();
      cleanup();
      resolve();
    };
    const timeout = setTimeout(handleError, 15000);
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    if (!existing) {
      script.id = "streampay-embed-sdk";
      script.src = "https://stream-embed.streampay.sa/sdk/embed.min.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }).catch((error: unknown) => {
    streamScriptPromise = null;
    throw error;
  });
  return streamScriptPromise;
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

  const directIframeRef = useRef<HTMLIFrameElement>(null);
  const checkoutUrl = getCheckoutUrl(paymentUrl);
  const isStreamDomain = checkoutUrl.hostname === "streampay.sa" ||
    checkoutUrl.hostname.endsWith(".streampay.sa");
  const notifySuccess = useEffectEvent((gatewayId?: string | null) => onSuccess?.(gatewayId));
  const notifyError = useEffectEvent((message: string) => onError?.(message));

  useEffect(() => {
    let checkoutInstance: StreamCheckoutInstance | null = null;
    let isCancelled = false;
    let isComplete = false;

    // Capture before the SDK's redirect listener so it cannot navigate to a
    // configured backend URL instead of the frontend verification page.
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data?.type !== "string" || !event.data.type.startsWith("stream:")) return;
      const iframe = checkoutInstance?.getIframe() || directIframeRef.current;
      const trusted = iframe && event.source === iframe.contentWindow &&
        event.origin === new URL(iframe.src).origin;
      if (!trusted) {
        event.stopImmediatePropagation();
        return;
      }
      if (!["stream:redirect", "stream:success", "stream:paid", "stream:complete"].includes(event.data.type)) return;
      event.stopImmediatePropagation();
      if (isComplete) return;
      isComplete = true;
      let gatewayId: string | null = null;
      if (typeof event.data.url === "string") {
        try {
          const params = new URL(event.data.url, window.location.origin).searchParams;
          gatewayId = params.get("id") || params.get("streampay_id");
        } catch {
          // Verify with the known backend payment ID even if the return URL is invalid.
        }
      }
      notifySuccess(gatewayId);
    };
    window.addEventListener("message", handleMessage, true);

    async function initCheckout() {
      try {
        if (!isStreamDomain) return;
        await loadStreamScript();
        if (isCancelled) return;
        const streamGlobal = (window as StreamWindow).Stream;
        if (!streamGlobal?.Checkout || !containerRef.current) {
          throw new Error("تعذر تجهيز بوابة الدفع.");
        }
        checkoutInstance = streamGlobal.Checkout({
          paymentLink: paymentUrl,
          container: containerRef.current,
          minHeightPx: 380,
          maxHeightPx: 800,
        });
        setLoading(false);
      } catch (error: unknown) {
        if (isCancelled) return;
        const message = error instanceof Error ? error.message : "تعذر تحميل نافذة الدفع";
        setLoading(false);
        setLoadError(message);
        notifyError(message);
      }
    }
    void initCheckout();
    return () => {
      isCancelled = true;
      window.removeEventListener("message", handleMessage, true);
      checkoutInstance?.destroy();
    };
  }, [paymentUrl, isStreamDomain]);

  const handleOpenExternal = () => {
    // Keep the return in this tab so its checkout ID survives the gateway redirect.
    window.location.assign(checkoutUrl.href);
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
          <span>فتح صفحة الدفع</span>
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

        {/* Non-StreamPay payment URLs (e.g. Moyasar form or direct gateway redirect) */}
        {!isStreamDomain ? (
          <iframe
            ref={directIframeRef}
            src={paymentUrl}
            onLoad={() => setLoading(false)}
            className="w-full min-h-[440px] border-0"
            title="Secure Checkout"
            allow="payment"
          />
        ) : (
          <div
            id="stream-checkout"
            ref={containerRef}
            className="w-full min-h-[380px]"
          />
        )}
      </div>

      {/* Verification footer action */}
      <div className="flex items-center justify-between pt-1 text-xs text-gray-500">
        <span>رقم العملية: {paymentId}</span>
        {onSuccess && (
          <button
            type="button"
            onClick={() => onSuccess?.()}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className="size-3.5" />
            <span>التحقق من حالة الدفع</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StreamCheckoutEmbed;
