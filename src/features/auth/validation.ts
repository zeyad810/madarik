import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { AUTH_TEXTS } from "./constants";

export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, { message: AUTH_TEXTS.validation.phoneRequired })
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "رقم الهاتف غير صحيح للدولة المحددة",
    }),
  password: z
    .string()
    .min(1, { message: AUTH_TEXTS.validation.passwordRequired })
    .min(6, { message: AUTH_TEXTS.validation.passwordMinLength }),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: AUTH_TEXTS.validation.otpInvalid }),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: AUTH_TEXTS.validation.usernameRequired }),
    phone: z
      .string()
      .min(1, { message: AUTH_TEXTS.validation.phoneRequired })
      .refine((val) => !val || isValidPhoneNumber(val), {
        message: "رقم الهاتف غير صحيح للدولة المحددة",
      }),
    password: z
      .string()
      .min(1, { message: AUTH_TEXTS.validation.passwordRequired })
      .min(6, { message: AUTH_TEXTS.validation.passwordMinLength }),
    confirmPassword: z
      .string()
      .min(1, { message: AUTH_TEXTS.validation.passwordRequired }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_TEXTS.validation.passwordMatch,
    path: ["confirmPassword"],
  });

export const resetFirstPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: AUTH_TEXTS.validation.passwordRequired })
      .min(6, { message: AUTH_TEXTS.validation.passwordMinLength }),
    confirmPassword: z
      .string()
      .min(1, { message: AUTH_TEXTS.validation.passwordRequired }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_TEXTS.validation.passwordMatch,
    path: ["confirmPassword"],
  });

export const forgotPasswordPhoneSchema = z.object({
  phone: z
    .string()
    .min(1, { message: AUTH_TEXTS.validation.phoneRequired })
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "رقم الهاتف غير صحيح للدولة المحددة",
    }),
});

export const resetPasswordConfirmSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: AUTH_TEXTS.validation.passwordRequired })
      .min(6, { message: AUTH_TEXTS.validation.passwordMinLength }),
    confirmPassword: z
      .string()
      .min(1, { message: AUTH_TEXTS.validation.passwordRequired }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_TEXTS.validation.passwordMatch,
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetFirstPasswordFormData = z.infer<typeof resetFirstPasswordSchema>;
export type ForgotPasswordPhoneFormData = z.infer<typeof forgotPasswordPhoneSchema>;
export type ResetPasswordConfirmFormData = z.infer<typeof resetPasswordConfirmSchema>;

