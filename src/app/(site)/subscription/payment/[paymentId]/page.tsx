import React from "react";
import { Metadata } from "next";
import { PaymentVerificationView } from "@/features/payment";

export const metadata: Metadata = {
  title: "التحقق من حالة الدفع | مدارك القراءة",
  description: "التحقق من حالة عملية الدفع وتأكيد تفعيل الاشتراك عبر بوابة ميسر.",
};

interface PaymentPageProps {
  params: Promise<{ paymentId: string }>;
}

export default async function SubscriptionPaymentVerificationPage({
  params,
}: PaymentPageProps) {
  const resolvedParams = await params;
  return <PaymentVerificationView paymentId={resolvedParams.paymentId} />;
}
