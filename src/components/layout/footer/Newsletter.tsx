"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpLeft, Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { DEFAULT_NEWSLETTER } from "./constants";
import { NewsletterData } from "./types";
import {
  newsletterSchema,
  type NewsletterFormValues,
  useSubscribeNewsletter,
} from "@/features/site";

interface NewsletterProps {
  id?: string;
  data?: NewsletterData;
  onSubscribe?: (email: string) => Promise<void> | void;
}

const Newsletter: React.FC<NewsletterProps> = ({
  id = "newsletter",
  data,
  onSubscribe,
}) => {
  const title = data?.title ?? DEFAULT_NEWSLETTER.title;
  const description = data?.description ?? DEFAULT_NEWSLETTER.description;
  const placeholder = data?.placeholder ?? DEFAULT_NEWSLETTER.placeholder;

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const subscribeMutation = useSubscribeNewsletter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const isLoading = isSubmitting || subscribeMutation.isPending || status === "loading";

  // Auto-reset success state back to idle after 5 seconds
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        setStatus("idle");
        setServerMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const onSubmitHandler = async (values: NewsletterFormValues) => {
    setStatus("loading");
    setServerMessage(null);

    try {
      const trimmedEmail = values.email.trim();
      if (onSubscribe) {
        await onSubscribe(trimmedEmail);
        const successMsg = "تم الاشتراك في النشرة البريدية بنجاح";
        setStatus("success");
        setServerMessage(successMsg);
        toast.success(successMsg);
      } else {
        const response = await subscribeMutation.mutateAsync({ email: trimmedEmail });
        const successMsg = response?.message || "تم الاشتراك في النشرة البريدية بنجاح";
        setStatus("success");
        setServerMessage(successMsg);
        toast.success(successMsg);
      }
      reset();
    } catch (error: unknown) {
      setStatus("error");
      const errorMsg =
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء الاشتراك، يرجى المحاولة لاحقاً.";
      setServerMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div id={id} className="w-full text-center">
      {/* Title */}
      <h2 className="text-xl sm:text-5xl font-extrabold text-white leading-tight">
        {title}
      </h2>

      {/* Description */}
      <p className="text-sm sm:text-base text-white/90 font-medium max-w-xl mx-auto mt-2 sm:mt-3 leading-relaxed">
        {description}
      </p>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        noValidate
        className="relative max-w-md mx-auto mt-6 sm:mt-8 flex items-center gap-3"
      >
        <div className="relative flex-1">
          <input
            {...register("email", {
              onChange: () => {
                if (status !== "idle") {
                  setStatus("idle");
                  setServerMessage(null);
                }
              },
            })}
            type="email"
            autoComplete="email"
            disabled={isLoading}
            placeholder={placeholder}
            aria-label={placeholder}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email
                ? "newsletter-email-error"
                : serverMessage
                ? "newsletter-server-error"
                : undefined
            }
            className={`w-full rounded-full bg-white px-6 py-3.5 sm:py-4 text-right text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed ${
              errors.email
                ? "border-2 border-red-400 focus:ring-red-400/50"
                : "focus:ring-white/50"
            }`}
          />
        </div>

        {/* Submit Button (White Circle with Arrow Up Left) */}
        <button
          type="submit"
          disabled={isLoading}
          aria-label="اشترك في النشرة البريدية"
          className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-full bg-white text-mad-main shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="size-5 animate-spin text-mad-main" />
          ) : status === "success" ? (
            <Check className="size-5 text-green-600" strokeWidth={3} />
          ) : (
            <ArrowUpLeft className="size-5 sm:size-6 text-mad-main" strokeWidth={2.5} />
          )}
        </button>
      </form>

      {/* Status & Validation Messages */}
      {errors.email?.message && (
        <p
          id="newsletter-email-error"
          className="text-xs sm:text-sm font-semibold text-red-200 mt-2.5 animate-in fade-in"
        >
          {errors.email.message}
        </p>
      )}

      {status === "error" && !errors.email && serverMessage && (
        <p
          id="newsletter-server-error"
          className="text-xs sm:text-sm font-semibold text-red-200 mt-2.5 animate-in fade-in"
        >
          {serverMessage}
        </p>
      )}

      {status === "success" && (
        <p
          id="newsletter-success-message"
          className="text-xs sm:text-sm font-semibold text-green-200 mt-2.5 animate-in fade-in inline-flex items-center gap-1.5"
        >
          <Check className="size-4 text-green-300" strokeWidth={2.5} />
          <span>{serverMessage || "تم الاشتراك بنجاح! شكراً لك."}</span>
        </p>
      )}
    </div>
  );
};

export default Newsletter;
