import type { Metadata } from "next";
import UpcomingActivitiesPage from "@/components/UpcomingActivitiesPage";

export const metadata: Metadata = {
  title: "活动预告 | 浙大大纽约校友会",
  description: "浙大大纽约校友会活动预告",
};

export default function UpcomingActivities() {
  return <UpcomingActivitiesPage />;
}
