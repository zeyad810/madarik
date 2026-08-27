"use client";

import React, { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/services/api";
import { getStoredAuthToken } from "@/lib/auth";
import { useNotificationStore } from "../store";
import { NotificationItem, NotificationStreamPayload } from "../types";

export function useNotificationStream() {
  const { data: session, status } = useSession();
  const { addNotification, setConnected } = useNotificationStore();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Clear any existing reconnect timer
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    const token = getStoredAuthToken(session) || session?.accessToken || session?.token;

    // Disconnect if unauthenticated or no token
    if (status !== "authenticated" || !token) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        setConnected(false);
      }
      return;
    }

    let isSubscribed = true;

    const connectSSE = () => {
      if (!isSubscribed) return;

      try {
        const cleanBaseUrl = API_BASE_URL.replace(/\/+$/, "");
        const streamUrl = `${cleanBaseUrl}/notifications/stream?token=${encodeURIComponent(token)}`;

        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        const eventSource = new EventSource(streamUrl);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          if (!isSubscribed) return;
          setConnected(true);
        };

        eventSource.onmessage = (event) => {
          if (!isSubscribed || !event.data) return;

          try {
            const data: NotificationStreamPayload = JSON.parse(event.data);

            // Ignore ping/heartbeat keep-alives
            if (
              data.type === "ping" ||
              data.type === "heartbeat" ||
              (typeof data === "string" && data === "ping")
            ) {
              return;
            }

            const rawItem = data.notification || data;
            const notificationId =
              rawItem.id || `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
            const title = rawItem.title || "إشعار جديد";
            const message = rawItem.message || rawItem.body || "";
            const link = rawItem.link || (rawItem.data?.link as string | undefined);
            const type = rawItem.type || "info";
            const createdAt = rawItem.created_at || new Date().toISOString();

            const newNotification: NotificationItem = {
              id: notificationId,
              title,
              message,
              type,
              link,
              is_read: false,
              created_at: createdAt,
              data: rawItem.data,
            };

            addNotification(newNotification);

            // Display Toast notification
            toast(
              (t) => (
                <div
                  className="flex flex-col gap-1 cursor-pointer select-none text-right"
                  dir="rtl"
                  onClick={() => {
                    toast.dismiss(t.id);
                    if (link) {
                      window.location.href = link;
                    }
                  }}
                >
                  <p className="font-bold text-sm text-gray-900 leading-snug">{title}</p>
                  {message ? (
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {message}
                    </p>
                  ) : null}
                  {link ? (
                    <span className="text-[11px] text-purple-600 font-semibold underline mt-0.5">
                      اضغط للتفاصيل
                    </span>
                  ) : null}
                </div>
              ),
              {
                icon: "🔔",
                duration: 6000,
                position: "top-left",
              }
            );
          } catch (err) {
            console.error("Error parsing SSE notification payload:", err);
          }
        };

        eventSource.onerror = () => {
          if (!isSubscribed) return;
          setConnected(false);

          // EventSource automatically tries to reconnect, but if it closes we schedule a retry
          if (eventSource.readyState === EventSource.CLOSED) {
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = setTimeout(() => {
              if (isSubscribed && status === "authenticated") {
                connectSSE();
              }
            }, 8000);
          }
        };
      } catch (err) {
        console.error("Failed to initialize SSE connection:", err);
      }
    };

    connectSSE();

    return () => {
      isSubscribed = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setConnected(false);
    };
  }, [status, session, addNotification, setConnected]);
}
