"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { contactFormSchema, type ContactFormValues } from "../contactSchema";
import type { ContactFormData } from "../types";

interface ContactFormCardProps {
  onSubmit?: (data: ContactFormData) => Promise<void> | void;
}

export const ContactFormCard: React.FC<ContactFormCardProps> = ({ onSubmit }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      message: "",
    },
  });

  const handleFormSubmit = async (data: ContactFormValues) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setIsSuccess(true);
      toast.success("تم إرسال رسالتكم بنجاح! سنقوم بالتواصل معكم قريباً.");
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch {
      toast.error("حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="bg-mad-white-50 border border-mad-white-200 rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 lg:p-8 lg:h-[470px] flex flex-col justify-center shadow-xs transition-all duration-300 hover:shadow-md">
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
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 sm:space-y-5 lg:space-y-4 flex flex-col justify-between h-full"
          noValidate
        >
          {/* Field 1: Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-right text-mad-text-primary font-bold mad-label-1 mb-1.5 sm:mb-2"
            >
              الاسم الكامل
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="يرجى كتابة اسمكم الكريم هنا"
              {...register("fullName")}
              className={`w-full h-10 lg:h-12 px-4 sm:px-5 rounded-xl sm:rounded-2xl border text-right text-mad-text-primary mad-body-2 bg-mad-white-50 transition-all duration-200 focus:outline-none placeholder:text-mad-white-400 ${
                errors.fullName
                  ? "border-mad-danger focus:border-mad-danger focus:ring-4 focus:ring-mad-danger-light"
                  : "border-mad-white-200 focus:border-mad-main focus:ring-4 focus:ring-mad-main/10"
              }`}
            />
            {errors.fullName && (
              <p className="text-mad-danger mad-label-3 mt-1 text-right font-medium">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Field 2: Email */}
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
              placeholder="مثال: user@website.com"
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

          {/* Field 3: Message */}
          <div className="flex-1 flex flex-col justify-start">
            <label
              htmlFor="message"
              className="block text-right text-mad-text-primary font-bold mad-label-1 mb-1.5 sm:mb-2"
            >
              رسالتكم
            </label>
            <textarea
              id="message"
              rows={3}
              placeholder="كيف يمكننا مساعدتكم في تطوير شغف القراءة لطفلكم؟"
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
              disabled={isSubmitting}
              className="bg-mad-purple-600 hover:bg-mad-purple-700 disabled:bg-mad-purple-300 text-mad-white-50 font-bold mad-label-1 px-9 lg:px-10 h-10 lg:h-12 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
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
