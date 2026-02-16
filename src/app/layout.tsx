import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import { SettingsProvider } from "@/components/SettingsProvider";
import "./globals.css";

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "捐赠 Donation | 浙大大纽约校友会",
  description:
    "支持浙大大纽约校友会 - 您的慷慨捐赠将帮助我们实现使命，支持校友社区，传承求是精神。",
  keywords: ["浙江大学", "校友会", "捐赠", "纽约", "ZJU", "Donation"],
  openGraph: {
    title: "捐赠 Donation | 浙大大纽约校友会",
    description: "支持浙大大纽约校友会 - 您的慷慨捐赠将帮助我们实现使命",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={notoSans.variable}>
      <body className="font-sans">
        <SessionProvider>
          <SettingsProvider>{children}</SettingsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
