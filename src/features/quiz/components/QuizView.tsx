"use client";

// ────────────────────────────────────────────────────────────────────────────
// QuizView — Main quiz orchestrator client component.
// Owns all quiz state: selected answers, check results, current question,
// submission state. Timer is delegated to QuizTimer (uses Zustand persist).
// ────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, LogOut, Loader2 } from "lucide-react";
import { AutoBreadcrumbs } from "@/components/ui/Breadcrumb";
import Loading from "@/app/loading";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { useQuiz } from "../hooks/useQuiz";
import { useCheckQuizAnswer } from "../hooks/useCheckQuizAnswer";
import { useSubmitQuiz } from "../hooks/useSubmitQuiz";
import { useQuizTimerStore } from "../store/useQuizTimerStore";
import { QuizTimer } from "./QuizTimer";
import { QuizProgress } from "./QuizProgress";
import { QuizQuestion } from "./QuizQuestion";
import { QuizResult } from "./QuizResult";
import { QuizHistory } from "./QuizHistory";
import {
  roleHasHistory,
  getCurrentTimestamp,
  calculateElapsedSeconds,
} from "../utils";
import type {
  SelectedAnswersMap,
  CheckedAnswersMap,
  SubmissionState,
  QuizResultData,
} from "../types";

interface QuizViewProps {
  quizId: string;
  storyId: string;
  storyTitle?: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ quizId, storyId, storyTitle }) => {
  const { userRole, isAuthenticated } = useActiveAccount();
  const role = isAuthenticated ? (userRole || "parent") : "visitor";

  // ── Data ───────────────────────────────────────────────────────────────────
  const { data: quizResponse, isLoading, isError } = useQuiz(quizId);
  const quiz = quizResponse?.data;

  // ── Quiz State ─────────────────────────────────────────────────────────────
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswersMap>({});
  const [checkedAnswers, setCheckedAnswers] = useState<CheckedAnswersMap>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [quizResult, setQuizResult] = useState<QuizResultData | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const isSubmittingRef = useRef(false); // prevents double-submit
  const startTimeRef = useRef<number | null>(null); // tracks elapsed time initialized in effect

  // Initialize start time on mount
  useEffect(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = getCurrentTimestamp();
    }
  }, []);

  // ── Timer store ────────────────────────────────────────────────────────────
  const { clearTimer } = useQuizTimerStore();

  // ── Mutations ──────────────────────────────────────────────────────────────
  const { mutateAsync: checkAnswer, isPending: isChecking } = useCheckQuizAnswer(quizId);
  const { mutateAsync: submitQuizMutation } = useSubmitQuiz(quizId);

  // ── Computed ───────────────────────────────────────────────────────────────
  const questions = quiz?.questions
    ? [...quiz.questions].sort((a, b) => a.order - b.order)
    : [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIdx];

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSelectAnswer = (questionId: string, answer: string) => {
    // Don't allow changing after checking
    if (checkedAnswers[questionId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setValidationError(null);
  };

  /** Performs the submit — safe against double-calls */
  const performSubmit = async (answers: SelectedAnswersMap) => {
    const answerEntries = Object.entries(answers);
    if (answerEntries.length === 0) {
      // Nothing to submit
      isSubmittingRef.current = false;
      return;
    }

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setSubmissionState("submitting");

    try {
      const payload = {
        answers: answerEntries.map(([question_id, answer]) => ({
          question_id,
          answer: typeof answer === "string" ? answer.trim() : answer,
        })),
      };
      const response = await submitQuizMutation(payload);
      const resultData = (response as any)?.data
        ? (response as any).data
        : response;

      const elapsedSeconds = calculateElapsedSeconds(startTimeRef.current);

      setQuizResult({
        ...resultData,
        time_taken: resultData?.time_taken ?? elapsedSeconds,
      });
      setSubmissionState("submitted");
      clearTimer();
    } catch (err) {
      console.error("[Quiz Submit Error]:", err);
      setSubmissionState("idle");
      isSubmittingRef.current = false;
    }
  };

  /** Called by QuizTimer when time runs out */
  const handleTimerExpire = () => {
    if (submissionState !== "idle") return;
    if (Object.keys(selectedAnswers).length === 0) return;
    performSubmit(selectedAnswers);
  };

  /** Move to next question after checking the current answer */
  const handleNext = async () => {
    if (!currentQuestion) return;
    const selectedAnswer = selectedAnswers[currentQuestion.id];

    // Validate: must have an answer
    if (!selectedAnswer) {
      setValidationError("يرجى اختيار إجابة للمتابعة");
      return;
    }
    setValidationError(null);

    // Check answer if not already checked
    if (!checkedAnswers[currentQuestion.id]) {
      try {
        const result = await checkAnswer({
          question_id: currentQuestion.id,
          answer: selectedAnswer,
        });
        setCheckedAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: {
            isCorrect: result.data.is_correct,
            correctAnswer: result.data.correct_answer,
          },
        }));
        // Short pause so user can see feedback, then advance
        await new Promise((r) => setTimeout(r, 1200));
      } catch (err) {
        // Check-answer failed — continue anyway without blocking
        console.warn("[Check Answer Error]:", err);
      }
    }

    // Advance or submit
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setValidationError(null);
    }
  };

  const handleFinish = async () => {
    if (!currentQuestion) return;
    const selectedAnswer = selectedAnswers[currentQuestion.id];

    if (!selectedAnswer) {
      setValidationError("يرجى الإجابة على جميع الأسئلة للمتابعة");
      return;
    }

    const updatedAnswers = {
      ...selectedAnswers,
      [currentQuestion.id]: selectedAnswer,
    };

    // Check last answer if not checked
    if (!checkedAnswers[currentQuestion.id]) {
      try {
        const result = await checkAnswer({
          question_id: currentQuestion.id,
          answer: selectedAnswer,
        });
        setCheckedAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: {
            isCorrect: result.data.is_correct,
            correctAnswer: result.data.correct_answer,
          },
        }));
        await new Promise((r) => setTimeout(r, 600));
      } catch {
        // Continue anyway
      }
    }

    await performSubmit(updatedAnswers);
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setCheckedAnswers({});
    setSubmissionState("idle");
    setQuizResult(null);
    setValidationError(null);
    isSubmittingRef.current = false;
    startTimeRef.current = getCurrentTimestamp();
    clearTimer();
  };

  const isLastQuestion = currentIdx === totalQuestions - 1;
  const isNavigating = isChecking || submissionState === "submitting";

  // ── States: Loading & Submitting ──────────────────────────────────────────
  if (isLoading || submissionState === "submitting") {
    return <Loading />;
  }

  // ── States: Error ──────────────────────────────────────────────────────────
  if (isError || !quiz) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#FAFAFC] px-4"
      >
        <Image
          src="/iamges/q-quiz-done.png"
          alt="خطأ"
          width={100}
          height={100}
          className="opacity-50"
        />
        <p className="text-slate-700 font-bold text-center">
          تعذر تحميل الاختبار. يرجى المحاولة لاحقاً.
        </p>
        <Link
          href={`/stories/${storyId}`}
          className="py-2.5 px-6 rounded-full bg-[#7939E3] text-white font-bold text-sm shadow-md"
        >
          العودة للقصة
        </Link>
      </div>
    );
  }
  if (totalQuestions === 0) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#FAFAFC] px-4"
      >
        <p className="text-slate-700 font-bold text-center">
          هذا الاختبار لا يحتوي على أسئلة بعد.
        </p>
        <Link
          href={`/stories/${storyId}`}
          className="py-2.5 px-6 rounded-full bg-[#7939E3] text-white font-bold text-sm shadow-md"
        >
          العودة للقصة
        </Link>
      </div>
    );
  }

  // ── States: Result ─────────────────────────────────────────────────────────
  if (submissionState === "submitted" && quizResult) {
    return (
      <QuizResult
        result={quizResult}
        storyId={storyId}
        userRole={role}
        onRetry={handleRetry}
      />
    );
  }

  // ── Main Quiz UI ───────────────────────────────────────────────────────────
  const currentChecked = checkedAnswers[currentQuestion?.id ?? ""] ?? null;
  const currentSelected = selectedAnswers[currentQuestion?.id ?? ""] ?? null;
  const checkedBoolMap: Record<string, boolean> = Object.fromEntries(
    Object.entries(checkedAnswers).map(([k, v]) => [k, v.isCorrect])
  );

  // Points calculation: 20 points per correct answer (starts at 0)
  const correctCount = Object.values(checkedAnswers).filter((r) => r.isCorrect).length;
  const currentPoints = correctCount * 20;

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col justify-between bg-[#FAFAFC] relative overflow-hidden"
    >
      {/* ─────────────────── TOP HEADER & BREADCRUMBS ─────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-3 select-none">
          <Link href="/" className="hover:text-[#7939E3] transition-colors">
            الرئيسية
          </Link>
          <span>&gt;</span>
          <Link href="/stories" className="hover:text-[#7939E3] transition-colors">
            القصص
          </Link>
          <span>&gt;</span>
          <Link href={`/stories/${storyId}`} className="hover:text-[#7939E3] transition-colors">
            {storyTitle ?? quiz.story_title}
          </Link>
          <span>&gt;</span>
          <span className="text-slate-600">اختبار القصة</span>
        </div>

        {/* Header Title & Level Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1E1B4B]">
            اختبار: {quiz.story_title || storyTitle}
          </h1>

          <div className="flex items-center gap-2">
            <span className="bg-[#E8F8F0] text-[#10B981] font-bold text-xs px-3.5 py-1 rounded-full border border-[#A7F3D0]">
              مستوى 1
            </span>
            <span className="bg-[#F3E8FF] text-[#7939E3] font-bold text-xs px-3.5 py-1 rounded-full border border-[#E9D5FF]">
              اختيار متعدد
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────── 3-COLUMN MAIN CONTENT (RTL) ─────────────────── */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* 1. RIGHT COLUMN (in RTL, 1st child is on the RIGHT) — Character & Speech Bubble */}
          <aside className="lg:col-span-3 hidden lg:flex flex-col items-center justify-start pt-6">

            {/* 3D Character Illustration */}
            <div className="relative w-full flex justify-center">
              <Image
                src="/iamges/q-boyThinking.png"
                alt="فكر جيدا"
                width={240}
                height={340}
                style={{ width: "auto", height: "auto" }}
                className="object-contain max-h-[380px] drop-shadow-md"
                priority
              />
            </div>
          </aside>

          {/* 2. CENTER COLUMN — Stepper + Main Quiz Card + Actions */}
          <section className="lg:col-span-6 flex flex-col items-center w-full">
            {/* Top Stepper Timeline */}
            <div className="w-full mb-3">
              <QuizProgress
                total={totalQuestions}
                current={currentIdx}
                checkedAnswers={checkedBoolMap}
                questionIds={questions.map((q) => q.id)}
              />
            </div>

            {/* Main Question Card */}
            <div className="w-full bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion?.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  {currentQuestion && (
                    <QuizQuestion
                      question={currentQuestion}
                      selectedAnswer={currentSelected}
                      checkResult={currentChecked}
                      isChecking={isChecking}
                      onSelectAnswer={handleSelectAnswer}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Validation error */}
              <AnimatePresence>
                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-xs sm:text-sm font-bold text-[#DC2626] bg-red-50 rounded-xl py-2.5 px-4 border border-red-100"
                  >
                    {validationError}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="flex items-center justify-center gap-4 mt-6 w-full">
              {/* Next or Finish Button */}
              {isLastQuestion ? (
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isNavigating}
                  className="flex items-center justify-center gap-2 py-3 px-8 rounded-full bg-[#7939E3] hover:bg-[#6D28D9] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
                >
                  {isNavigating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  <span>إنهاء الاختبار</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isNavigating}
                  className="flex items-center justify-center gap-2 py-3 px-8 rounded-full bg-[#7939E3] hover:bg-[#6D28D9] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
                >
                  {isNavigating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  <span>التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}

              {/* Previous Button */}
              {currentIdx > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isNavigating}
                  className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>
              )}
            </div>
          </section>

          {/* 3. LEFT COLUMN (in RTL, 3rd child is on the LEFT) — Score & Timer & Exit */}
          <aside className="lg:col-span-3 flex flex-col gap-4">
            {/* Score Card */}
            <div className="bg-white rounded-[24px] p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center gap-2">
              <Image
                src="/iamges/q-trophy-circle.png"
                alt="النقاط"
                width={56}
                height={56}
                style={{ width: "auto", height: "auto" }}
                className="drop-shadow-xs"
              />
              <span className="text-xs font-bold text-slate-500">نقاطك</span>
              <span className="text-4xl font-black text-[#7939E3]">
                {currentPoints}
              </span>
              <span className="text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-full border border-emerald-100">
                +20 نقطة للإجابة الصحيحة
              </span>
            </div>

            {/* Timer Card */}
            <div className="bg-white rounded-[24px] p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center">
              <QuizTimer quizId={quizId} onExpire={handleTimerExpire} />
            </div>

            {/* Exit Quiz Button */}
            <Link
              href={`/stories/${storyId}`}
              className="w-full py-3 px-4 rounded-full border border-red-200 bg-white text-red-500 hover:bg-red-50 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج من الاختبار</span>
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default QuizView;
