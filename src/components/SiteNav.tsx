"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, CalendarClock } from "lucide-react";
import { useSettings } from "./SettingsProvider";

export default function SiteNav() {
  const { settings } = useSettings();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className={`flex items-center gap-2 font-medium transition-colors ${
                pathname === "/"
                  ? "text-zju-blue"
                  : "text-gray-600 hover:text-zju-blue"
              }`}
            >
              <Home className="w-4 h-4" />
              返回首页
            </Link>
            <Link
              href="/activities/past"
              className={`flex items-center gap-2 font-medium transition-colors ${
                pathname === "/activities/past"
                  ? "text-zju-blue"
                  : "text-gray-600 hover:text-zju-blue"
              }`}
            >
              <Calendar className="w-4 h-4" />
              过往活动
            </Link>
            <Link
              href="/activities/upcoming"
              className={`flex items-center gap-2 font-medium transition-colors ${
                pathname === "/activities/upcoming"
                  ? "text-zju-blue"
                  : "text-gray-600 hover:text-zju-blue"
              }`}
            >
              <CalendarClock className="w-4 h-4" />
              活动预告
            </Link>
          </div>
          <span className="text-sm text-gray-500">{settings.navBrand}</span>
        </div>
      </div>
    </nav>
  );
}
