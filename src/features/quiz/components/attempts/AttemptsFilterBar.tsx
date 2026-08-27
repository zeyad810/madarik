import React from "react";
import { ChevronDown } from "lucide-react";

interface AttemptsFilterBarProps {
  selectedLevel: string;
  onLevelChange: (val: string) => void;
  levelsList: string[];

  selectedOutcome: string;
  onOutcomeChange: (val: string) => void;
  outcomesList: string[];

  selectedIndicator: string;
  onIndicatorChange: (val: string) => void;
  indicatorsList: string[];
}

export const AttemptsFilterBar: React.FC<AttemptsFilterBarProps> = ({
  selectedLevel,
  onLevelChange,
  levelsList,
  selectedOutcome,
  onOutcomeChange,
  outcomesList,
  selectedIndicator,
  onIndicatorChange,
  indicatorsList,
}) => {
  return (
    <div className="w-full grid grid-cols-3 sm:flex sm:flex-row sm:items-center sm:justify-start gap-2 sm:gap-3 mb-4">
      {/* 1. Level Filter */}
      <div className="relative w-full sm:w-auto sm:min-w-36">
        <select
          value={selectedLevel}
          onChange={(e) => onLevelChange(e.target.value)}
          className="w-full appearance-none bg-white border border-mad-white-200 text-mad-text-secondary text-xs font-bold rounded-lg py-2 px-2 pr-2.5 pl-5.5 sm:px-4 sm:pr-4 sm:pl-8 shadow-xs hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer text-right truncate"
        >
          <option value="all">المستوى</option>
          {levelsList.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* 2. Outcome Filter */}
      <div className="relative w-full sm:w-auto sm:min-w-36">
        <select
          value={selectedOutcome}
          onChange={(e) => onOutcomeChange(e.target.value)}
          className="w-full appearance-none bg-white border border-mad-white-200 text-mad-text-secondary text-xs font-bold rounded-lg py-2 px-2 pr-2.5 pl-5.5 sm:px-4 sm:pr-4 sm:pl-8 shadow-xs hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer text-right truncate"
        >
          <option value="all">الناتج</option>
          {outcomesList.map((out) => (
            <option key={out} value={out}>
              {out}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* 3. Indicator Filter */}
      <div className="relative w-full sm:w-auto sm:min-w-36">
        <select
          value={selectedIndicator}
          onChange={(e) => onIndicatorChange(e.target.value)}
          className="w-full appearance-none bg-white border border-mad-white-200 text-mad-text-secondary text-xs font-bold rounded-lg py-2 px-2 pr-2.5 pl-5.5 sm:px-4 sm:pr-4 sm:pl-8 shadow-xs hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer text-right truncate"
        >
          <option value="all">المؤشر</option>
          {indicatorsList.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
