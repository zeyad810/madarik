"use client";

// ────────────────────────────────────────────────────────────────────────────
// QuizView — Main quiz orchestrator client component.
// Owns all quiz state: selected answers, check results, current question,
// submission state. Composes clean modular child components.
// ────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import QuizLoading from "@/app/(site)/stories/[id]/quiz/loading";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { useQuiz } from "../hooks/useQuiz";
import { useCheckQuizAnswer } from "../hooks/useCheckQuizAnswer";
import { useSubmitQuiz } from "../hooks/useSubmitQuiz";
import { useQuizTimerStore } from "../store/useQuizTimerStore";
import { quizQueryKeys } from "../constants";

import { QuizHeader } from "./QuizHeader";
import { QuizMetricsCards } from "./QuizMetricsCards";
import { QuizSidebar } from "./QuizSidebar";
import { QuizProgress } from "./QuizProgress";
import { QuizQuestion } from "./QuizQuestion";
import { QuizNavigationButtons } from "./QuizNavigationButtons";
import { QuizErrorView } from "./QuizErrorView";
import { QuizResult } from "./QuizResult";

import {
  getCurrentTimestamp,
  calculateElapsedSeconds,
} from "../utils";
import type {
  SelectedAnswersMap,
  CheckedAnswersMap,
  SubmissionState,
  QuizResultData,
  SubmitQuizPayload,
} from "../types";

interface QuizViewProps {
  quizId: string;
  storyId: string;
  storyTitle?: string;
  storyLevel?: any;
}

