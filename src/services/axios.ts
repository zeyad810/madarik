import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { AUTH_TOKEN_KEY } from "../lib/auth";
import { ApiError, ApiErrorResponse } from "../types";


declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
    skipErrorToast?: boolean;
  }
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const axiosConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const apiClient: AxiosInstance = axios.create(axiosConfig);

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.skipAuth && typeof window !== "undefined") {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Handle 401 Unauthorized globally
      if (status === 401 && typeof window !== "undefined") {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }

      const message =
        data?.message ||
        (typeof data === "string" ? data : error.message) ||
        `Request failed with status code ${status}`;

      return Promise.reject(new ApiError(message, status, data || null));
    }

    if (error.request) {
      return Promise.reject(
        new ApiError("No response received from server. Please check your network connection.", 0, null)
      );
    }

    return Promise.reject(new ApiError(error.message || "An unexpected error occurred", 500, null));
  }
);

// Helper methods returning payload directly
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },
  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },
  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },
  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};

export default apiClient;

