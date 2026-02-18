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
        const username = (credentials?.username ?? "").trim();
        const password = (credentials?.password ?? "").trim();
        if (!password) return null;

        // 1. 优先匹配环境变量（解决 Luning 进不去的问题）
        const envAdminUser = process.env.ADMIN_USERNAME || "admin";
        const envAdminPass = process.env.ADMIN_PASSWORD;

        if (username === envAdminUser && envAdminPass && password === envAdminPass) {
          return {
            id: "admin-id",
            name: envAdminUser,
            email: "admin@zjuaa.org",
            role: "ADMIN",
          };
        }

        // 2. 环境变量不匹配时，尝试数据库（SiteSettings）
        let dbUsername = (process.env.ADMIN_USERNAME ?? "").trim() || undefined;
        let passwordHash = (process.env.ADMIN_PASSWORD_HASH ?? "").trim() || undefined;
        let plainPassword = (process.env.ADMIN_PASSWORD ?? "").trim() || undefined;

        if (!dbUsername || (!passwordHash && !plainPassword)) {
          try {
            const { prisma } = await import("@/lib/prisma");
            const dbUrl = process.env.DATABASE_URL;
            const skipDb = process.env.SKIP_DATABASE === "1" || !dbUrl;
            if (!skipDb) {
              const adminUser = await prisma.siteSettings.findUnique({
                where: { key: "admin_username" },
              });
              const adminHash = await prisma.siteSettings.findUnique({
                where: { key: "admin_password_hash" },
              });
              if (adminUser) dbUsername = adminUser.value;
              if (adminHash) passwordHash = adminHash.value;
            }
          } catch {}
        }

        dbUsername = dbUsername || (process.env.ADMIN_USERNAME ?? "admin").trim() || "admin";
        if (!passwordHash && !plainPassword) plainPassword = (process.env.ADMIN_PASSWORD ?? "admin123").trim() || "admin123";

        if (username !== dbUsername) return null;

        const valid = passwordHash
          ? await compare(password, passwordHash)
          : password === plainPassword;
        if (!valid) return null;

        return { id: "admin-id", name: dbUsername };
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
