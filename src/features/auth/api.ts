import { API_BASE_URL, handleResponse } from "@/services/api";
import {
  RegisterPayload,
  RegisterResponse,
  VerifyRegisterPayload,
  VerifyRegisterResponse,
} from "@/types/auth";

export const registerUser = async (
  payload: RegisterPayload
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
  payload: VerifyRegisterPayload
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
