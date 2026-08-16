import { api } from "@/services/axios";
import {
  RegisterPayload,
  RegisterResponse,
  VerifyRegisterPayload,
  VerifyRegisterResponse,
} from "@/types/auth";

export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  return await api.post<RegisterResponse>("/auth/register", payload);
};

export const verifyRegisterOtp = async (
  payload: VerifyRegisterPayload
): Promise<VerifyRegisterResponse> => {
  return await api.post<VerifyRegisterResponse>("/auth/register/verify", payload);
};
