"use client";

import React, { useState, useMemo, Suspense } from "react";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ChildSlider, ChildSliderSkeleton } from "./ChildSlider";
import { ChildStatusConfirmModal } from "./ChildStatusConfirmModal";
import { ManagedChild } from "../types";
import { useToggleChildStatus, useParentChildren } from "../hooks";
import { getAgeCategoryFromBirthDate } from "@/lib/utils";
import Link from "next/link";

export const ChildManagementView: React.FC = () => {
  const router = useRouter();
  const { children: parentChildren, isLoading } = useParentChildren();
  const toggleStatusMutation = useToggleChildStatus();

  // Child currently selected for status toggle confirmation in the modal
  const [selectedChildForToggle, setSelectedChildForToggle] = useState<ManagedChild | null>(null);

  // Map children to ManagedChild format
  const mappedChildren: ManagedChild[] = useMemo(() => {
    return (parentChildren || []).map((c) => ({
      id: String(c.id),
      name: c.name,
      ageCategory: getAgeCategoryFromBirthDate(c.birth_date),
      avatar: c.avatar_img || c.avatar || (c.gender === "female" ? "/assets/girl_avatar.png" : "/assets/boy_avatar.png"),
      avatar_img: c.avatar_img || c.avatar,
      gender: (c.gender === "female" ? "female" : "male") as "male" | "female",
      status: (c.status === "deactivated" || c.status === "inactive" ? "inactive" : "active") as "active" | "inactive",
      birthDate: c.birth_date,
      badgesCount: c.badges_count ?? c.badges ?? 0,
    }));
  }, [parentChildren]);

  // Local status overrides if toggled by user in UI
  const [statusOverrides, setStatusOverrides] = useState<Record<string, "active" | "inactive">>({});

  const displayChildren = useMemo(() => {
    return mappedChildren.map((child) => ({
      ...child,
      status: statusOverrides[child.id] || child.status,
    }));
  }, [mappedChildren, statusOverrides]);

  const togglingChildId = toggleStatusMutation.isPending
    ? typeof toggleStatusMutation.variables === "string"
      ? toggleStatusMutation.variables
      : toggleStatusMutation.variables?.childId
    : null;

  // Open the confirmation modal when user clicks the toggle switch
  const handleOpenToggleModal = (child: ManagedChild) => {
    setSelectedChildForToggle(child);
  };

  // Close the confirmation modal
  const handleCloseToggleModal = () => {
    if (!toggleStatusMutation.isPending) {
      setSelectedChildForToggle(null);
    }
  };

  // Navigate to child form in edit mode
  const handleEditChild = (child: ManagedChild) => {
    router.push(`/parents/childMangement/addChild?mode=edit&id=${child.id}`);
  };

  // Perform status toggle after user confirms in the modal
  const handleConfirmToggleStatus = () => {
    if (!selectedChildForToggle) return;

    const childToToggle = selectedChildForToggle;
    const nextStatus = childToToggle.status === "active" ? "inactive" : "active";

    // Optimistically update status in local UI
    setStatusOverrides((prev) => ({
      ...prev,
      [childToToggle.id]: nextStatus,
    }));

    toggleStatusMutation.mutate(
      { childId: childToToggle.id },
      {
        onError: () => {
          // Revert optimistic update on failure
          setStatusOverrides((prev) => {
            const next = { ...prev };
            delete next[childToToggle.id];
            return next;
          });
        },
        onSuccess: () => {
          // Clean up override when session/query updates
          setStatusOverrides((prev) => {
            const next = { ...prev };
            delete next[childToToggle.id];
            return next;
          });
          setSelectedChildForToggle(null);
        },
        onSettled: () => {
          setSelectedChildForToggle(null);
        },
      }
    );
  };

  return (
    <div className="w-full min-h-screen bg-white section-spacing pb-0!" dir="rtl">
      <div className="container mx-auto">
        {/* =========================================================================
            1. BREADCRUMBS NAVIGATION
           ========================================================================= */}
        <div className="flex items-center justify-start">
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/" className="text-mad-main font-bold hover:underline">
                  الرئيسية
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page className="text-gray-500 font-medium">
                  إدارة الأطفال
                </Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </div>

        {/* =========================================================================
            2. PAGE HEADER (Title + Description & Add Child Action)
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          {/* Title and Subtitle */}
          <div className="order-1 text-right space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              إدارة الأطفال
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal max-w-xl">
              شاهد وقم بإدارة حسابات أطفالك، وتابع تقدمهم القرائي واختباراتهم بكل سهولة.
            </p>
          </div>

          {/* Action Button: Add New Child */}
          <Link
            href={"/parents/childMangement/addChild?mode=add"}
            className="order-2 px-6 py-3 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <PlusCircle className="size-5 stroke-[2.2]" />
            <span>إضافة طفل جديد</span>
          </Link>
        </div>

        {/* =========================================================================
            3. CHILDREN SLIDER SECTION OR EMPTY STATE / SKELETON (Suspended)
           ========================================================================= */}
        <Suspense fallback={<ChildSliderSkeleton count={4} />}>
          {isLoading ? (
            <div className="pt-4">
              <ChildSliderSkeleton count={4} />
            </div>
          ) : displayChildren.length > 0 ? (
            <div className="pt-4">
              <ChildSlider
                childrenList={displayChildren}
                onEditChild={handleEditChild}
                onToggleStatus={handleOpenToggleModal}
                togglingChildId={togglingChildId}
              />
            </div>
          ) : (
            <div className="py-16 text-center space-y-4 border-2 border-dashed border-gray-200 rounded-3xl p-8 bg-gray-50/50 mt-4">
              <p className="text-gray-500 font-medium text-base sm:text-lg">
                لا يوجد أطفال مضافين حالياً في حسابك.
              </p>
              <Link
                href="/parents/childMangement/addChild?mode=add"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <PlusCircle className="size-5 stroke-[2.2]" />
                <span>إضافة طفل الآن</span>
              </Link>
            </div>
          )}
        </Suspense>


        {/* =========================================================================
            4. CHILD STATUS CONFIRMATION MODAL (Warning for Off, Green for On)
           ========================================================================= */}
        <ChildStatusConfirmModal
          isOpen={!!selectedChildForToggle}
          child={selectedChildForToggle}
          onClose={handleCloseToggleModal}
          onConfirm={handleConfirmToggleStatus}
          isLoading={toggleStatusMutation.isPending}
        />
      </div>
    </div>
  );
};

export default ChildManagementView;
