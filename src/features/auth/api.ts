import { API_BASE_URL, handleResponse } from "@/services/api";
import {
  RegisterPayload,
  RegisterResponse,
  VerifyRegisterPayload,
  VerifyRegisterResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
} from "@/types/auth";
import { getStoredAuthToken } from "@/lib/auth";

export const forgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      phone: payload.phone ? payload.phone.trim() : "",
    }),
  });

  return await handleResponse<ForgotPasswordResponse>(response);
};

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> => {
  const code = payload.code || (payload as any).otp || "";
  const phone = payload.phone ? payload.phone.trim() : "";
  const password = payload.password || payload.new_password || "";
  const password_confirmation =
    payload.password_confirmation ||
    payload.confirm_password ||
    payload.new_password_confirmation ||
    password;

  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      phone,
      code,
      password,
      password_confirmation,
    }),
  });

  return await handleResponse<ResetPasswordResponse>(response);
};


export const registerUser = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return await handleResponse<RegisterResponse>(response);
};

export const verifyRegisterOtp = async (
  payload: VerifyRegisterPayload,
): Promise<VerifyRegisterResponse> => {
  const code = payload.code || payload.otp || "";
  const phone = payload.phone ? payload.phone.trim() : "";

  const response = await fetch(`${API_BASE_URL}/auth/register/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      phone,
      code,
      otp: code,
    }),
  });

  return await handleResponse<VerifyRegisterResponse>(response);
};

export const resetFirstPassword = async (
  payload: ResetPasswordPayload,
  token?: string | null,
): Promise<ResetPasswordResponse> => {
  const resolvedToken = token || getStoredAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (resolvedToken) {
    headers["Authorization"] = `Bearer ${resolvedToken}`;
  }

  const newPassword = payload.new_password || payload.password;
  const newPasswordConfirmation =
    payload.new_password_confirmation ||
    payload.password_confirmation ||
    payload.confirm_password ||
    newPassword;

  const response = await fetch(
    `${API_BASE_URL}/auth/reset-generated-password`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      }),
    },
  );

  return await handleResponse<ResetPasswordResponse>(response);
};
