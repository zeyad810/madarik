import { DefaultSession } from "next-auth";
import { Child } from "./auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    phone?: string;
    accessToken?: string;
    user_type?: string;
    children?: Child[];
    is_subscribed?: boolean;
    status?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      phone?: string;
      user_type?: string;
      children?: Child[];
      is_subscribed?: boolean;
      status?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    phone?: string;
    accessToken?: string;
    user_type?: string;
    children?: Child[];
    is_subscribed?: boolean;
    status?: string;
  }
}
