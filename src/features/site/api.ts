import { api } from "@/services/axios";
import { ApiResponse } from "@/types";
import { PublicLandingData } from "./types";

export const getPublicLandingData = async (): Promise<ApiResponse<PublicLandingData>> => {
  return await api.get<ApiResponse<PublicLandingData>>("/public");
};
