import { API_BASE_URL, handleResponse } from "@/services/api";
import { ApiResponse } from "@/types";
import {
  LegalItem,
  PublicLandingData,
  PublicPackagesData,
  SendContactPayload,
  SendContactResponse,
  SubscribeNewsletterPayload,
  SubscribeNewsletterResponse,
} from "./types";

export const getPublicLandingData = async (): Promise<ApiResponse<PublicLandingData>> => {
  const response = await fetch(`${API_BASE_URL}/public`);
  const data = await handleResponse<ApiResponse<PublicLandingData>>(response);
  return data;
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

export const subscribeNewsletter = async (
  payload: SubscribeNewsletterPayload
): Promise<SubscribeNewsletterResponse> => {
  const response = await fetch(`${API_BASE_URL}/public/newsletter/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: payload.email.trim(),
    }),
  });

  return await handleResponse<SubscribeNewsletterResponse>(response);
};
