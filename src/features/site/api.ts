import { API_BASE_URL, handleResponse } from "@/services/api";
import { getStoredAuthToken } from "@/lib/auth";
import { ApiResponse } from "@/types";
import {
  LegalItem,
  PublicBannerItem,
  PublicLandingData,
  PublicPackagesData,
  SendContactPayload,
  SendContactResponse,
} from "./types";

export const getPublicLandingData = async (): Promise<ApiResponse<PublicLandingData>> => {
  const response = await fetch(`${API_BASE_URL}/public`);
  const data = await handleResponse<ApiResponse<PublicLandingData>>(response);
  return data;
};

export const getPublicBanners = async (): Promise<ApiResponse<PublicBannerItem[]>> => {
  const response = await fetch(`${API_BASE_URL}/public/banners`, {
    headers: {
      Accept: "application/json",
    },
  });
  return await handleResponse<ApiResponse<PublicBannerItem[]>>(response);
};

export const getAdminBanners = async (token?: string): Promise<ApiResponse<PublicBannerItem[]>> => {
  const authToken = token || getStoredAuthToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/banners`, {
    headers,
  });
  return await handleResponse<ApiResponse<PublicBannerItem[]>>(response);
};

export const getPublicPackages = async (): Promise<ApiResponse<PublicPackagesData>> => {
  const response = await fetch(`${API_BASE_URL}/public/packages`);
  const data = await handleResponse<ApiResponse<PublicPackagesData>>(response);
  return data;
};

export const getPublicTerms = async (): Promise<ApiResponse<LegalItem[]>> => {
  const response = await fetch(`${API_BASE_URL}/public/terms`);
  const data = await handleResponse<ApiResponse<LegalItem[]>>(response);
  return data;
};

export const getPublicPrivacy = async (): Promise<ApiResponse<LegalItem[]>> => {
  const response = await fetch(`${API_BASE_URL}/public/privacy`);
  const data = await handleResponse<ApiResponse<LegalItem[]>>(response);
  return data;
};

export const sendContactMessage = async (
  payload: SendContactPayload
): Promise<ApiResponse<SendContactResponse | null>> => {
  const response = await fetch(`${API_BASE_URL}/public/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email?.trim() || null,
      phone: payload.phone?.trim() || null,
      message: payload.message.trim(),
    }),
  });

  return await handleResponse<ApiResponse<SendContactResponse | null>>(response);
};



