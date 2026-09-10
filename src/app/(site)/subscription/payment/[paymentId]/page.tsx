import React from "react";
import { Metadata } from "next";
import { PaymentVerificationView } from "@/features/payment";

export const metadata: Metadata = {
  title: "التحقق من حالة الدفع | مدارك القراءة",
  description: "التحقق من حالة عملية الدفع وتأكيد تفعيل الاشتراك عبر بوابة الدفع الآمنة.",
};

interface PaymentPageProps {
  params: Promise<{ paymentId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SubscriptionPaymentVerificationPage({
  params,
  searchParams,
}: PaymentPageProps) {
  const [resolvedParams, query] = await Promise.all([params, searchParams]);
  const gatewayId = query.id || query.streampay_id;
  const status = query.status;
  const result = query.result;
  const message = query.message;
  return (
    <PaymentVerificationView
      paymentId={resolvedParams.paymentId}
      streamPayId={Array.isArray(gatewayId) ? gatewayId[0] : gatewayId}
      status={Array.isArray(status) ? status[0] : status}
      result={Array.isArray(result) ? result[0] : result}
      message={Array.isArray(message) ? message[0] : message}
    />
  );
}
