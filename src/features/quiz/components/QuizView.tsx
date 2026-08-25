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
import { useQueryClient } from "@tanstack/react-query";
import { AutoBreadcrumbs } from "@/components/ui/Breadcrumb";
import Loading from "@/app/loading";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { useQuiz } from "../hooks/useQuiz";
import { useCheckQuizAnswer } from "../hooks/useCheckQuizAnswer";
import { useSubmitQuiz } from "../hooks/useSubmitQuiz";
import { useQuizTimerStore } from "../store/useQuizTimerStore";
import { quizQueryKeys } from "../constants";
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
  SubmitQuizPayload,
  QuizHistoryItem,
} from "../types";

interface QuizViewProps {
  quizId: string;
  storyId: string;
  storyTitle?: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ quizId, storyId, storyTitle }) => {
  const { userRole, isAuthenticated, activeChild, activeAccountId } = useActiveAccount();
  const role = isAuthenticated ? (userRole || "parent") : "visitor";
  const queryClient = useQueryClient();

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
  const isAdvancingRef = useRef(false); // prevents multiple step jumps on timer expire
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
  const currentQuestion = questions[currentIdx] ?? null;

  // ── Handlers ───────────────────────────────────────────────────────────────

  /** Called when user selects an option - checks answer INSTANTLY */
  const handleSelectAnswer = async (questionId: string, optionValue: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionValue }));
    setValidationError(null);

    try {
      const response = await checkAnswer({
        question_id: questionId,
        answer: optionValue,
      });

      const resData = (response as any)?.data ? (response as any).data : response;
      const isCorrect = Boolean(
        resData?.is_correct ??
        resData?.correct ??
        resData?.passed ??
        false
      );
      const correctAnswer =
        resData?.correct_answer ??
        resData?.answer ??
        undefined;

      setCheckedAnswers((prev) => ({
        ...prev,
        [questionId]: { isCorrect, correctAnswer },
      }));
    } catch {
      // If check-answer fails, record selection without blocking
      setCheckedAnswers((prev) => ({
        ...prev,
        [questionId]: { isCorrect: true },
      }));
    }
  };

  /** Core submit logic */
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
      const payload: SubmitQuizPayload = {
        started_at: startTimeRef.current
          ? new Date(startTimeRef.current).toISOString()
          : new Date().toISOString(),
        answers: answers,
      };
      const response = await submitQuizMutation(payload);
      const resultData = (response as any)?.data
        ? (response as any).data
        : response;

      const elapsedSeconds = calculateElapsedSeconds(startTimeRef.current);
      const finalResult = {
        ...resultData,
        time_taken:
          resultData?.duration_seconds ??
          resultData?.time_taken ??
          elapsedSeconds,
      };

      setQuizResult(finalResult);
      setSubmissionState("submitted");
      clearTimer();

      // Invalidate history query immediately so the attempts page is up-to-date
      queryClient.invalidateQueries({ queryKey: quizQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["quiz"] });
      queryClient.refetchQueries({ queryKey: ["quiz", "history"] });
    } catch (err) {
      console.error("[Quiz Submit Error]:", err);
      setSubmissionState("idle");
      isSubmittingRef.current = false;
    }
  };

  /** Called by QuizTimer when the 90-second question timer runs out */
  const handleQuestionTimerExpire = () => {
    if (submissionState !== "idle") return;
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    setTimeout(() => {
      isAdvancingRef.current = false;
    }, 600);

    setValidationError(null);
    setCurrentIdx((curr) => {
      if (curr < totalQuestions - 1) {
        return curr + 1;
      } else {
        performSubmit(selectedAnswers);
        return curr;
      }
    });
  };

  /** Move to next question */
  const handleNext = () => {
    if (!currentQuestion) return;
    const selectedAnswer = selectedAnswers[currentQuestion.id];

    // Validate: must have an answer
    if (!selectedAnswer) {
      setValidationError("يرجى اختيار إجابة للمتابعة");
      return;
    }
    setValidationError(null);

    // Advance
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
        storyTitle={storyTitle || quiz?.story_title}
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
        <div className="mb-3 select-none">
          <AutoBreadcrumbs
            rootIcon={null}
            dynamicLabels={{
              [storyId]: storyTitle || quiz.story_title || "القصة",
              quiz: "اختبار القصة",
            }}
          />
        </div>

        {/* Header Title & Level Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1E1B4B]">
            اختبار: {storyTitle || quiz.story_title || "القصة"}
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
          {/* 1. RIGHT COLUMN (in RTL, 1st child is on the RIGHT) — Character Illustration */}
          <aside className="lg:col-span-3 hidden lg:flex flex-col items-center justify-center pt-2">
            {/* 3D Character Illustration (Enlarged) */}
            <div className="relative w-full flex justify-center items-center">
              <Image
                src="/iamges/q-boyThinking.png"
                alt="فكر جيدا"
                width={360}
                height={500}
                className="object-contain w-full max-w-[320px] xl:max-w-[360px] max-h-[460px] xl:max-h-[520px] drop-shadow-xl transition-all duration-300"
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

            {/* Timer Card (Per-question timer: 90 seconds = 1.5 mins) */}
            <div className="bg-white rounded-[24px] p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center">
              <QuizTimer
                questionId={currentQuestion?.id || String(currentIdx)}
                durationSeconds={90}
                onExpire={handleQuestionTimerExpire}
              />
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
