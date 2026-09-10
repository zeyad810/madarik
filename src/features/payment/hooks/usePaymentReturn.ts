"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getPendingPaymentId, getVerificationUrl, resolvePaymentReturn } from "../paymentFlow";

const subscribe = () => () => {};
const serverSnapshot = () => null;

export function usePaymentReturn() {
  const params = useSearchParams();
  const router = useRouter();
  const pendingId = useSyncExternalStore(subscribe, getPendingPaymentId, serverSnapshot);
  const { paymentId, gatewayId, status, result, message } = resolvePaymentReturn(params, pendingId);

  console.log("[PaymentDebug] usePaymentReturn hook invoked:", {
    rawSearchParams: params.toString(),
    paymentId,
    gatewayId,
    status,
    result,
    message,
    pendingId,
  });

  useEffect(() => {
    if (paymentId) {
      const destination = getVerificationUrl(paymentId, gatewayId, {
        status,
        result,
        message,
      });
      console.log("[PaymentDebug] usePaymentReturn redirecting to verification page:", destination);
      router.replace(destination);
    } else {
      console.warn("[PaymentDebug] usePaymentReturn: No paymentId could be resolved!");
    }
  }, [paymentId, gatewayId, status, result, message, router]);

  return { paymentId, streamPayId: gatewayId, status, result, message };
}
