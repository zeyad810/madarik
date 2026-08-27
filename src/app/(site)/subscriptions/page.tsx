"use client";

import React from "react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { PackagesSelectionView, SubscriptionStatusView } from "@/features/packages";

export default function SubscriptionsDashboardPage() {
  const { isAuthenticated, isParentRole, isFreeCustomer, isLoading } = useActiveAccount();

  if (isLoading) {
    return <PackagesSelectionView />;
  }

  // If visitor or unauthenticated, show the packages selection page only
  if (!isAuthenticated || (!isParentRole && !isFreeCustomer)) {
    return <PackagesSelectionView />;
  }

  // If authenticated subscriber (parent / free customer), show their subscription status
  return <SubscriptionStatusView />;
}
