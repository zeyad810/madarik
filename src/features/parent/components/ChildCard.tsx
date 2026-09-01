"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { SquarePen, Trash2 } from "lucide-react";
import { ManagedChild } from "../types";
import { Toggle, ChildCardSkeleton } from "@/components/ui";
import { useChild } from "../hooks/useChild";
import { useDeleteChild } from "../hooks/useDeleteChild";
import { ChildDeleteConfirmModal } from "./ChildDeleteConfirmModal";
import { getAgeCategoryFromBirthDate } from "@/lib/utils";
import { resolveChildBadgesCount } from "@/lib/children";

export interface ChildCardProps {
  child?: ManagedChild;
  childId?: string | number;
  onEdit?: (child: ManagedChild) => void;
  onToggleStatus?: (child: ManagedChild) => void;
  onDelete?: (child: ManagedChild) => void;
  isToggling?: boolean;
  isDeleting?: boolean;
}

export const ChildCard: React.FC<ChildCardProps> = ({
  child,
  childId,
  onEdit,
  onToggleStatus,
  onDelete,
  isToggling = false,
  isDeleting = false,
}) => {
  const resolvedId = child?.id || (childId ? String(childId) : "");
  const { child: childDetails, isLoading } = useChild(resolvedId || null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteChildMutation = useDeleteChild({
    onSuccess: () => {
      setIsDeleteModalOpen(false);
    },
  });

  const gender = (childDetails?.gender || child?.gender || "male") as "male" | "female";
  const defaultAvatar =
    gender === "female" ? "/assets/girl_avatar.png" : "/assets/boy_avatar.png";

  const resolvedAvatar = useMemo(() => {
    return (
      childDetails?.avatar_img ||
      childDetails?.avatar ||
      child?.avatar_img ||
      child?.avatar ||
      defaultAvatar
    );
  }, [childDetails?.avatar_img, childDetails?.avatar, child?.avatar_img, child?.avatar, defaultAvatar]);

  const [avatarSrc, setAvatarSrc] = useState<string>(resolvedAvatar);

  useEffect(() => {
    setAvatarSrc(resolvedAvatar);
  }, [resolvedAvatar]);

  const name = childDetails?.name || child?.name || "طفل";
  const ageCategory = childDetails?.birth_date
    ? getAgeCategoryFromBirthDate(childDetails.birth_date)
    : child?.ageCategory || "";

  const resolvedStatus =
    child?.status ||
    (childDetails?.status === "deactivated" || childDetails?.status === "inactive"
      ? "inactive"
      : "active");
  const isActive = resolvedStatus === "active";

  const badgesCount = childDetails
    ? resolveChildBadgesCount(childDetails)
    : child?.badgesCount ?? 0;

  const currentChild: ManagedChild = useMemo(() => ({
    id: resolvedId,
    name,
    ageCategory,
    avatar: avatarSrc,
    avatar_img: childDetails?.avatar_img || child?.avatar_img || null,
    gender,
    status: resolvedStatus,
    birthDate: childDetails?.birth_date || child?.birthDate,
    badgesCount,
  }), [resolvedId, name, ageCategory, avatarSrc, childDetails, child, gender, resolvedStatus, badgesCount]);

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(currentChild);
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    deleteChildMutation.mutate(
      { childId: currentChild.id },
      {
        onSettled: () => {
          setIsDeleteModalOpen(false);
        },
      }
    );
  };

  if (isLoading && !child) {
    return <ChildCardSkeleton />;
  }

  const isDeletePending = isDeleting || deleteChildMutation.isPending;

  return (
    <>
      <div
        dir="rtl"
        className={`relative w-full mx-auto rounded-3xl p-6 lg:p-8 flex flex-col items-center justify-between transition-all duration-200 select-none border-2 box-border ${
          !isActive
            ? "border-gray-200/90 bg-[#F9FAFB]/90 opacity-80 hover:opacity-95 shadow-xs"
            : "border-gray-200 bg-white hover:border-purple-200 shadow-xs hover:shadow-md hover:scale-[1.01]"
        }`}
      >
        {/* Delete Action Button (Top Right) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick();
          }}
          disabled={isDeletePending}
          title="حذف حساب الطفل"
          aria-label="حذف حساب الطفل"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full bg-red-50/90 hover:bg-red-100 text-red-500 hover:text-red-600 border border-red-100/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center z-10"
        >
          <Trash2 className="size-4 stroke-[2.2]" />
        </button>

        {/* 1. Avatar */}
        <div className="size-24 rounded-full overflow-hidden p-1 ring-2 ring-purple-100/80 bg-purple-50 flex items-center justify-center mb-3 shrink-0 shadow-inner">
          <Image
            src={avatarSrc}
            alt={name}
            width={96}
            height={96}
            className="size-full object-cover rounded-full"
            onError={() => {
              if (avatarSrc !== defaultAvatar) {
                setAvatarSrc(defaultAvatar);
              }
            }}
          />
        </div>

        {/* 2. Name */}
        <h3 className="text-xl font-bold text-gray-900 text-center my-4 truncate max-w-full">
          {name}
        </h3>

        {/* 3. Age Category Badge */}
        {ageCategory ? (
          <div
            className={`px-3.5 py-1 rounded-full text-xs font-bold mb-2 ${
              isActive ? "bg-[#EDE9FE] text-mad-main" : "bg-gray-200 text-gray-500"
            }`}
          >
            الفئة: {ageCategory}
          </div>
        ) : (
          <div className="h-6 mb-2" />
        )}

        {/* 4. Divider */}
        <div className="w-full border-t border-gray-100 my-6" />

        {/* 5. Account Status Row */}
        <div className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold mb-4 px-1">
          {/* Status Label */}
          <span className="text-gray-500 font-medium text-xs sm:text-sm">
            حالة الحساب
          </span>

          {/* Toggle Switch + Status Text */}
          <div className="flex items-center gap-2">
            <span
              className={`font-bold text-xs ${
                isActive ? "text-[#22C55E]" : "text-gray-400"
              }`}
            >
              {isActive ? "مفعل" : "معطل"}
            </span>

            <Toggle
              checked={isActive}
              disabled={isToggling}
              onChange={() => onToggleStatus?.(currentChild)}
              ariaLabel="حالة الحساب"
            />
          </div>
        </div>

        {/* 6. Edit Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(currentChild);
          }}
          className="w-full py-2.5 px-4 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
        >
          <SquarePen className="size-4 stroke-[2.2]" />
          <span>تعديل</span>
        </button>
      </div>

      {/* Standalone Delete Confirmation Modal */}
      {!onDelete && (
        <ChildDeleteConfirmModal
          isOpen={isDeleteModalOpen}
          child={currentChild}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          isLoading={deleteChildMutation.isPending}
        />
      )}
    </>
  );
};

export { ChildCardSkeleton } from "@/components/ui";
export default ChildCard;


