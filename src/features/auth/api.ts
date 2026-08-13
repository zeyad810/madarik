import { api } from "@/services/axios";
import { RegisterPayload, RegisterResponse } from "@/types/auth";

export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  return await api.post<RegisterResponse>("/auth/register", payload);
};
