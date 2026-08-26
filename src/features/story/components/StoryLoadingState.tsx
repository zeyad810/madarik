"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface StoryLoadingStateProps {
  message?: string;
}

export const StoryLoadingState: React.FC<StoryLoadingStateProps> = ({
  message = "جاري تحميل القصص المتاحة...",
}) => {
  return (
    <div className="py-24 flex flex-col items-center justify-center gap-4 text-slate-500" dir="rtl">
      <Loader2 className="w-10 h-10 animate-spin text-[#7939E3]" />
      <p className="font-bold text-sm">{message}</p>
    </div>
  );
};

export default StoryLoadingState;
