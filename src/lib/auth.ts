import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { LoginResponse } from "@/types/auth";

export const AUTH_TOKEN_KEY = "auth_token";

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

          const response = await axios.post<LoginResponse>(
            `${API_BASE_URL}/auth/login`,
            {
              phone: formattedPhone,
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          const data = response.data;

          if (data && data.token) {
            const user = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              phone: data.user.phone,
              change_by_admin: data.user.change_by_admin,
              status: data.user.status,
              phone_verified_at: data.user.phone_verified_at,
              otp_attempts: data.user.otp_attempts,
              otp_locked_until: data.user.otp_locked_until,
              created_at: data.user.created_at,
              updated_at: data.user.updated_at,
              children: data.user.children || data.children || [],
              accessToken: data.token,
              token: data.token,
              user_type: data.user_type,
              is_subscribed: data.is_subscribed,
            };
            return user;
          }

          return null;
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            const message =
              error.response?.data?.message ||
              error.response?.data?.error ||
              "فشل تسجيل الدخول، يرجى التأكد من بيانات الاعتماد";
            throw new Error(message);
          }
          throw new Error("حدث خطأ أثناء الاتصال بالخادم");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
        token.accessToken = user.accessToken;
        token.token = user.token || user.accessToken;
        token.user_type = user.user_type;
        token.is_subscribed = user.is_subscribed;
        token.change_by_admin = user.change_by_admin;
        token.status = user.status;
        token.phone_verified_at = user.phone_verified_at;
        token.otp_attempts = user.otp_attempts;
        token.otp_locked_until = user.otp_locked_until;
        token.created_at = user.created_at;
        token.updated_at = user.updated_at;
        token.children = user.children;
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
      console.log("NextAuth Server Session Data:", JSON.stringify(session, null, 2));
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
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "fallback_secret_for_madarik_app",
};
