import React from "react";
import { Metadata } from "next";
import { SubscriptionsHubView } from "@/features/packages";

export const metadata: Metadata = {
  title: "الاشتراكات والدفع | مدارك القراءة",
  description: "إدارة اشتراكاتك، تجديد الباقات، والاطلاع على الفواتير وسجل العمليات.",
};

export default function SubscriptionsDashboardPage() {
  return <SubscriptionsHubView />;
}
