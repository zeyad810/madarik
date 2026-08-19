"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useQuizTimerStore } from "../store/useQuizTimerStore";
import { getRemainingSeconds, formatTimerDisplay } from "../utils";
import { QUIZ_DURATION_SECONDS } from "../constants";

interface QuizTimerProps {
  quizId: string;
  /** Called when the timer reaches zero */
  onExpire: () => void;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({ quizId, onExpire }) => {
  const { quizId: storedQuizId, expiresAt, setTimer, clearTimer } = useQuizTimerStore();
  const [remainingSeconds, setRemainingSeconds] = useState<number>(QUIZ_DURATION_SECONDS);
  const hasExpiredRef = useRef(false);
  const hasInitialized = useRef(false);

  // Initialize or restore timer on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (storedQuizId === quizId && expiresAt !== null) {
      const remaining = getRemainingSeconds(expiresAt);
      if (remaining > 0) {
        // Restore active timer
        setRemainingSeconds(remaining);
      } else {
        // Expired from earlier session — reset fresh timer
        const newExpiresAt = Date.now() + QUIZ_DURATION_SECONDS * 1000;
        setTimer(quizId, newExpiresAt);
        setRemainingSeconds(QUIZ_DURATION_SECONDS);
      }
    } else {
      // New quiz — start fresh timer
      const newExpiresAt = Date.now() + QUIZ_DURATION_SECONDS * 1000;
      setTimer(quizId, newExpiresAt);
      setRemainingSeconds(QUIZ_DURATION_SECONDS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  // Tick every second
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const remaining = getRemainingSeconds(expiresAt);
      setRemainingSeconds(remaining);

      if (remaining === 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        clearInterval(interval);
        clearTimer();
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, clearTimer, onExpire]);

  const totalDuration = QUIZ_DURATION_SECONDS;
  const progressPct = Math.max(0, Math.min(1, remainingSeconds / totalDuration));

  // SVG circle progress
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progressPct);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Label */}
      <span className="text-xs font-bold text-slate-500">الوقت المتبقي</span>

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
