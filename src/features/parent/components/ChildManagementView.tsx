"use client";

import React, { useState, useMemo } from "react";
import { PlusCircle } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ChildSlider } from "./ChildSlider";
import { AddChildModal } from "./AddChildModal";
import { ManagedChild } from "../types";
import { useActiveAccount } from "@/hooks/useActiveAccount";

// Default showcase mock children matching design
const INITIAL_MOCK_CHILDREN: ManagedChild[] = [
  {
    id: "child-yousef",
    name: "يوسف",
    ageCategory: "13-15 سنة",
    avatar: "/assets/boy_avatar.png",
    gender: "male",
    status: "inactive",
  },
  {
    id: "child-sarah",
    name: "سارة",
    ageCategory: "10-12 سنة",
    avatar: "/assets/girl_avatar.png",
    gender: "female",
    status: "active",
  },
  {
    id: "child-saleem",
    name: "سليم",
    ageCategory: "5-9 سنوات",
    avatar: "/assets/boy_avatar.png",
    gender: "male",
    status: "active",
  },
  {
    id: "child-ahmed",
    name: "أحمد",
    ageCategory: "5-9 سنوات",
    avatar: "/assets/boy_avatar.png",
    gender: "male",
    status: "active",
  },
];

export const ChildManagementView: React.FC = () => {
  const { children: sessionChildren, activeChild, switchAccount } = useActiveAccount();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initialize with session children if available, or merge with default mockup list
  const [localChildren, setLocalChildren] = useState<ManagedChild[]>(INITIAL_MOCK_CHILDREN);

  // Combine session children with showcase children
  const displayChildren = useMemo(() => {
    if (sessionChildren && sessionChildren.length > 0) {
      const mappedSessionChildren: ManagedChild[] = sessionChildren.map((c) => ({
        id: c.id,
        name: c.name,
        ageCategory: "5-9 سنوات",
        avatar: c.gender === "female" ? "/assets/girl_avatar.png" : "/assets/boy_avatar.png",
        gender: (c.gender as "male" | "female") || "male",
        status: (c.status as "active" | "inactive") || "active",
      }));

      // Merge avoiding duplicate IDs
      const existingIds = new Set(mappedSessionChildren.map((c) => c.id));
      const remainingLocal = localChildren.filter((c) => !existingIds.has(c.id));
      return [...mappedSessionChildren, ...remainingLocal];
    }
    return localChildren;
  }, [sessionChildren, localChildren]);

  // Selected child for active preview notice (defaults to Sarah or active child)
  const [selectedChildId, setSelectedChildId] = useState<string>(
    activeChild?.id || displayChildren[1]?.id || displayChildren[0]?.id || ""
  );

  const selectedChild = displayChildren.find((c) => c.id === selectedChildId) || displayChildren[0];

  const handleSelectChild = (child: ManagedChild) => {
    setSelectedChildId(child.id);
    switchAccount(child.id);
  };

  const handleToggleStatus = (child: ManagedChild) => {
    setLocalChildren((prev) =>
      prev.map((c) =>
        c.id === child.id
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    );
  };

  const handleAddChild = (newChildData: Omit<ManagedChild, "id">) => {
    const newChild: ManagedChild = {
      ...newChildData,
      id: `child-${Date.now()}`,
    };
    setLocalChildren((prev) => [newChild, ...prev]);
    setSelectedChildId(newChild.id);
  };

  return (
    <div className="w-full min-h-screen bg-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-12" dir="rtl">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* =========================================================================
            1. BREADCRUMBS NAVIGATION
           ========================================================================= */}
        <div className="flex items-center justify-end">
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
          {/* Action Button: Add New Child */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="order-2 sm:order-1 px-6 py-3 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <PlusCircle className="size-5 stroke-[2.2]" />
            <span>إضافة طفل جديد</span>
          </button>

          {/* Title and Subtitle */}
          <div className="order-1 sm:order-2 text-right space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              إدارة الأطفال
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal max-w-xl">
              شاهد وقم بإدارة حسابات أطفالك، وتابع تقدمهم القرائي واختباراتهم بكل سهولة.
            </p>
          </div>
        </div>

        {/* =========================================================================
            3. CHILDREN SLIDER SECTION
           ========================================================================= */}
        <div className="pt-4">
          <ChildSlider
            childrenList={displayChildren}
            selectedChildId={selectedChildId}
            onSelectChild={handleSelectChild}
            onToggleStatus={handleToggleStatus}
            onEditChild={(child) => {
              setSelectedChildId(child.id);
            }}
          />
        </div>

        {/* =========================================================================
            4. CURRENT ACTIVE PREVIEW NOTICE
           ========================================================================= */}
        {selectedChild && (
          <div className="text-center pt-2">
            <p className="text-mad-main font-bold text-sm sm:text-base transition-all">
              انت الان تري جميع بيانات {selectedChild.name}
            </p>
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