export const QuizView: React.FC<QuizViewProps> = ({
  quizId,
  storyId,
  storyTitle,
  storyLevel,
}) => {
  const { userRole, isAuthenticated } = useActiveAccount();
  const role = isAuthenticated ? (userRole || "parent") : "visitor";
  const queryClient = useQueryClient();

  // ── Data ───────────────────────────────────────────────────────────────────
  const { data: quizResponse, isLoading, isPending, isError } = useQuiz(quizId);
  const quiz = quizResponse?.data;

  // ── Quiz State ─────────────────────────────────────────────────────────────
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswersMap>({});
  const [checkedAnswers, setCheckedAnswers] = useState<CheckedAnswersMap>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [quizResult, setQuizResult] = useState<QuizResultData | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const isSubmittingRef = useRef(false);
  const isAdvancingRef = useRef(false);
  const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // ── Timer store ────────────────────────────────────────────────────────────
  const { quizId: storedQuizId, startTime: storedStartTime, setTimer, clearTimer } = useQuizTimerStore();
  const [startTime, setStartTime] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Initialize start time on mount & cleanup timer on unmount
  useEffect(() => {
    let currentStart = startTimeRef.current;
    if (currentStart === null) {
      if (storedQuizId === quizId && storedStartTime) {
        currentStart = storedStartTime;
      } else {
        currentStart = getCurrentTimestamp();
        setTimer(quizId, currentStart);
      }
      startTimeRef.current = currentStart;
      setStartTime(currentStart);
    }
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, [quizId, storedQuizId, storedStartTime, setTimer]);

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

  /** Called when user selects an option - records choice without checking yet */
  const handleSelectAnswer = (questionId: string, optionValue: string) => {
    if (checkedAnswers[questionId] || isAdvancing) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionValue }));
    setValidationError(null);
  };

  /** Core submit logic */
  const performSubmit = async (answers: SelectedAnswersMap) => {
    const answerEntries = Object.entries(answers);
    if (answerEntries.length === 0) {
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
      const finalTime =
        typeof resultData?.duration_seconds === "number" && resultData.duration_seconds > 0
          ? resultData.duration_seconds
          : typeof resultData?.time_taken === "number" && resultData.time_taken > 0
          ? resultData.time_taken
          : elapsedSeconds;

      const finalResult = {
        ...resultData,
        time_taken: finalTime,
        duration_seconds: finalTime,
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



  /** Move to next question: checks answer first, displays feedback (صح/خطأ), then advances */
  const handleNext = async () => {
    if (!currentQuestion) return;
    if (isAdvancing || isChecking) return;

    const selectedAnswer = selectedAnswers[currentQuestion.id];

    if (!selectedAnswer) {
      setValidationError("يرجى اختيار إجابة للمتابعة");
      return;
    }
    setValidationError(null);

    // If already checked previously, advance immediately
    if (checkedAnswers[currentQuestion.id]) {
      if (currentIdx < totalQuestions - 1) {
        setCurrentIdx((prev) => prev + 1);
      }
      return;
    }

    setIsAdvancing(true);

    try {
      const response = await checkAnswer({
        question_id: currentQuestion.id,
        answer: selectedAnswer,
      });

      const resData = response?.data || response;
      const checkRecord = resData as unknown as Record<string, unknown>;
      const isCorrect = Boolean(
        checkRecord?.is_correct ??
        checkRecord?.correct ??
        checkRecord?.passed ??
        false
      );
      const correctAnswer =
        (checkRecord?.correct_answer as string | undefined) ??
        (checkRecord?.answer as string | undefined) ??
        undefined;

      setCheckedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: { isCorrect, correctAnswer },
      }));
    } catch {
      setCheckedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: { isCorrect: true },
      }));
    }

    // Give user brief time to see feedback (صح أو خطأ) then transition
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    advanceTimeoutRef.current = setTimeout(() => {
      if (currentIdx < totalQuestions - 1) {
        setCurrentIdx((prev) => prev + 1);
      }
      setIsAdvancing(false);
    }, 850);
  };

  const handlePrev = () => {
    if (isAdvancing || isChecking) return;
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setValidationError(null);
    }
  };

  const handleFinish = async () => {
    if (!currentQuestion) return;
    if (isSubmittingRef.current || isAdvancing || isChecking) return;

    const selectedAnswer = selectedAnswers[currentQuestion.id];

    if (!selectedAnswer) {
      setValidationError("يرجى الإجابة على جميع الأسئلة للمتابعة");
      return;
    }
    setValidationError(null);

    setIsAdvancing(true);

    if (!checkedAnswers[currentQuestion.id]) {
      try {
        const response = await checkAnswer({
          question_id: currentQuestion.id,
          answer: selectedAnswer,
        });

        const resData = response?.data || response;
        const checkRecord = resData as unknown as Record<string, unknown>;
        const isCorrect = Boolean(
          checkRecord?.is_correct ??
          checkRecord?.correct ??
          checkRecord?.passed ??
          false
        );
        const correctAnswer =
          (checkRecord?.correct_answer as string | undefined) ??
          (checkRecord?.answer as string | undefined) ??
          undefined;

        setCheckedAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: { isCorrect, correctAnswer },
        }));
      } catch {
        setCheckedAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: { isCorrect: true },
        }));
      }
    }

    const updatedAnswers = {
      ...selectedAnswers,
      [currentQuestion.id]: selectedAnswer,
    };

    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    advanceTimeoutRef.current = setTimeout(async () => {
      setIsAdvancing(false);
      await performSubmit(updatedAnswers);
    }, 850);
  };

  const handleRetry = () => {
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    setIsAdvancing(false);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setCheckedAnswers({});
    setSubmissionState("idle");
    setQuizResult(null);
    setValidationError(null);
    isSubmittingRef.current = false;
    const now = getCurrentTimestamp();
    startTimeRef.current = now;
    setStartTime(now);
    setTimer(quizId, now);
  };

  const isLastQuestion = currentIdx === totalQuestions - 1;
  const isNavigating = isChecking || isAdvancing || submissionState === "submitting";

  // ── States: Loading & Submitting ──────────────────────────────────────────
  if (isLoading || isPending || submissionState === "submitting" || (!quiz && !isError)) {
    return <QuizLoading />;
  }

  // ── States: Error ──────────────────────────────────────────────────────────
  if (isError || !quiz) {
    return <QuizErrorView storyId={storyId} type="error" />;
  }
  if (totalQuestions === 0) {
    return <QuizErrorView storyId={storyId} type="empty" />;
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
      {/* 1. Top Header & Breadcrumbs */}
      <QuizHeader
        storyId={storyId}
        storyTitle={storyTitle}
        quizStoryTitle={quiz.story_title}
        storyLevel={storyLevel}
        quizLevel={(quiz as any)?.level}
        currentQuestionType={currentQuestion?.type}
        currentQuestionOptions={currentQuestion?.options}
      />

      {/* 2. Main Content (RTL) */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Character Illustration (Desktop only) */}
          <aside className="lg:col-span-3 hidden lg:flex flex-col items-center justify-center pt-2">
            <div className="relative w-full flex justify-center items-center">
              <Image
                src="/iamges/q-boyThinking.png"
                alt="فكر جيدا"
                width={360}
                height={500}
                style={{ width: "auto", height: "auto" }}
                className="object-contain w-full max-w-75 xl:max-w-85 max-h-115 drop-shadow-xl transition-all duration-300"
                priority
              />
            </div>
          </aside>

          {/* Center Column — Quiz Experience */}
          <section className="lg:col-span-6 flex flex-col items-center w-full max-w-2xl mx-auto">
            {/* Metric Cards (Exit button + Time & Points) */}
            <QuizMetricsCards
              storyId={storyId}
              questionId={currentQuestion?.id || String(currentIdx)}
              currentPoints={currentPoints}
              startTime={startTime}
            />

            {/* Stepper Timeline */}
            <div className="w-full mb-5">
              <QuizProgress
                total={totalQuestions}
                current={currentIdx}
                checkedAnswers={checkedBoolMap}
                questionIds={questions.map((q) => q.id)}
              />
            </div>

            {/* Main Question Card */}
            <div className="w-full bg-white rounded-3xl p-5 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-5">
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
                      isChecking={isChecking || isAdvancing}
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
                    className="text-right text-xs sm:text-sm font-bold text-[#DC2626] bg-red-50 rounded-xl py-2.5 px-4 border border-red-100"
                  >
                    {validationError}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Navigation Buttons */}
            <QuizNavigationButtons
              isLastQuestion={isLastQuestion}
              isNavigating={isNavigating}
              currentIdx={currentIdx}
              onNext={handleNext}
              onPrev={handlePrev}
              onFinish={handleFinish}
            />
          </section>

          {/* 3. LEFT COLUMN — Sidebar on Desktop */}
          <QuizSidebar
            storyId={storyId}
            questionId={currentQuestion?.id || String(currentIdx)}
            currentPoints={currentPoints}
            startTime={startTime}
          />
        </div>
      </main>
    </div>
  );
};

export default QuizView;
