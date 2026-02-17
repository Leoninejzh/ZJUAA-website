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
        let username = process.env.ADMIN_USERNAME;
        let passwordHash = process.env.ADMIN_PASSWORD_HASH;
        let plainPassword = process.env.ADMIN_PASSWORD;

        // 环境变量未设置时，从数据库读取或使用默认
        if (!username || (!passwordHash && !plainPassword)) {
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
              if (adminUser) username = adminUser.value;
              if (adminHash) passwordHash = adminHash.value;
            }
          } catch {}
        }

        username = username || "admin";
        if (!passwordHash && !plainPassword) plainPassword = "admin123";

        if (!credentials?.password) return null;
        if (credentials.username !== username) return null;

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
