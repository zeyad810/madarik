import React from "react";

export const FreeRosetteBadge: React.FC = () => {
  return (
    <div className="absolute top-3 left-3 z-10 flex items-center justify-center pointer-events-none select-none">
      <div className="relative flex items-center justify-center">
        {/* Ribbon Tail Wings */}
        <svg
          width="74"
          height="28"
          viewBox="0 0 74 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute drop-shadow-sm"
        >
          {/* Left Ribbon Tail */}
          <path
            d="M14 4H0L7 14L0 24H14V4Z"
            fill="white"
            stroke="#CBD5E1"
            strokeWidth="0.75"
          />
          {/* Right Ribbon Tail */}
          <path
            d="M60 4H74L67 14L74 24H60V4Z"
            fill="white"
            stroke="#CBD5E1"
            strokeWidth="0.75"
          />
        </svg>

        {/* Green Scalloped Rosette Seal */}
        <div className="relative w-12 h-12 rounded-full bg-[#15803D] p-[3px] shadow-md flex items-center justify-center ring-2 ring-white">
          <div className="w-full h-full rounded-full bg-[#16A34A] p-0.5 flex items-center justify-center border border-dashed border-white/70">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner">
              <span className="text-[#15803D] font-extrabold text-[13px] leading-none">
                مجاني
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeRosetteBadge;
