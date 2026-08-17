import { API_BASE_URL, handleResponse } from "@/services/api";
import { ApiResponse } from "@/types";
import { PublicLandingData, PublicPackagesData } from "./types";

export const getPublicLandingData = async (): Promise<ApiResponse<PublicLandingData>> => {
  const response = await fetch(`${API_BASE_URL}/public`);
  const data = await handleResponse<ApiResponse<PublicLandingData>>(response);
  console.log("Public landing API response:", data);
  return data;
};

export const getPublicPackages = async (): Promise<ApiResponse<PublicPackagesData>> => {
  const response = await fetch(`${API_BASE_URL}/public/packages`);
  const data = await handleResponse<ApiResponse<PublicPackagesData>>(response);
  console.log("Public packages API response:", data);
  return data;
};
