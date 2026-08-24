"use client";

import React from "react";

export interface ParentProfileDetailsProps {
  name: string;
  phone: string;
}

export const ParentProfileDetails: React.FC<ParentProfileDetailsProps> = ({
  name,
  phone,
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Full Name */}
      <div className="flex items-baseline justify-between sm:justify-start gap-4">
        <span className="text-xs sm:text-sm font-semibold text-gray-500 shrink-0">
          الاسم الكامل :
        </span>
        <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">
          {name}
        </span>
      </div>

      {/* Phone Number */}
      <div className="flex items-baseline justify-between sm:justify-start gap-4">
        <span className="text-xs sm:text-sm font-semibold text-gray-500 shrink-0">
          رقم الهاتف :
        </span>
        <span dir="ltr" className="text-xs sm:text-sm font-bold text-gray-900">
          {phone}
        </span>
      </div>
    </div>
  );
};

export default ParentProfileDetails;
