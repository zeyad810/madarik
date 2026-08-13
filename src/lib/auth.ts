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
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              phone: data.user.phone,
              accessToken: data.token,
              user_type: data.user_type,
              children: data.children || data.user.children || [],
              is_subscribed: data.is_subscribed,
              status: data.user.status,
            };
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
        token.user_type = user.user_type;
        token.children = user.children;
        token.is_subscribed = user.is_subscribed;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name,
          email: token.email,
          phone: token.phone,
          user_type: token.user_type,
          children: token.children,
          is_subscribed: token.is_subscribed,
          status: token.status,
        };
      }
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
