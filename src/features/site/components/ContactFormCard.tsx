"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { contactFormSchema, type ContactFormValues } from "../contactSchema";
import { useSendContactMessage } from "../hooks/useSendContactMessage";
import type { ContactFormData } from "../types";

interface ContactFormCardProps {
  onSubmit?: (data: ContactFormData) => Promise<void> | void;
}

export const ContactFormCard: React.FC<ContactFormCardProps> = ({ onSubmit }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const sendContactMutation = useSendContactMessage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const isLoading = isSubmitting || sendContactMutation.isPending;

  const handleFormSubmit = async (data: ContactFormValues) => {
    try {
      const payload = {
        name: data.name.trim(),
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        message: data.message.trim(),
      };

      if (onSubmit) {
        await onSubmit({
          name: payload.name,
          email: payload.email || undefined,
          phone: payload.phone || undefined,
          message: payload.message,
        });
      } else {
        const response = await sendContactMutation.mutateAsync(payload);
        const successMessage =
          response?.message || "تم إرسال رسالتكم بنجاح! سنقوم بالتواصل معكم قريباً.";
        toast.success(successMessage);
      }

      setIsSuccess(true);
      reset();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة مرة أخرى.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-mad-white-50 border border-mad-white-200 rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 min-h-[470px] flex flex-col justify-center shadow-xs transition-all duration-300 hover:shadow-md">
      {isSuccess ? (
        <div className="py-12 px-4 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-mad-green-light text-mad-green flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="mad-h5 font-bold text-mad-text-primary">
            تم إرسال رسالتكم بنجاح!
          </h3>
          <p className="mad-body-3 text-mad-text-secondary max-w-md">
            شكراً لتواصلكم معنا. سيعاود فريقنا التواصل معكم في أقرب وقت ممكن.
          </p>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="mt-4 text-mad-purple-600 hover:text-mad-purple-700 font-bold mad-label-2 underline cursor-pointer"
          >
            إرسال رسالة أخرى
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 sm:space-y-4 flex flex-col justify-between h-full"
          noValidate
        >
          {/* Field 1: Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-right text-mad-text-primary font-bold mad-label-1 mb-1.5 sm:mb-2"
            >
              الاسم الكامل <span className="text-mad-danger">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="يرجى كتابة اسمكم الكريم هنا"
              {...register("name")}
              className={`w-full h-10 lg:h-12 px-4 sm:px-5 rounded-xl sm:rounded-2xl border text-right text-mad-text-primary mad-body-2 bg-mad-white-50 transition-all duration-200 focus:outline-none placeholder:text-mad-white-400 ${
                errors.name
                  ? "border-mad-danger focus:border-mad-danger focus:ring-4 focus:ring-mad-danger-light"
                  : "border-mad-white-200 focus:border-mad-main focus:ring-4 focus:ring-mad-main/10"
              }`}
            />
            {errors.name && (
              <p className="text-mad-danger mad-label-3 mt-1 text-right font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Fields 2 & 3: Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-right text-mad-text-primary font-bold mad-label-1 mb-1.5 sm:mb-2"
              >
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                dir="ltr"
                placeholder="user@website.com"
                {...register("email")}
                className={`w-full h-10 lg:h-12 px-4 sm:px-5 rounded-xl sm:rounded-2xl border text-right text-mad-text-primary mad-body-2 bg-mad-white-50 transition-all duration-200 focus:outline-none placeholder:text-mad-white-400 ${
                  errors.email
                    ? "border-mad-danger focus:border-mad-danger focus:ring-4 focus:ring-mad-danger-light"
                    : "border-mad-white-200 focus:border-mad-main focus:ring-4 focus:ring-mad-main/10"
                }`}
              />
              {errors.email && (
                <p className="text-mad-danger mad-label-3 mt-1 text-right font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-right text-mad-text-primary font-bold mad-label-1 mb-1.5 sm:mb-2"
              >
                رقم الهاتف
              </label>
              <input
                id="phone"
                type="tel"
                dir="ltr"
                placeholder="05xxxxxxxx"
                {...register("phone")}
                className={`w-full h-10 lg:h-12 px-4 sm:px-5 rounded-xl sm:rounded-2xl border text-right text-mad-text-primary mad-body-2 bg-mad-white-50 transition-all duration-200 focus:outline-none placeholder:text-mad-white-400 ${
                  errors.phone
                    ? "border-mad-danger focus:border-mad-danger focus:ring-4 focus:ring-mad-danger-light"
                    : "border-mad-white-200 focus:border-mad-main focus:ring-4 focus:ring-mad-main/10"
                }`}
              />
              {errors.phone && (
                <p className="text-mad-danger mad-label-3 mt-1 text-right font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Field 4: Message */}
          <div className="flex-1 flex flex-col justify-start">
            <label
              htmlFor="message"
              className="block text-right text-mad-text-primary font-bold mad-label-1 mb-1.5 sm:mb-2"
            >
              رسالتكم <span className="text-mad-danger">*</span>
            </label>
            <textarea
              id="message"
              rows={3}
              placeholder="كيف يمكننا مساعدتكم؟ (10 أحرف على الأقل)"
              {...register("message")}
              className={`w-full flex-1 min-h-[90px] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-right text-mad-text-primary mad-body-2 bg-mad-white-50 transition-all duration-200 focus:outline-none placeholder:text-mad-white-400 resize-none ${
                errors.message
                  ? "border-mad-danger focus:border-mad-danger focus:ring-4 focus:ring-mad-danger-light"
                  : "border-mad-white-200 focus:border-mad-main focus:ring-4 focus:ring-mad-main/10"
              }`}
            />
            {errors.message && (
              <p className="text-mad-danger mad-label-3 mt-1 text-right font-medium">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-start pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-mad-purple-600 hover:bg-mad-purple-700 disabled:bg-mad-purple-300 text-mad-white-50 font-bold mad-label-1 px-9 lg:px-10 h-10 lg:h-12 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <span>إرسال الرسالة الآن</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

