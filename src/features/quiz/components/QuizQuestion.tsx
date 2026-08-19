"use client";

import React from "react";
import Image from "next/image";
import { QuizOption } from "./QuizOption";
import type { QuizQuestion as QuizQuestionType, AnswerCheckResult } from "../types";

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: string | null;
  checkResult: AnswerCheckResult | null;
  isChecking: boolean;
  onSelectAnswer: (questionId: string, answer: string) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswer,
  checkResult,
  isChecking,
  onSelectAnswer,
}) => {
  const isChecked = checkResult !== null;

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      {/* Question hint pill badge */}
      <div className="self-center inline-flex items-center gap-2 bg-[#F3E8FF] text-[#7939E3] font-bold text-xs px-5 py-2 rounded-full border border-purple-100/80 shadow-xs">
        <Image
          src="/iamges/q-icon-mic.png"
          alt=""
          width={16}
          height={16}
          className="opacity-90"
        />
        <span>اقرأ السؤال جيداً واختر الإجابة الصحيحة</span>
      </div>

      {/* Question Text */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#1E1B4B] leading-relaxed text-center my-2">
        {question.question_text}
      </h2>

      {/* Check result feedback banner */}
      {isChecked && (
        <div
          className={`rounded-2xl px-5 py-3.5 flex items-center gap-3 text-sm font-bold shadow-xs ${
            checkResult?.isCorrect
              ? "bg-[#ECFDF5] text-[#065F46] border-2 border-[#10B981]"
              : "bg-[#FEF2F2] text-[#991B1B] border-2 border-[#EF4444]"
          }`}
        >
          <Image
            src={
              checkResult?.isCorrect
                ? "/iamges/q-check-mark.png"
                : "/iamges/q-check-mark-cross.png"
            }
            alt=""
            width={24}
            height={24}
          />
          <div className="flex flex-col text-right">
            <span className="text-base font-black">
              {checkResult?.isCorrect
                ? "أحسنت! إجابتك صحيحة 🎉"
                : "للأسف، إجابتك غير صحيحة ✗"}
            </span>
            {!checkResult?.isCorrect && checkResult?.correctAnswer && (
              <span className="text-xs font-bold text-[#B91C1C] mt-0.5">
                الإجابة الصحيحة هي:{" "}
                <span className="font-black underline underline-offset-2">
                  {checkResult.correctAnswer}
                </span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.options.map((option, idx) => (
          <QuizOption
            key={`${question.id}-${idx}`}
            index={idx}
            text={option}
            isSelected={selectedAnswer === option}
            checkResult={checkResult}
            isDisabled={isChecking || isChecked}
            onSelect={(answer) => onSelectAnswer(question.id, answer)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
