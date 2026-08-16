import { api } from "@/services/axios";
import { ApiResponse } from "@/types";
import { PublicLandingData, PublicPackagesData } from "./types";

export const getPublicLandingData = async (): Promise<ApiResponse<PublicLandingData>> => {
  const response = await api.get<ApiResponse<PublicLandingData>>("/public");
  console.log("Public landing API response:", response);
  return response;
};

export const getPublicPackages = async (): Promise<ApiResponse<PublicPackagesData>> => {
  const response = await api.get<ApiResponse<PublicPackagesData>>("/public/packages");
  console.log("Public packages API response:", response);
  return response;
};
