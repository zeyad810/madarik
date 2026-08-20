import { Child } from "@/types/auth";

export interface ManagedChild {
  id: string;
  name: string;
  ageCategory: string; // e.g. "5-9 سنوات", "10-12 سنة", "13-15 سنة"
  avatar: string;
  avatar_img?: string | null;
  gender: "male" | "female";
  status: "active" | "inactive";
  birthDate?: string;
  badgesCount?: number;
}

export interface AddChildPayload {
  name: string;
  birth_date: string;
  gender: "male" | "female";
  status?: "active" | "inactive" | string;
  avatar?: string | null;
  avatar_img?: string | null;
  avatarFile?: File | null;
}

export interface AddChildResponse {
  success?: boolean;
  message?: string;
  data?: Child;
  child?: Child;
}

export interface ParentChildrenResponse {
  success?: boolean;
  message?: string;
  data?: Child[];
}

