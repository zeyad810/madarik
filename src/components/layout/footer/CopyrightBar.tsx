import React from "react";
import { DEFAULT_COPYRIGHT } from "./constants";

interface CopyrightBarProps {
  copyrightText?: string;
}

const CopyrightBar: React.FC<CopyrightBarProps> = ({
  copyrightText = DEFAULT_COPYRIGHT,
}) => {
  return (
    <div className="w-full border-t border-white/30 pt-6 mt-10 sm:mt-14">
      <div className="flex items-center justify-center text-center">
        {/* Copyright notice — Centered on all screen sizes */}
        <p className="w-full text-center text-xs sm:text-sm font-medium text-white/90">
          {copyrightText}
        </p>
      </div>
    </div>
  );
};

export default CopyrightBar;
