import { DefaultSession } from "next-auth";
import { AuthUser, Child } from "./auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    phone?: string;
    accessToken?: string;
    token?: string;
    user_type?: string;
    is_subscribed?: boolean;
    change_by_admin?: boolean;
    status?: string;
    phone_verified_at?: string | null;
    otp_attempts?: number;
    otp_locked_until?: string | null;
    created_at?: string;
    updated_at?: string;
    children?: Child[];
  }

  interface Session {
    accessToken?: string;
    token?: string;
    user_type?: string;
    is_subscribed?: boolean;
    user: AuthUser & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string | null;
    email?: string | null;
    phone?: string;
    accessToken?: string;
    token?: string;
    user_type?: string;
    is_subscribed?: boolean;
    change_by_admin?: boolean;
    status?: string;
    phone_verified_at?: string | null;
    otp_attempts?: number;
    otp_locked_until?: string | null;
    created_at?: string;
    updated_at?: string;
    children?: Child[];
  }
}

