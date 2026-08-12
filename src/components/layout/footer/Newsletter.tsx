"use client";

import React, { useState } from "react";
import { ArrowUpLeft, Check, Loader2 } from "lucide-react";
import { NewsletterData } from "./types";
import { DEFAULT_NEWSLETTER } from "./constants";

interface NewsletterProps {
  data?: NewsletterData;
  onSubscribe?: (email: string) => Promise<void> | void;
}

const Newsletter: React.FC<NewsletterProps> = ({
  data = DEFAULT_NEWSLETTER,
  onSubscribe,
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    try {
      setStatus("loading");
      if (onSubscribe) {
        await onSubscribe(email);
      } else {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="w-full text-center">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
        {data.title}
      </h2>

      {/* Description */}
      <p className="text-sm sm:text-base text-white/90 font-medium max-w-xl mx-auto mt-2 sm:mt-3 leading-relaxed">
        {data.description}
      </p>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="relative max-w-md mx-auto mt-6 sm:mt-8 flex items-center gap-3"
      >
        <div className="relative flex-1">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={data.placeholder || "البريد الإلكتروني"}
            className="w-full rounded-full bg-white px-6 py-3.5 sm:py-4 text-right text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl transition-all"
          />
        </div>

        {/* Submit Button (White Circle with Arrow Up Left) */}
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="اشترك في النشرة البريدية"
          className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-full bg-white text-mad-main shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-70 cursor-pointer"
        >
          {status === "loading" ? (
            <Loader2 className="size-5 animate-spin text-mad-main" />
          ) : status === "success" ? (
            <Check className="size-5 text-green-600" strokeWidth={3} />
          ) : (
            <ArrowUpLeft className="size-5 sm:size-6 text-mad-main" strokeWidth={2.5} />
          )}
        </button>
      </form>

      {/* Status Messages */}
      {status === "success" && (
        <p className="text-xs sm:text-sm font-semibold text-green-200 mt-3 animate-in fade-in">
          تم الاشتراك بنجاح! شكراً لك.
        </p>
      )}
      {status === "error" && (
        <p className="text-xs sm:text-sm font-semibold text-red-200 mt-3 animate-in fade-in">
          حدث خطأ، يرجى المحاولة مرة أخرى.
        </p>
      )}
    </div>
  );
};

export default Newsletter;
