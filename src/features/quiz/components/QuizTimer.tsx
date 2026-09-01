"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatTimerDisplay } from "../utils";

interface QuizTimerProps {
  /** Start time timestamp in ms. If not provided, timer starts from mount. */
  startTime?: number | null;
  /** Optional questionId for backwards compatibility */
  questionId?: string;
  className?: string;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  startTime,
  className = "",
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    const effectiveStart = startTime || Date.now();

    const update = () => {
      const elapsed = Math.max(0, Math.floor((Date.now() - effectiveStart) / 1000));
      setElapsedSeconds(elapsed);
    };

    update();
    const interval = setInterval(update, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  // SVG circle progress — smoothly loops every 60 seconds (stopwatch sweep)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const secondsInMinute = elapsedSeconds % 60;
  const progressPct = secondsInMinute / 60;
  const dashOffset = circumference * (1 - progressPct);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Label */}
      <span className="text-xs font-bold text-slate-500">الوقت المستغرق</span>

      {/* Circular progress */}
      <div className="relative w-24 h-24 my-1">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="6"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#7939E3"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Image
            src="/iamges/q-clock.svg"
            alt="الوقت المستغرق"
            width={16}
            height={16}
            style={{ width: "auto", height: "auto" }}
            className="mb-0.5"
          />
          <span className="text-sm font-black text-slate-800 leading-tight font-mono" dir="ltr">
            {formatTimerDisplay(elapsedSeconds)}
          </span>
          <span className="text-[10px] font-bold text-slate-400">دقيقة : ثانية</span>
        </div>
      </div>
    </div>
  );
};

export default QuizTimer;
