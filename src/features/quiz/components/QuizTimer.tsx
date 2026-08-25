"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { formatTimerDisplay } from "../utils";
import { QUESTION_DURATION_SECONDS } from "../constants";

interface QuizTimerProps {
  questionId: string;
  durationSeconds?: number;
  /** Called when the timer reaches zero */
  onExpire: () => void;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  questionId,
  durationSeconds = QUESTION_DURATION_SECONDS,
  onExpire,
}) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(durationSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Reset timer on question change
  useEffect(() => {
    setRemainingSeconds(durationSeconds);
  }, [questionId, durationSeconds]);

  // Tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            onExpireRef.current();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [questionId, durationSeconds]);

  const totalDuration = durationSeconds;
  const progressPct = Math.max(0, Math.min(1, remainingSeconds / totalDuration));

  // SVG circle progress
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progressPct);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Label */}
      <span className="text-xs font-bold text-slate-500">الوقت المتبقي للسؤال</span>

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
            alt="الوقت"
            width={16}
            height={16}
            style={{ width: "auto", height: "auto" }}
            className="mb-0.5"
          />
          <span className="text-sm font-black text-slate-800 leading-tight">
            {formatTimerDisplay(remainingSeconds)}
          </span>
          <span className="text-[10px] font-bold text-slate-400">دقيقة</span>
        </div>
      </div>
    </div>
  );
};

export default QuizTimer;
