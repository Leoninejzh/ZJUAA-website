import type { Metadata } from "next";
import PastActivitiesPage from "@/components/PastActivitiesPage";

export const metadata: Metadata = {
  title: "过往活动 | 浙大大纽约校友会",
  description: "浙大大纽约校友会过往活动回顾",
};

export default function PastActivities() {
  return <PastActivitiesPage />;
}
