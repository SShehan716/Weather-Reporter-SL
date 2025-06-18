import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isVerified: boolean;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    }
  }
} 