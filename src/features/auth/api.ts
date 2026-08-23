import { API_BASE_URL, handleResponse } from "@/services/api";
import {
  RegisterPayload,
  RegisterResponse,
  VerifyRegisterPayload,
  VerifyRegisterResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "@/types/auth";
import { getStoredAuthToken } from "@/lib/auth";

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
  const response = await fetch(`${API_BASE_URL}/auth/register/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
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

  const response = await fetch(
    `${API_BASE_URL}/auth/reset-generated-password`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        password: payload.password,
        password_confirmation: payload.password_confirmation,
      }),
    },
  );

  return await handleResponse<ResetPasswordResponse>(response);
};
