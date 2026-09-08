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
  return (
    <PaymentVerificationView
      paymentId={resolvedParams.paymentId}
      streamPayId={Array.isArray(gatewayId) ? gatewayId[0] : gatewayId}
    />
  );
}
