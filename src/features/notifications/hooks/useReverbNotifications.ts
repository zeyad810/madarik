"use client";

import React, { useEffect, useRef } from "react";
import Pusher, { Channel } from "pusher-js";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/services/api";
import { getStoredAuthToken } from "@/lib/auth";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { notificationQueryKeys } from "../constants";
import { useResolvedChildId } from "./useNotifications";

export interface ReverbNotificationPayload {
  type?: string;
  title?: string;
  message?: string;
  created_at?: string;
  [key: string]: unknown;
}

export function useReverbNotifications() {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const {
    userRole,
    activeChild,
    activeAccountId,
    isChild,
    isStudent,
    isAuthenticated,
  } = useActiveAccount();

  const childId = useResolvedChildId();
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<Channel | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = getStoredAuthToken(session);

    if (status !== "authenticated" || !token) {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
      return;
    }

    // Determine channelType & targetId
    // parent/free => 'account' in channel
    // child/student => 'child' or 'student'
    let channelType = "account";
    let targetId = session?.user?.id ? String(session.user.id) : "";

    if (activeChild?.id || (activeAccountId && activeAccountId !== "parent")) {
      channelType = "child";
      targetId = String(activeChild?.id || activeAccountId);
    } else if (isChild) {
      channelType = "child";
      targetId = String(session?.user?.id || "");
    } else if (isStudent) {
      channelType = "student";
      targetId = String(session?.user?.id || "");
    } else {
      const normalizedRole = (userRole || "").toLowerCase();
      if (normalizedRole === "parent" || normalizedRole === "free" || normalizedRole === "free_customer") {
        channelType = "account";
      } else if (normalizedRole === "child") {
        channelType = "child";
      } else if (normalizedRole === "student") {
        channelType = "student";
      } else {
        channelType = "account";
      }
      targetId = String(session?.user?.id || "");
    }

    if (!targetId) return;

    const channelName = `private-notifications.${channelType}.${targetId}`;

    const appKey =
      process.env.NEXT_PUBLIC_REVERB_APP_KEY ||
      process.env.VITE_REVERB_APP_KEY ||
      "fj0peszjbw2tdvqvncts";
    const host =
      process.env.NEXT_PUBLIC_REVERB_HOST ||
      process.env.VITE_REVERB_HOST ||
      "api.madarik.com";
    const port = Number(
      process.env.NEXT_PUBLIC_REVERB_PORT ||
        process.env.VITE_REVERB_PORT ||
        8080
    );
    const forceTLS =
      process.env.NEXT_PUBLIC_REVERB_SCHEME === "https" || port === 443;

    const authEndpoint = `${API_BASE_URL.replace(/\/+$/, "")}/broadcasting/auth`;

    try {
      const pusher = new Pusher(appKey, {
        wsHost: host,
        wsPort: port,
        wssPort: port,
        forceTLS,
        enabledTransports: ["ws", "wss"],
        cluster: "mt1",
        disableStats: true,
        channelAuthorization: {
          transport: "ajax",
          endpoint: authEndpoint,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      });

      pusherRef.current = pusher;
      const channel = pusher.subscribe(channelName);
      channelRef.current = channel;

      channel.bind("notification.created", (payload: ReverbNotificationPayload) => {
        console.log("إشعار جديد (Reverb):", payload);

        // 1. Invalidate and refetch notifications in real-time!
        queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
        queryClient.refetchQueries({
          queryKey: notificationQueryKeys.unreadCount(childId),
        });
        queryClient.refetchQueries({
          queryKey: notificationQueryKeys.list(childId),
        });

        // 2. Show toast alert immediately
        const title = payload?.title || "إشعار جديد";
        const message = payload?.message || "";

        toast(
          (t) =>
            React.createElement(
              "div",
              {
                className: "flex flex-col gap-1 cursor-pointer select-none text-right",
                dir: "rtl",
                onClick: () => toast.dismiss(t.id),
              },
              React.createElement(
                "p",
                { className: "font-bold text-sm text-gray-900 leading-snug" },
                title
              ),
              message
                ? React.createElement(
                    "p",
                    { className: "text-xs text-gray-600 line-clamp-2 leading-relaxed" },
                    message
                  )
                : null
            ),
          {
            icon: "🔔",
            duration: 6000,
            position: "top-left",
          }
        );
      });
    } catch (err) {
      console.error("Error setting up Reverb Pusher client:", err);
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
        channelRef.current = null;
      }
      if (pusherRef.current) {
        pusherRef.current.unsubscribe(channelName);
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
    };
  }, [
    session,
    status,
    isAuthenticated,
    userRole,
    activeChild?.id,
    activeAccountId,
    isChild,
    isStudent,
    childId,
    queryClient,
  ]);
}
