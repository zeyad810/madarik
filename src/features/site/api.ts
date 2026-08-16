import { api } from "@/services/axios";
import { ApiResponse } from "@/types";
import { PublicLandingData } from "./types";

export const getPublicLandingData = async (): Promise<ApiResponse<PublicLandingData>> => {
  const response = await api.get<ApiResponse<PublicLandingData>>("/public");
  console.log("Public landing API response:", response);
  return response;
};
