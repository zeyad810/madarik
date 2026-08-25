import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginResponse } from "@/types/auth";

import { handleResponse } from "@/services/api";

export const AUTH_TOKEN_KEY = "auth_token";

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  if (match) {
    try {
      const decoded = decodeURIComponent(match[3]);
      // Remove optional surrounding quotes
      return decoded.replace(/^"|"$/g, "");
    } catch {
      return match[3];
    }
  }
  return null;
}

export function getStoredAuthToken(session?: any): string | null {
  if (session?.accessToken) return session.accessToken;
  if (session?.token) return session.token;
  if (session?.user?.accessToken) return session.user.accessToken;
  if (session?.user?.token) return session.user.token;
  if (typeof window !== "undefined") {
    // 1. Check Cookies
    const cookieToken =
      getCookie("token") ||
      getCookie("auth_token") ||
      getCookie("accessToken") ||
      getCookie("jwt") ||
      getCookie("madarik_token") ||
      getCookie("next-auth.session-token") ||
      getCookie("__Secure-next-auth.session-token");
    if (cookieToken) return cookieToken;

    // 2. Check LocalStorage
    const local =
      localStorage.getItem(AUTH_TOKEN_KEY) ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("auth_token");
    if (local) return local;
  }
  return null;
}

const API_BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://madarik.themiify.com/api/v1";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          throw new Error("يرجى إدخال رقم الهاتف وكلمة المرور");
        }

        try {
          const formattedPhone = credentials.phone.trim();

          const response = await fetch(
            `${API_BASE_URL.replace(/\/+$/, "")}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                phone: formattedPhone,
                password: credentials.password,
              }),
            },
          );

          const data = await handleResponse<LoginResponse>(response);

          if (data && data.token) {
            const user = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              phone: data.user.phone,
              change_by_admin: Boolean(
                data.user.change_by_admin === true ||
                (data.user.change_by_admin as any) === 1 ||
                (data.user.change_by_admin as any) === "1" ||
                (data.user.change_by_admin as any) === "true"
              ),
              status: data.user.status,
              phone_verified_at: data.user.phone_verified_at,
              otp_attempts: data.user.otp_attempts,
              otp_locked_until: data.user.otp_locked_until,
              created_at: data.user.created_at,
              updated_at: data.user.updated_at,
              children: (data.user.children || data.children || []).map(
                (c: any) => ({
                  ...c,
                  status: c.status || "active",
                  avatar_img: c.avatar_img || c.avatar || null,
                  avatar: c.avatar || c.avatar_img || null,
                }),
              ),
              accessToken: data.token,
              token: data.token,
              user_type: data.user_type,
              is_subscribed: data.is_subscribed,
            };
            return user;
          }

          return null;
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("حدث خطأ أثناء الاتصال بالخادم");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
        token.accessToken = user.accessToken;
        token.token = user.token || user.accessToken;
        token.user_type = user.user_type;
        token.is_subscribed = user.is_subscribed;
        token.change_by_admin = Boolean(
          user.change_by_admin === true ||
          (user.change_by_admin as any) === 1 ||
          (user.change_by_admin as any) === "1" ||
          (user.change_by_admin as any) === "true"
        );
        token.status = user.status;
        token.phone_verified_at = user.phone_verified_at;
        token.otp_attempts = user.otp_attempts;
        token.otp_locked_until = user.otp_locked_until;
        token.created_at = user.created_at;
        token.updated_at = user.updated_at;
        token.children = user.children;
      }
      if (trigger === "update" && session) {

        if (session.user?.name) {
          token.name = session.user.name;
        } else if (session.name) {
          token.name = session.name;
        }
        if (session.user?.phone) {
          token.phone = session.user.phone;
        } else if (session.phone) {
          token.phone = session.phone;
        }
        if (session.user?.children) {
          token.children = session.user.children;
        } else if (session.children) {
          token.children = session.children;
        }
        if (session.user?.change_by_admin !== undefined) {
          token.change_by_admin = Boolean(
            session.user.change_by_admin === true ||
            (session.user.change_by_admin as any) === 1 ||
            (session.user.change_by_admin as any) === "1" ||
            (session.user.change_by_admin as any) === "true"
          );
        } else if (session.change_by_admin !== undefined) {
          token.change_by_admin = Boolean(
            session.change_by_admin === true ||
            (session.change_by_admin as any) === 1 ||
            (session.change_by_admin as any) === "1" ||
            (session.change_by_admin as any) === "true"
          );
        }
      }
      return token;

    },
    async session({ session, token }) {
      if (token) {
        const tokenValue = (token.accessToken || token.token) as string;
        session.accessToken = tokenValue;
        session.token = tokenValue;
        session.user_type = token.user_type as string;
        session.is_subscribed = token.is_subscribed as boolean;
        session.user = {
          ...session.user,
          id: (token.id as string) || "",
          name: token.name ?? "",
          email: token.email ?? null,
          phone: (token.phone as string) || "",
          change_by_admin: token.change_by_admin as boolean,
          status: (token.status as string) || "",
          phone_verified_at: (token.phone_verified_at as string | null) ?? null,
          otp_attempts: token.otp_attempts as number,
          otp_locked_until: (token.otp_locked_until as string | null) ?? null,
          created_at: token.created_at as string,
          updated_at: token.updated_at as string,
          children: token.children || [],
        };
      }
      console.log(
        "NextAuth Server Session Data:",
        JSON.stringify(session, null, 2),
      );
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "fallback_secret_for_madarik_app",
};
