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
  const { paymentId, gatewayId } = resolvePaymentReturn(params, pendingId);

  useEffect(() => {
    if (paymentId) router.replace(getVerificationUrl(paymentId, gatewayId));
  }, [paymentId, gatewayId, router]);

  return { paymentId, streamPayId: gatewayId };
}
