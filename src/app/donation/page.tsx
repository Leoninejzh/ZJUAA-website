import type { Metadata } from "next";
import DonationPage from "@/components/DonationPage";

export const metadata: Metadata = {
  title: "捐赠 Donation | 浙大大纽约校友会",
  description:
    "支持浙大大纽约校友会 - 您的慷慨捐赠将帮助我们实现使命，支持校友社区，传承求是精神。",
  openGraph: {
    title: "捐赠 Donation | 浙大大纽约校友会",
    description: "支持浙大大纽约校友会 - 您的慷慨捐赠将帮助我们实现使命",
  },
};

export default function Donation() {
  return <DonationPage />;
}
