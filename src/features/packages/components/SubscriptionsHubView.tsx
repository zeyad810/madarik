"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { PackagesSelectionView } from "./PackagesSelectionView";
import { SubscriptionStatusView } from "./SubscriptionStatusView";

export const SubscriptionsHubView: React.FC = () => {
  const router = useRouter();
  const {
    isAuthenticated,
    isParentRole,
    isFreeCustomer,
    isStudent,
    userRole,
    activeAccount,
    isLoading,
  } = useActiveAccount();

  const isChildOrStudent =
    isStudent ||
    userRole === "student" ||
    userRole === "child" ||
    activeAccount?.type === "child";

  useEffect(() => {
    if (!isLoading && isAuthenticated && isChildOrStudent) {
      router.push("/stories");
    }
  }, [isLoading, isAuthenticated, isChildOrStudent, router]);

  if (isLoading || isChildOrStudent) {
    return null;
  }

  // If visitor or unauthenticated, show the packages selection page only
  if (!isAuthenticated || (!isParentRole && !isFreeCustomer)) {
    return <PackagesSelectionView />;
  }

  // If authenticated subscriber (parent / free customer), show their subscription status
  return <SubscriptionStatusView />;
};

export default SubscriptionsHubView;
