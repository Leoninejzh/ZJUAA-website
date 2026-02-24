import type { Metadata } from "next";
import DonationPage from "@/components/DonationPage";
import { getSettings } from "@/lib/get-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.siteTitle || "捐赠 Donation | 浙大大纽约校友会",
    description:
      settings.siteDescription ||
      "支持浙大大纽约校友会 - 您的慷慨捐赠将帮助我们实现使命",
    openGraph: {
      title: settings.siteTitle || "捐赠 Donation | 浙大大纽约校友会",
      description:
        settings.siteDescription ||
        "支持浙大大纽约校友会 - 您的慷慨捐赠将帮助我们实现使命",
    },
  };
}

export default function Home() {
  return <DonationPage />;
}
