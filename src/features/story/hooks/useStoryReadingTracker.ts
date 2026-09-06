"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { useStartStory } from "./useStartStory";
import { useFinishStory } from "./useFinishStory";
import { usePauseStory } from "./usePauseStory";
import { useResumeStory } from "./useResumeStory";
import { pauseStory as apiPauseStory } from "../api";
import toast from "react-hot-toast";

interface UseStoryReadingTrackerProps {
  storyId: string;
  currentPage: number;
  idleTimeoutMs?: number; // default: 90000ms (1.5 minutes)
}

type SessionStatus = "unstarted" | "reading" | "paused" | "finished";

export function useStoryReadingTracker({
  storyId,
  currentPage,
  idleTimeoutMs = 90000,
}: UseStoryReadingTrackerProps) {
  const { data: session } = useSession();
  const { isAuthenticated, userRole, activeChild, activeAccountId, isStudent } = useActiveAccount();

  const token = session?.accessToken || session?.token || null;
  const role = isAuthenticated ? (userRole || "visitor") : "visitor";
  const resolvedChildId =
    (activeChild?.id ? activeChild.id : null) ||
    (activeAccountId && activeAccountId !== "parent" ? activeAccountId : null) ||
    (isStudent && session?.user?.id ? session.user.id : null);

  const [isPaused, setIsPaused] = useState(false);

  // Status tracking via ref for synchronous event handling
  const statusRef = useRef<SessionStatus>("unstarted");
  const currentPageRef = useRef(currentPage);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastPauseReasonRef = useRef<"idle" | "visibility" | "navigation" | null>(null);

  // Keep currentPageRef in sync with currentPage state
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Mutations
  const { mutate: mutateStart } = useStartStory(storyId);
  const { mutate: mutatePause } = usePauseStory(storyId);
  const { mutate: mutateResume } = useResumeStory(storyId);
  const {
    mutate: mutateFinish,
    isPending: isFinishing,
    isSuccess: isFinished,
  } = useFinishStory(storyId);

  // ── Core Action: Pause ────────────────────────────────────────────────────────
  const executePause = useCallback(
    (reason: "idle" | "visibility" | "navigation", keepalive: boolean = false) => {
      if (statusRef.current !== "reading") return;

      statusRef.current = "paused";
      lastPauseReasonRef.current = reason;
      setIsPaused(true);

      if (!isAuthenticated && !token) return;

      const payload = {
        ...(isStudent ? { student_id: resolvedChildId } : { child_id: resolvedChildId }),
        current_page: currentPageRef.current,
      };

      if (keepalive) {
        // Use keepalive fetch during unload / navigation so request survives page teardown
        apiPauseStory(storyId, role, payload, token, true).catch((err) =>
          console.warn("[StoryTracker] Keepalive pause error:", err)
        );
      } else {
        mutatePause(payload, {
          onError: (err) => console.warn("[StoryTracker] Pause error:", err),
        });
      }
    },
    [isAuthenticated, token, isStudent, resolvedChildId, storyId, role, mutatePause]
  );

  // ── Core Action: Resume ───────────────────────────────────────────────────────
  const executeResume = useCallback(() => {
    if (statusRef.current !== "paused") return;

    statusRef.current = "reading";
    lastPauseReasonRef.current = null;
    setIsPaused(false);

    if (!isAuthenticated && !token) return;

    const payload = isStudent ? { student_id: resolvedChildId } : { child_id: resolvedChildId };
    mutateResume(payload, {
      onError: (err) => console.warn("[StoryTracker] Resume error:", err),
    });
  }, [isAuthenticated, token, isStudent, resolvedChildId, mutateResume]);

  // ── Idle Timer Management ───────────────────────────────────────────────────
  const resetIdleTimer = useCallback(() => {
    if (statusRef.current === "finished") return;

    // If session was paused due to inactivity, resume it on user activity!
    if (statusRef.current === "paused" && lastPauseReasonRef.current === "idle") {
      executeResume();
    }

    // Clear and restart timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      if (statusRef.current === "reading") {
        executePause("idle");
      }
    }, idleTimeoutMs);
  }, [executePause, executeResume, idleTimeoutMs]);

  // ── Finish Action ────────────────────────────────────────────────────────────
  const finishReading = useCallback(
    (
      onSuccessCallback?: ((msg: string) => void) | unknown,
      onErrorCallback?: ((err: string) => void) | unknown
    ) => {
      const safeOnSuccess = typeof onSuccessCallback === "function" ? onSuccessCallback : undefined;
      const safeOnError = typeof onErrorCallback === "function" ? onErrorCallback : undefined;

      if (!isAuthenticated) {
        toast.error("يرجى تسجيل الدخول لحفظ تقدم القراءة");
        return;
      }

      if (statusRef.current === "finished" || isFinishing || isFinished) return;

      // Mark finished immediately to silence all pause/resume listeners
      statusRef.current = "finished";
      setIsPaused(false);

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      const payload = isStudent ? { student_id: resolvedChildId } : { child_id: resolvedChildId };

      mutateFinish(payload, {
        onSuccess: (res) => {
          const msg = res?.message || "تم تسجيل إنهاء قراءة القصة بنجاح 🎉";
          toast.success(msg);
          if (safeOnSuccess) safeOnSuccess(msg);
        },
        onError: (err: unknown) => {
          statusRef.current = "reading"; // allow retry on error
          const msg = err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل إنهاء القصة";
          toast.error(msg);
          if (safeOnError) safeOnError(msg);
        },
      });
    },
    [isAuthenticated, isFinishing, isFinished, isStudent, resolvedChildId, mutateFinish]
  );

  // ── Lifecycle: Start reading & Event Listeners ──────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    // 1. Start story reading session on mount
    if (statusRef.current === "unstarted") {
      statusRef.current = "reading";
      mutateStart(undefined, {
        onError: (err) => console.warn("[StoryTracker] Start reading error:", err),
      });
    }

    // 2. Start initial idle timer
    resetIdleTimer();

    // 3. Activity event listeners for idle detection
    const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];
    let lastActivityTime = Date.now();

    const handleUserActivity = () => {
      const now = Date.now();
      // Throttle event handling to at most once every 500ms
      if (now - lastActivityTime > 500) {
        lastActivityTime = now;
        resetIdleTimer();
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // 4. Visibility change handler (tab switch / app minimize)
    const handleVisibilityChange = () => {
      if (statusRef.current === "finished") return;

      if (document.visibilityState === "hidden") {
        if (statusRef.current === "reading") {
          executePause("visibility");
        }
      } else if (document.visibilityState === "visible") {
        if (statusRef.current === "paused" && lastPauseReasonRef.current === "visibility") {
          executeResume();
          resetIdleTimer();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 5. Page unload handler (tab close / window close / page navigation)
    const handleBeforeUnload = () => {
      if (statusRef.current === "reading") {
        executePause("navigation", true);
      }
    };

    window.addEventListener("pagehide", handleBeforeUnload);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 6. Cleanup on component unmount
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handleBeforeUnload);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      // If user unmounts without finishing, pause the story and save current page!
      if (statusRef.current === "reading") {
        executePause("navigation", true);
      }
    };
  }, [isAuthenticated, mutateStart, resetIdleTimer, executePause, executeResume]);

  return {
    finishReading,
    isFinishing,
    isFinished,
    isPaused,
  };
}
