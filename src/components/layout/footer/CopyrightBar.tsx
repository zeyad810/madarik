import React from "react";
import Link from "next/link";
import { DEFAULT_COPYRIGHT } from "./constants";

interface CopyrightBarProps {
  copyrightText?: string;
}

const CopyrightBar: React.FC<CopyrightBarProps> = ({
  copyrightText = DEFAULT_COPYRIGHT,
}) => {
  return (
    <div className="w-full border-t border-white/20 pt-6 mt-8 sm:mt-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right text-xs text-white/80 font-medium">
        {/* Mobile / Secondary Legal links */}
        <div className="flex items-center gap-4 sm:hidden">
          <Link href="/privacy" className="hover:text-white transition-colors">
            سياسة الخصوصية
          </Link>
          <span className="text-white/40">|</span>
          <Link href="/terms" className="hover:text-white transition-colors">
            شروط الاستخدام
          </Link>
        </div>

        {/* Copyright notice */}
        <p className="w-full text-center sm:text-right">{copyrightText}</p>
      </div>
    </div>
  );
};

export default CopyrightBar;
