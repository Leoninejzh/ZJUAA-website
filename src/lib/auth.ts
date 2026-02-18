import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        // 打印日志，这样我们能在 Google Cloud Logs 看到是谁在尝试登录
        console.log("正在尝试登录，用户名:", credentials?.username);
        console.log("期待的管理员用户名:", process.env.ADMIN_USERNAME);

        const { username, password } = credentials || {};

        // 只要用户名匹配环境变量（Luning）且密码匹配，就放行
        if (
          username === process.env.ADMIN_USERNAME &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "admin-id",
            name: process.env.ADMIN_USERNAME,
            role: "ADMIN",
          };
        }

        // 保底：如果数据库已经同步，尝试从数据库找 (解决 Luning 进不去的问题)
        // const user = await prisma.user.findFirst({ where: { username } });

        throw new Error("用户名或密码错误");
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
