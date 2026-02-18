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
        const inputUser = (credentials?.username ?? "").trim();
        const inputPass = (credentials?.password ?? "").trim();
        if (!inputPass) return null;

        // 恢复模式：使用环境变量登录，便于改密
        if (process.env.ADMIN_USE_DEFAULT === "1") {
          const recoveryUser = (process.env.ADMIN_USERNAME ?? "admin").trim();
          const recoveryPass = (process.env.ADMIN_PASSWORD ?? "admin123").trim();
          if (inputUser === recoveryUser && inputPass === recoveryPass) {
            return { id: "admin", name: recoveryUser };
          }
          return null;
        }

        let username = (process.env.ADMIN_USERNAME ?? "").trim() || undefined;
        let passwordHash = (process.env.ADMIN_PASSWORD_HASH ?? "").trim() || undefined;
        let plainPassword = (process.env.ADMIN_PASSWORD ?? "").trim() || undefined;

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

        username = username || (process.env.ADMIN_USERNAME ?? "admin").trim() || "admin";
        if (!passwordHash && !plainPassword) plainPassword = (process.env.ADMIN_PASSWORD ?? "admin123").trim() || "admin123";

        if (inputUser !== username) return null;

        let valid = false;
        if (passwordHash) {
          valid = await compare(inputPass, passwordHash);
        } else if (plainPassword) {
          valid = inputPass === plainPassword;
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
