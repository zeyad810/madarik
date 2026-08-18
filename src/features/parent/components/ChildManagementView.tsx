"use client";

import React, { useState, useMemo } from "react";
import { PlusCircle } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ChildSlider } from "./ChildSlider";
import { AddChildModal } from "./AddChildModal";
import { ManagedChild } from "../types";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { getAgeCategoryFromBirthDate } from "@/lib/utils";

export const ChildManagementView: React.FC = () => {
  const { children: sessionChildren } = useActiveAccount();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Map session children to ManagedChild format
  const mappedSessionChildren: ManagedChild[] = useMemo(() => {
    return (sessionChildren || []).map((c) => ({
      id: c.id,
      name: c.name,
      ageCategory: getAgeCategoryFromBirthDate(c.birth_date),
      avatar: c.gender === "female" ? "/assets/girl_avatar.png" : "/assets/boy_avatar.png",
      gender: (c.gender === "female" ? "female" : "male") as "male" | "female",
      status: (c.status === "inactive" ? "inactive" : "active") as "active" | "inactive",
      birthDate: c.birth_date,
      badgesCount: c.badges_count ?? c.badges ?? 0,
    }));
  }, [sessionChildren]);

  // Support local additions during the active session
  const [addedChildren, setAddedChildren] = useState<ManagedChild[]>([]);
  // Local status overrides if toggled by user in UI
  const [statusOverrides, setStatusOverrides] = useState<Record<string, "active" | "inactive">>({});

  const displayChildren = useMemo(() => {
    const combined = [...mappedSessionChildren, ...addedChildren];
    return combined.map((child) => ({
      ...child,
      status: statusOverrides[child.id] || child.status,
    }));
  }, [mappedSessionChildren, addedChildren, statusOverrides]);

  const handleToggleStatus = (child: ManagedChild) => {
    setStatusOverrides((prev) => ({
      ...prev,
      [child.id]: child.status === "active" ? "inactive" : "active",
    }));
  };

  const handleAddChild = (newChildData: Omit<ManagedChild, "id">) => {
    const newChild: ManagedChild = {
      ...newChildData,
      id: `child-${Date.now()}`,
    };
    setAddedChildren((prev) => [newChild, ...prev]);
  };

  return (
    <div className="w-full min-h-screen bg-white section-spacing pb-0!" dir="rtl">
      <div className="container mx-auto ">
        {/* =========================================================================
            1. BREADCRUMBS NAVIGATION
           ========================================================================= */}
        <div className="flex items-center justify-start ">
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
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="order-2 px-6 py-3 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <PlusCircle className="size-5 stroke-[2.2]" />
            <span>إضافة طفل جديد</span>
          </button>
        </div>

        {/* =========================================================================
            3. CHILDREN SLIDER SECTION OR EMPTY STATE
           ========================================================================= */}
        {displayChildren.length > 0 ? (
          <div className="pt-4">
            <ChildSlider
              childrenList={displayChildren}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        ) : (
          <div className="py-16 text-center space-y-4 border-2 border-dashed border-gray-200 rounded-3xl p-8 bg-gray-50/50">
            <p className="text-gray-500 font-medium text-base sm:text-lg">
              لا يوجد أطفال مضافين حالياً في حسابك.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <PlusCircle className="size-5 stroke-[2.2]" />
              <span>إضافة طفل الآن</span>
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          5. ADD CHILD MODAL DIALOG
         ========================================================================= */}
      <AddChildModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddChild={handleAddChild}
      />
    </div>
  );
};

export default ChildManagementView;
