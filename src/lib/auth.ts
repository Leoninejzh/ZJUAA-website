import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production",
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        const username = process.env.ADMIN_USERNAME;
        const passwordHash = process.env.ADMIN_PASSWORD_HASH;
        const plainPassword = process.env.ADMIN_PASSWORD;

        if (!username || !credentials?.password) {
          return null;
        }

        if (credentials.username !== username) {
          return null;
        }

        let valid = false;
        if (passwordHash) {
          valid = await compare(credentials.password, passwordHash);
        } else if (plainPassword) {
          valid = credentials.password === plainPassword;
        }
        if (!valid) return null;

        return { id: "admin", name: username };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
} as NextAuthOptions;
